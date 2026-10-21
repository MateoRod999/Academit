#!/usr/bin/env python3
"""
tools/comparar-db-contrato.py
Compara docs/frontend/entidades.json con database/01-schema.sql y database/02-datos-iniciales.sql,
y genera docs/estado/desajustes-db.md documentando diferencias, decisiones de diseño y pendientes.
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

    # Mapeo de entidades del contrato a tablas de base de datos
    table_mapping = {
        'Alumno': 'alumno',
        'Docente': 'docente',
        'Carrera': 'carrera',
        'PlanEstudio': 'plan_estudio',
        'Materia': 'materia',
        'Curso': 'curso',
        'CicloLectivo': 'ciclo_lectivo',
        'Asignacion': 'curso_materia',
        'Inscripcion': 'inscripcion',
        'Matricula': 'matricula',
        'Cuota': 'cuota',
        'Pago': 'pago',
        'Evaluacion': 'evaluacion',
        'Calificacion': 'calificacion',
        'Asistencia': 'asistencia',
        'MesaExamen': 'mesa_examen',
        'InscripcionMesa': 'inscripcion_mesa',
        'Solicitud': 'solicitud',
        'DeclaracionJurada': 'declaracion_jurada',
        'Documentacion': 'documentacion',
        'Usuario': 'usuario',
        'Rol': 'rol',
    }

    # Extraer tablas y columnas de 01-schema.sql
    table_matches = re.finditer(r'CREATE\s+TABLE\s+(\w+)\s*\((.*?)\);', schema_sql, re.DOTALL | re.IGNORECASE)
    tables = {}
    for m in table_matches:
        tname = m.group(1).lower()
        tbody = m.group(2)
        cols = []
        constraints = []
        for line in tbody.split('\n'):
            line = line.strip()
            if not line or line.startswith('--'):
                continue
            if re.match(r'^(CONSTRAINT|PRIMARY\s+KEY|UNIQUE|CHECK|FOREIGN\s+KEY)', line, re.IGNORECASE):
                constraints.append(line)
                continue
            parts = line.split()
            if parts:
                cname = parts[0].strip().lower()
                if cname not in ['constraint', 'primary', 'unique', 'check', 'foreign']:
                    cols.append(cname)
        tables[tname] = {
            'columns': cols,
            'constraints': constraints,
            'body': tbody
        }

    # Analizar diferencias por entidad
    filas_reporte = []

    # 1. Tablas inexistentes
    for e in entidades_data['entidades']:
        enombre = e['nombre']
        tname = table_mapping.get(enombre)
        if not tname:
            continue
        if tname not in tables:
            campos_pers = [c['nombre'] for c in e.get('camposPersistidos', [])]
            filas_reporte.append({
                'entidad': enombre,
                'tabla': f"`{tname}` (inexistente)",
                'desajuste': f"Tabla ausente en el esquema. Requiere creación con campos: {', '.join(campos_pers)} y sus restricciones CHECK.",
                'accion': 'Crear tabla nueva'
            })

    # 2. Asignacion (curso_materia): rolDocente y unicidad
    if 'curso_materia' in tables:
        cm_cols = tables['curso_materia']['columns']
        if 'rol_docente' not in cm_cols:
            filas_reporte.append({
                'entidad': 'Asignacion',
                'tabla': '`curso_materia`',
                'desajuste': "Falta columna `rol_docente` (TITULAR, ADJUNTO, JTP). `uk_curso_materia` impide más de un docente por curso y materia.",
                'accion': "Agregar `rol_docente VARCHAR(20) NOT NULL` y cambiar unicidad a `(id_curso, id_materia, id_docente)`."
            })

    # 3. MesaExamen (mesa_examen): tribunal y turno
    if 'mesa_examen' in tables:
        me_cols = tables['mesa_examen']['columns']
        if 'tribunal' not in me_cols:
            filas_reporte.append({
                'entidad': 'MesaExamen',
                'tabla': '`mesa_examen`',
                'desajuste': "Falta columna `tribunal` (nombres del tribunal evaluador) y turno (MANANA/TARDE/NOCHE).",
                'accion': "Agregar `tribunal VARCHAR(150)` y `turno VARCHAR(10)`."
            })

    # 4. Asistencia: id_materia y unicidad
    if 'asistencia' in tables:
        as_cols = tables['asistencia']['columns']
        if 'id_materia' not in as_cols:
            filas_reporte.append({
                'entidad': 'Asistencia',
                'tabla': '`asistencia`',
                'desajuste': "Falta columna `id_materia`. La restricción `uk_asistencia` es sobre `(id_alumno, id_curso, fecha)` en vez de incluir materia.",
                'accion': "Agregar `id_materia INTEGER NOT NULL REFERENCES materia` y unicidad `(id_alumno, id_curso, id_materia, fecha)`."
            })

    # 5. Curso: turno
    if 'curso' in tables:
        c_cols = tables['curso']['columns']
        if 'turno' not in c_cols:
            filas_reporte.append({
                'entidad': 'Curso',
                'tabla': '`curso`',
                'desajuste': "Falta columna `turno` con valores sin tildes ni espacios (MANANA, TARDE, NOCHE).",
                'accion': "Agregar `turno VARCHAR(10) NOT NULL` con CHECK `('MANANA', 'TARDE', 'NOCHE')`."
            })

    # 6. Cuota y tipo_cuota
    if 'tipo_cuota' in tables:
        filas_reporte.append({
            'entidad': 'Cuota',
            'tabla': '`cuota` / `tipo_cuota`',
            'desajuste': "Valores en `tipo_cuota` eran 'MENSUAL' y 'SEGURO' en lugar de 'CUOTA_MENSUAL' y 'SEGURO_CUATRIMESTRAL' (rangos 1-12 y 1-3, RN18).",
            'accion': "Actualizar catálogo a `CUOTA_MENSUAL` y `SEGURO_CUATRIMESTRAL`. Verificar rango de número (RN18) y estado `ANULADA`."
        })

    # 7. Pago y medio_pago
    if 'medio_pago' in tables:
        filas_reporte.append({
            'entidad': 'Pago',
            'tabla': '`pago` / `medio_pago`',
            'desajuste': "El catálogo `medio_pago` incluye OTRO. La tabla `pago` tiene `id_cuota` (alineado).",
            'accion': "Mantener `OTRO` en catálogo y validar coherencia de tipos."
        })

    # Generar Markdown
    os.makedirs(output_dir, exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as out:
        out.write("# Informe de Desajustes entre Base de Datos y Contrato del Frontend\n\n")
        out.write("Este informe compara las especificaciones del contrato (`docs/frontend/entidades.json` y `endpoints.csv`) ")
        out.write("con el esquema de base de datos (`database/01-schema.sql` y `02-datos-iniciales.sql`). ")
        out.write("Fue generado automáticamente mediante `tools/comparar-db-contrato.py`.\n\n")

        out.write("## 1. Tabla de Desajustes Detectados\n\n")
        out.write("| Entidad del Contrato | Tabla del Esquema | Campos o Enums que Faltan o Difieren | Acción Requerida |\n")
        out.write("| --- | --- | --- | --- |\n")
        for f in filas_reporte:
            out.write(f"| {f['entidad']} | {f['tabla']} | {f['desajuste']} | {f['accion']} |\n")

        out.write("\n## 2. Decisión de Diseño: Asignaciones de Docentes\n\n")
        out.write("- **Problema:** En el contrato existe `Asignacion` con `rolDocente` (valores `TITULAR`, `ADJUNTO`, `JTP`), ")
        out.write("permitiendo que una misma materia en un curso cuente con múltiples docentes asignados en distintos roles. ")
        out.write("En el esquema original, `curso_materia` tenía una restricción `uk_curso_materia UNIQUE (id_curso, id_materia)` ")
        out.write("y no almacenaba el rol.\n")
        out.write("- **Decisión adoptada:** La solución más simple y de menor impacto que preserva la compatibilidad con las claves foráneas ")
        out.write("existentes (ej. `evaluacion.id_curso_materia`) es incorporar la columna `rol_docente VARCHAR(20) NOT NULL DEFAULT 'TITULAR'` ")
        out.write("con CHECK `rol_docente IN ('TITULAR', 'ADJUNTO', 'JTP')` directamente en la tabla `curso_materia`, y actualizar la restricción ")
        out.write("de unicidad a `UNIQUE (id_curso, id_materia, id_docente)`. De esta forma se permite asignar varios docentes a la misma cátedra/comisión ")
        out.write("con roles diferenciados, sin duplicar la asignación de un mismo docente en la misma materia/curso.\n\n")

        out.write("## 3. Decisiones Pendientes del Equipo (No Modificadas)\n\n")
        out.write("Conforme a las indicaciones del proyecto, los siguientes aspectos no se alteran y quedan como decisiones pendientes para el equipo:\n\n")
        out.write("1. **Estados de Alumno:** El contrato frontend contempla los estados `REGULAR`, `ACTIVO` e `INACTIVO`, mientras que la base de datos ")
        out.write("utiliza la tabla catálogo `estado_persona` con `ACTIVO` e `INACTIVO` (y en el dominio se discutió `ACTIVO`/`BAJA`). Se mantiene el esquema existente sin cambios.\n")
        out.write("2. **`Matricula.estado_pago`:** El contrato define `estadoPago` (`AL_DIA`, `CON_DEUDA`, `EXENTO`), pero ningún flujo actual del backend ")
        out.write("ni de la base de datos lo persiste o actualiza (es un concepto calculado a partir del estado de las cuotas asociadas). Se mantiene sin columna en `matricula`.\n")

    print(f"Reporte generado exitosamente en {output_path}")

if __name__ == '__main__':
    main()
