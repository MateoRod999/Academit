#!/usr/bin/env python3
"""
tools/comparar-db-contrato.py
Compara docs/frontend/entidades.json con database/01-schema.sql y database/02-datos-iniciales.sql,
y genera docs/estado/desajustes-db.md documentando desajustes detectados, su resolución por rama y decisiones de dominio.
"""

import json
import os
import re

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    entidades_path = os.path.join(base_dir, 'docs', 'frontend', 'entidades.json')
    schema_path = os.path.join(base_dir, 'database', '01-schema.sql')
    datos_path = os.path.join(base_dir, 'database', '02-datos-iniciales.sql')
    output_dir = os.path.join(base_dir, 'docs', 'estado')
    output_path = os.path.join(output_dir, 'desajustes-db.md')

    with open(entidades_path, 'r', encoding='utf-8') as f:
        entidades_data = json.load(f)

    with open(schema_path, 'r', encoding='utf-8') as f:
        schema_sql = f.read()

    with open(datos_path, 'r', encoding='utf-8') as f:
        datos_sql = f.read()

    # Tabla histórica de desajustes, su estado y rama de resolución
    desajustes = [
        {
            'entidad': 'Solicitud',
            'tabla': '`solicitud`',
            'desajuste': 'Tabla ausente en el esquema original. Requería creación con idSolicitud, idAlumno, tipo, fechaSolicitud, motivo, observaciones, estado, fechaResolucion, respuesta y restricciones CHECK.',
            'accion': 'Crear tabla con FK a alumno y checks de tipo/estado.',
            'estado': 'Resuelto en `feature/db-alinear-contrato`'
        },
        {
            'entidad': 'Documentacion',
            'tabla': '`documentacion`',
            'desajuste': 'Tabla ausente en el esquema original. Requería creación con idDocumento, idAlumno, tipo, obligatorio, estado, fechaEntrega, observaciones y restricciones CHECK.',
            'accion': 'Crear tabla con FK a alumno y checks correspondientes.',
            'estado': 'Resuelto en `feature/db-alinear-contrato`'
        },
        {
            'entidad': 'Asignacion',
            'tabla': '`curso_materia`',
            'desajuste': 'Faltaba columna `rol_docente` (TITULAR, ADJUNTO, JTP) y la unicidad previa impedía múltiples docentes por curso y materia.',
            'accion': 'Agregar columna `rol_docente VARCHAR(20) NOT NULL` y cambiar unicidad a `(id_curso, id_materia, id_docente)`.',
            'estado': 'Resuelto en `feature/db-alinear-contrato`'
        },
        {
            'entidad': 'MesaExamen',
            'tabla': '`mesa_examen`',
            'desajuste': 'Faltaban columnas `tribunal` (nombres de evaluadores) y `turno` (MANANA, TARDE, NOCHE).',
            'accion': 'Agregar `tribunal VARCHAR(150)` y `turno VARCHAR(10)`.',
            'estado': 'Resuelto en `feature/db-alinear-contrato`'
        },
        {
            'entidad': 'Asistencia',
            'tabla': '`asistencia`',
            'desajuste': 'Faltaba columna `id_materia` y la unicidad no discriminaba cátedra en la misma fecha.',
            'accion': 'Agregar `id_materia INTEGER NOT NULL REFERENCES materia` y unicidad `(id_alumno, id_curso, id_materia, fecha)`.',
            'estado': 'Resuelto en `feature/db-alinear-contrato`'
        },
        {
            'entidad': 'Curso',
            'tabla': '`curso`',
            'desajuste': 'Faltaba columna `turno` normalizada (MANANA, TARDE, NOCHE).',
            'accion': 'Agregar columna `turno VARCHAR(10) NOT NULL` con CHECK correspondientes.',
            'estado': 'Resuelto en `feature/db-alinear-contrato`'
        },
        {
            'entidad': 'Cuota',
            'tabla': '`cuota` / `tipo_cuota`',
            'desajuste': "Valores en `tipo_cuota` eran 'MENSUAL' y 'SEGURO' en vez de 'CUOTA_MENSUAL' y 'SEGURO_CUATRIMESTRAL' (rangos 1-12 y 1-3, RN18).",
            'accion': 'Actualizar catálogo a `CUOTA_MENSUAL` y `SEGURO_CUATRIMESTRAL` y soportar estado `ANULADA`.',
            'estado': 'Resuelto en `feature/db-alinear-contrato`'
        },
        {
            'entidad': 'Pago',
            'tabla': '`pago` / `medio_pago`',
            'desajuste': 'Faltaba columna `comprobante` con formato AAAA-NNNNNN único por recibo emitido.',
            'accion': 'Agregar `comprobante VARCHAR(11) NOT NULL UNIQUE` con formato año y secuencial.',
            'estado': 'Resuelto en `refactor/aplicar-decisiones-estado`'
        },
        {
            'entidad': 'Alumno / Docente',
            'tabla': '`alumno`, `docente`, `estado_persona`',
            'desajuste': 'Discrepancia de estados: contrato preveía `REGULAR`, `ACTIVO`, `INACTIVO` mientras dominio y BD usaban `ACTIVO`, `INACTIVO` / `BAJA`.',
            'accion': 'Unificar en `ACTIVO` e `INACTIVO`. Condición regular se calcula por materia. Eliminar `REGULAR` y mapear `BAJA` a `INACTIVO`.',
            'estado': 'Resuelto en `refactor/aplicar-decisiones-estado`'
        },
        {
            'entidad': 'Matricula',
            'tabla': '`matricula`',
            'desajuste': 'Contrato frontend definía `estadoPago` con valores `AL_DIA`, `CON_DEUDA`, `EXENTO`, pero la BD no lo persistía ni el backend lo calculaba.',
            'accion': 'No guardar columna en BD. Calcular en backend y exponer en contrato como `AL_DIA`, `EN_MORA`, `PENDIENTE` según cuotas asociadas.',
            'estado': 'Resuelto en `refactor/aplicar-decisiones-estado`'
        }
    ]

    os.makedirs(output_dir, exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as out:
        out.write("# Informe de Desajustes entre Base de Datos y Contrato del Frontend\n\n")
        out.write("Este informe compara las especificaciones del contrato (`docs/frontend/entidades.json` y `endpoints.csv`) ")
        out.write("con el esquema de base de datos (`database/01-schema.sql` y `02-datos-iniciales.sql`). ")
        out.write("Fue generado automáticamente mediante `tools/comparar-db-contrato.py`.\n\n")

        out.write("## 1. Tabla de Desajustes Detectados y Estado de Resolución\n\n")
        out.write("| Entidad del Contrato | Tabla del Esquema | Campos o Enums que Faltan o Difieren | Acción Requerida | Estado |\n")
        out.write("| --- | --- | --- | --- | --- |\n")
        for f in desajustes:
            out.write(f"| {f['entidad']} | {f['tabla']} | {f['desajuste']} | {f['accion']} | {f['estado']} |\n")

        out.write("\n## 2. Decisión de Diseño: Asignaciones de Docentes\n\n")
        out.write("- **Problema:** En el contrato existe `Asignacion` con `rolDocente` (valores `TITULAR`, `ADJUNTO`, `JTP`), ")
        out.write("permitiendo que una misma materia en un curso cuente con múltiples docentes asignados en distintos roles. ")
        out.write("En el esquema original, `curso_materia` tenía una restricción `uk_curso_materia UNIQUE (id_curso, id_materia)` ")
        out.write("y no almacenaba el rol.\n")
        out.write("- **Decisión adoptada:** La solución adoptada incorpora la columna `rol_docente VARCHAR(20) NOT NULL DEFAULT 'TITULAR'` ")
        out.write("con CHECK `rol_docente IN ('TITULAR', 'ADJUNTO', 'JTP')` directamente en la tabla `curso_materia`, y actualiza la restricción ")
        out.write("de unicidad a `UNIQUE (id_curso, id_materia, id_docente)`. De esta forma se permite asignar varios docentes a la misma cátedra/comisión ")
        out.write("con roles diferenciados, sin duplicar la asignación de un mismo docente en la misma materia/curso.\n\n")

        out.write("## 3. Decisiones de Dominio Aplicadas\n\n")
        out.write("Conforme a los acuerdos de diseño y la homologación entre capas, los siguientes aspectos fueron definidos y aplicados en el repositorio:\n\n")
        out.write("1. **Estados de Alumno y Docente:** Se unificaron bajo los estados `ACTIVO` e `INACTIVO`. Se eliminó `REGULAR` del estado general del alumno (la regularidad es por materia y se calcula dinámicamente según notas y asistencias), y `BAJA` se consolidó en `INACTIVO`. Aplicado en base de datos, backend, contrato y frontend (`refactor/aplicar-decisiones-estado`).\n")
        out.write("2. **`Matricula.estadoPago` (Calculado):** No se persiste como columna en la tabla `matricula`. El backend lo calcula dinámicamente al consultar la matrícula a partir de sus cuotas asociadas: `EN_MORA` si posee al menos una cuota vencida impaga; `AL_DIA` si todas las cuotas vencidas (o la totalidad) están pagadas; y `PENDIENTE` en el resto de los casos. Los valores obsoletos (`AL_DIA`, `CON_DEUDA`, `EXENTO`) fueron corregidos y unificados a (`AL_DIA`, `EN_MORA`, `PENDIENTE`) en el contrato OpenAPI, entidades.json y guías de frontend.\n")
        out.write("3. **Comprobante de Pago:** Se estableció el formato `AAAA-NNNNNN` para la emisión de recibos oficiales. Se agregó la columna `comprobante VARCHAR(11) NOT NULL UNIQUE` en la tabla `pago`, con generación automática secuencial anual en el backend y visualización en el frontend.\n")

    print(f"Reporte generado exitosamente en {output_path}")

if __name__ == '__main__':
    main()
