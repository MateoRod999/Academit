#!/usr/bin/env python3
"""
tools/guia-modulos.py
Genera docs/backend/guia-de-modulos.md inspeccionando:
- docs/frontend/endpoints.csv
- docs/frontend/entidades.json
- docs/frontend/openapi.yaml
- docs/estado-del-proyecto.md
Regenerar: python3 tools/guia-modulos.py
"""

import os
import re
import csv
import json
import glob

def parse_controllers():
    controllers = glob.glob('backend/src/main/java/**/controller/*Controller.java', recursive=True)
    implemented = set()
    for c in controllers:
        with open(c, encoding='utf-8') as f:
            content = f.read()
        base_match = re.search(r'@RequestMapping\(\"([^\"]+)\"\)', content)
        base_path = base_match.group(1) if base_match else ''
        methods = re.findall(r'@(GetMapping|PostMapping|PutMapping|DeleteMapping|PatchMapping)(?:\(\"?([^\"]*)\"?\))?', content)
        for m, p in methods:
            p = p.strip('\"')
            full_p = base_path + (p if p.startswith('/') or not p else '/' + p)
            if full_p.endswith('/'):
                full_p = full_p[:-1]
            m_name = m.replace('Mapping', '').upper()
            implemented.add((m_name, full_p))
    return implemented

def parse_endpoints_csv():
    endpoints = []
    with open('docs/frontend/endpoints.csv', encoding='utf-8') as f:
        reader = csv.reader(f)
        next(reader)
        for row in reader:
            endpoints.append({
                'metodo': row[0].strip().upper(),
                'ruta': row[1].strip(),
                'desc': row[2].strip(),
                'roles': [r.strip() for r in row[3].split(',') if r.strip()],
                'pantalla': row[4].strip(),
                'funcion': row[5].strip(),
            })
    return endpoints

def parse_entidades():
    with open('docs/frontend/entidades.json', encoding='utf-8') as f:
        data = json.load(f)
    entities = {}
    for ent in data.get('entidades', []):
        name = ent.get('nombre')
        calcs = [c['nombre'] for c in ent.get('camposCalculados', [])]
        entities[name] = {
            'calcs': calcs,
            'desc': ent.get('descripcion', '')
        }
    return entities

def parse_estados_proyecto():
    estados = {}
    if os.path.exists('docs/estado-del-proyecto.md'):
        with open('docs/estado-del-proyecto.md', encoding='utf-8') as f:
            for line in f:
                if line.startswith('| **') and '|' in line:
                    parts = [p.strip() for p in line.split('|')]
                    if len(parts) >= 8:
                        mod_name = parts[1].replace('*', '').strip()
                        estado = parts[6].replace('*', '').strip()
                        estados[mod_name.lower()] = estado
    return estados

def get_module_metadata():
    # Metadata fija por módulo: olas, entidades, tablas, dependencias, reglas de negocio y preguntas abiertas
    return {
        'ciclos-lectivos': {
            'nombre': 'Ciclos Lectivos',
            'ola': 1,
            'entidades_tablas': '`CicloLectivo` (`ciclo_lectivo`)',
            'entidad_json': 'CicloLectivo',
            'dependencias': '`auth`, `usuarios`',
            'reglas': 'RF20, RN04 (vigencia del ciclo y no superposición)',
            'preguntas': 'Validar si solo un ciclo puede estar vigente a la vez.'
        },
        'carreras': {
            'nombre': 'Carreras',
            'ola': 1,
            'entidades_tablas': '`Carrera` (`carrera`)',
            'entidad_json': 'Carrera',
            'dependencias': '`auth`, `usuarios`',
            'reglas': 'RF17, RN17 (código único, baja lógica)',
            'preguntas': 'Confirmar si baja de carrera inhabilita nuevos planes.'
        },
        'planes-estudio': {
            'nombre': 'Planes de Estudio',
            'ola': 1,
            'entidades_tablas': '`PlanEstudio` (`plan_estudio`)',
            'entidad_json': 'PlanEstudio',
            'dependencias': '`carreras`',
            'reglas': 'RF17, RN17 (resolución ministerial, año de vigencia)',
            'preguntas': 'Verificar si un plan cerrado permite cursadas activas.'
        },
        'materias': {
            'nombre': 'Materias',
            'ola': 1,
            'entidades_tablas': '`Materia` (`materia`), `Correlatividad` (`correlatividad`)',
            'entidad_json': 'Materia',
            'dependencias': '`planes-estudio`',
            'reglas': 'RF17, RF18, RN17 (correlatividades regulares y aprobadas)',
            'preguntas': 'Grafo de correlativas acíclico validado en backend.'
        },
        'alumnos': {
            'nombre': 'Alumnos',
            'ola': 2,
            'entidades_tablas': '`Alumno` (`alumno`), `EstadoPersonaEnum`',
            'entidad_json': 'Alumno',
            'dependencias': '`ciclos-lectivos`, `carreras`, `planes-estudio`',
            'reglas': 'RF06-RF09, RF34, RN04 (estado ACTIVO/INACTIVO, DNI único, baja lógica)',
            'preguntas': 'Cálculo consolidado de situación académica y administrativa.'
        },
        'docentes': {
            'nombre': 'Docentes',
            'ola': 2,
            'entidades_tablas': '`Docente` (`docente`), `EstadoPersonaEnum`',
            'entidad_json': 'Docente',
            'dependencias': '`auth`, `usuarios`',
            'reglas': 'RF10-RF13, RN11, RN12 (legajo único, estado ACTIVO/INACTIVO)',
            'preguntas': 'Revisar si docente inactivo retiene histórico de cursos.'
        },
        'cursos': {
            'nombre': 'Cursos (Comisiones)',
            'ola': 3,
            'entidades_tablas': '`Curso` (`curso`), `TurnoEnum`',
            'entidad_json': 'Curso',
            'dependencias': '`ciclos-lectivos`, `carreras`',
            'reglas': 'RF14-RF16, RN03, RN04 (cupo máximo, turno y ciclo activo)',
            'preguntas': 'Validar si la capacidad máxima puede reducirse con alumnos inscriptos.'
        },
        'asignaciones': {
            'nombre': 'Asignaciones Docentes',
            'ola': 3,
            'entidades_tablas': '`CursoMateria` (`curso_materia`), `RolDocenteEnum`',
            'entidad_json': 'Asignacion',
            'dependencias': '`cursos`, `materias`, `docentes`',
            'reglas': 'RF19, RN11, RN12 (rol titular/adjunto, unicidad curso-materia-docente)',
            'preguntas': 'Permitir múltiples docentes con distinto rol en la misma comisión.'
        },
        'inscripciones': {
            'nombre': 'Inscripciones a Cursos',
            'ola': 4,
            'entidades_tablas': '`Inscripcion` (`inscripcion`)',
            'entidad_json': 'Inscripcion',
            'dependencias': '`alumnos`, `cursos`, `ciclos-lectivos`',
            'reglas': 'RF22-RF24, RN01, RN02, RN03, RN04 (control de cupo estricto, una por ciclo/curso)',
            'preguntas': 'Restricción atómica de concurrencia al validar cupo.'
        },
        'matriculas': {
            'nombre': 'Matrículas Anuales',
            'ola': 5,
            'entidades_tablas': '`Matricula` (`matricula`), `EstadoMatriculaEnum`',
            'entidad_json': 'Matricula',
            'dependencias': '`alumnos`, `ciclos-lectivos`',
            'reglas': 'RF25-RF27, RN05, RN18 (1 por alumno/ciclo, estadoPago calculado, anulación de cuotas pendientes)',
            'preguntas': 'Regeneración de cuotas si la matrícula se reactiva.'
        },
        'cuotas': {
            'nombre': 'Cuotas y Aranceles',
            'ola': 5,
            'entidades_tablas': '`Cuota` (`cuota`), `EstadoCuotaEnum`, `TipoCuotaEnum`',
            'entidad_json': 'Cuota',
            'dependencias': '`matriculas`',
            'reglas': 'RF28-RF31, RN06, RN07, RN18 (12 cuotas mensuales + 3 seguros, vencimiento)',
            'preguntas': 'Tarea programada o cálculo dinámico para cuotas vencidas.'
        },
        'pagos': {
            'nombre': 'Pagos y Comprobantes',
            'ola': 6,
            'entidades_tablas': '`Pago` (`pago`), `MedioPagoEnum`',
            'entidad_json': 'Pago',
            'dependencias': '`matriculas`, `cuotas`, `alumnos`',
            'reglas': 'RF32, RF33, RN08, RN09, RN10 (pago total obligatorio, comprobante AAAA-NNNNNN)',
            'preguntas': 'Validación de medio de pago contra catálogo institucional.'
        },
        'evaluaciones': {
            'nombre': 'Evaluaciones',
            'ola': 7,
            'entidades_tablas': '`Evaluacion` (`evaluacion`), `TipoEvaluacionEnum`',
            'entidad_json': 'Evaluacion',
            'dependencias': '`cursos`, `materias`, `docentes`',
            'reglas': 'RF36, RF37, RN11 (solo docente asignado a la cátedra puede crear evaluación)',
            'preguntas': 'Fecha de evaluación dentro del rango del ciclo lectivo.'
        },
        'calificaciones': {
            'nombre': 'Calificaciones',
            'ola': 7,
            'entidades_tablas': '`Calificacion` (`calificacion`)',
            'entidad_json': 'Calificacion',
            'dependencias': '`evaluaciones`, `alumnos`, `docentes`',
            'reglas': 'RF38-RF40, RN11, RN14, RN21 (escala 1 a 10, nota >= 4 aprobado, solo docente asignado)',
            'preguntas': 'Permitir recalificación con auditoría de usuario modificador.'
        },
        'asistencias': {
            'nombre': 'Asistencias',
            'ola': 7,
            'entidades_tablas': '`Asistencia` (`asistencia`), `EstadoAsistenciaEnum`',
            'entidad_json': 'Asistencia',
            'dependencias': '`cursos`, `materias`, `alumnos`, `docentes`',
            'reglas': 'RF41-RF44, RN11, RN12, RN13 (toma por materia, estados PRESENT/AUSENT/TARDANZA/JUSTIF)',
            'preguntas': 'Cálculo de regularidad académica: mínimo 75% de asistencias.'
        },
        'mesas-examen': {
            'nombre': 'Mesas de Examen',
            'ola': 7,
            'entidades_tablas': '`MesaExamen` (`mesa_examen`), `InscripcionMesa` (`inscripcion_mesa`)',
            'entidad_json': 'MesaExamen',
            'dependencias': '`materias`, `ciclos-lectivos`, `docentes`, `alumnos`',
            'reglas': 'RF45-RF49, RN15 (inscripción previa, verificación de regularidad y tribunal docente)',
            'preguntas': 'Límite de tiempo para darse de baja de la mesa de examen.'
        },
        'declaraciones-juradas': {
            'nombre': 'Declaraciones Juradas',
            'ola': 8,
            'entidades_tablas': '`DeclaracionJurada` (`declaracion_jurada`), `DeclaracionMateria`',
            'entidad_json': 'DeclaracionJurada',
            'dependencias': '`alumnos`, `ciclos-lectivos`, `materias`',
            'reglas': 'RF50-RF52, RN16 (presentación anual, verificación estricta de correlatividades)',
            'preguntas': 'Plazo límite de recepción de DDJJ en el ciclo.'
        },
        'solicitudes': {
            'nombre': 'Solicitudes y Trámites',
            'ola': 8,
            'entidades_tablas': '`Solicitud` (`solicitud`), `TipoSolicitudEnum`',
            'entidad_json': 'Solicitud',
            'dependencias': '`alumnos`, `usuarios`',
            'reglas': 'RF53-RF55, RN17 (resolución administrativa, motivos y estados PENDIENTE/APROBADA/RECHAZADA)',
            'preguntas': 'Notificación o registro de resolución formal por administrativo.'
        },
        'documentacion': {
            'nombre': 'Documentación y Legajos',
            'ola': 8,
            'entidades_tablas': '`Documentacion` (`documentacion`), `TipoDocumentacionEnum`',
            'entidad_json': 'Documentacion',
            'dependencias': '`alumnos`',
            'reglas': 'RF56-RF58, RN17 (verificación física/digital, estados PENDIENTE/ENTREGADO)',
            'preguntas': 'Almacenamiento de adjuntos o solo estado de verificación en legajo.'
        },
        'auth': {
            'nombre': 'Autenticación y Sesión',
            'ola': 0,
            'entidades_tablas': '`Usuario` (`usuario`), `Rol` (`rol`)',
            'entidad_json': 'Usuario',
            'dependencias': 'Ninguna (Infraestructura base)',
            'reglas': 'RF01, RF02, RF05, RN17 (JWT Bearer, logout, expiración, 401/403 estandarizados)',
            'preguntas': 'Ninguna (implementado y verificado).'
        },
        'usuarios': {
            'nombre': 'Gestión de Usuarios',
            'ola': 0,
            'entidades_tablas': '`Usuario` (`usuario`), `Rol` (`rol`)',
            'entidad_json': 'Usuario',
            'dependencias': '`auth`',
            'reglas': 'RF03-RF05, RN17 (CRUD administrativo, hash BCrypt, perfil propio)',
            'preguntas': 'Ninguna (implementado y verificado como módulo modelo).'
        }
    }

def generate_guide():
    impl = parse_controllers()
    csv_eps = parse_endpoints_csv()
    entidades = parse_entidades()
    estados = parse_estados_proyecto()
    metadata = get_module_metadata()

    # Agrupar endpoints por prefijo
    groups = {}
    for ep in csv_eps:
        parts = ep['ruta'].strip('/').split('/')
        prefix = parts[1] if len(parts) > 1 else parts[0]
        groups.setdefault(prefix, []).append(ep)

    doc = []
    doc.append("# Guía de Módulos del Backend - Academit")
    doc.append("")
    doc.append("> Referencia técnica oficial para el desarrollo e implementación de la API REST de **Academit**.")
    doc.append("")
    
    # 1. Cómo usar este documento
    doc.append("## 1. Cómo Usar Este Documento")
    doc.append("")
    doc.append("Cada integrante toma un módulo según el orden de dependencias, crea su rama de trabajo y le pasa a su agente la siguiente instrucción:")
    doc.append("")
    doc.append("> *\"Implementá el módulo `<NOMBRE>` siguiendo docs/backend/guia-de-modulos.md (secciones 2, 3 y la ficha del módulo). Rama `feature/back-<modulo>`. Sin push ni merge.\"*")
    doc.append("")
    doc.append("Al finalizar la implementación, se actualiza la fila correspondiente al módulo en `docs/estado-del-proyecto.md`.")
    doc.append("")

    # 2. Reglas comunes
    doc.append("## 2. Reglas Comunes de Implementación")
    doc.append("")
    doc.append("Todas las capas del backend deben respetar rigurosamente estas convenciones:")
    doc.append("1. **Nombres de campo exactos:** Respetar sin alteraciones el contrato (`entidades.json` y `endpoints.csv`).")
    doc.append("2. **Campos calculados:** Exclusivos en response DTOs; jamás se persisten en base de datos.")
    doc.append("3. **Estructura de errores:** `ProblemDetail` (RFC 7807) extendido con `message` y `errors: [{ campo, mensaje }]`.")
    doc.append("4. **Seguridad y roles:** Validación JWT en filtro; 401 si falta token, 403 si el rol no figura en `x-roles`.")
    doc.append("5. **Sin paginación en servidor:** Los listados devuelven colecciones completas (`List<T>`) directamente.")
    doc.append("6. **Estados de persona:** `ACTIVO` e `INACTIVO`. La condición \"regular\" es académica y por materia.")
    doc.append("7. **Estado de pago de matrícula:** Dinámico (`AL_DIA`, `EN_MORA`, `PENDIENTE`); se anulan cuotas pendientes al cancelar.")
    doc.append("8. **Comprobante de pago:** Formato `AAAA-NNNNNN` emitido por el backend a partir del año y número de pago.")
    doc.append("9. **Baja lógica:** Actualización de estado sin borrado físico en entidades con registros históricos asociados.")
    doc.append("10. **Mensajes de validación:** Claros y en español en todas las anotaciones de Bean Validation.")
    doc.append("11. **Flujo de Git:** Commits convencionales y Pull Requests según `docs/flujo-de-trabajo.md`.")
    doc.append("12. **Módulo de referencia:** `UsuarioController` y `UsuarioService` como ejemplo canónico de arquitectura.")
    doc.append("")

    # 3. Plantilla de un módulo
    doc.append("## 3. Plantilla de un Módulo (Pasos de Desarrollo)")
    doc.append("")
    doc.append("Para cada módulo, seguir sistemáticamente este ciclo de desarrollo en capas:")
    doc.append("1. **DTOs:** Crear `RequestDTO` con Bean Validation (`@NotNull`, `@NotBlank`, `@Size`, etc.) y `ResponseDTO` con campos calculados.")
    doc.append("2. **Service:** Definir interfaz en `service/` e implementar en `service/impl/` con validaciones de negocio transaccionales (`@Transactional`).")
    doc.append("3. **Controller:** Anotar con `@RestController`, mapear ruta base, declarar endpoints exactos y anotar seguridad por rol.")
    doc.append("4. **Tests Unitarios e Integración:** Cobertura obligatoria con Mockito y `@WebMvcTest`:")
    doc.append("   - Caso feliz (200 / 201).")
    doc.append("   - Validación de entrada fallida (400 Bad Request).")
    doc.append("   - Control de acceso por rol (403 Forbidden).")
    doc.append("   - Recurso inexistente (404 Not Found).")
    doc.append("5. **Verificación local:** Ejecutar `./gradlew test -q` y arrancar con `spring.jpa.hibernate.ddl-auto=validate`.")
    doc.append("6. **Entrega:** Declarar endpoints completados sobre el total y documentar dudas abiertas. No inventar endpoints fuera de contrato.")
    doc.append("")

    # 4. Orden y dependencias por olas
    doc.append("## 4. Orden de Desarrollo y Dependencias por Olas")
    doc.append("")
    doc.append("Los módulos de una misma ola se pueden desarrollar en paralelo:")
    doc.append("")
    doc.append("| Ola | Módulos | Dependencias Previas |")
    doc.append("| :---: | :--- | :--- |")
    doc.append("| **Base** | Autenticación y Seguridad, Usuarios | Configuración inicial y Spring Security (Hecho) |")
    doc.append("| **Ola 1** | Ciclos Lectivos, Carreras, Planes de Estudio, Materias | Seguridad y Usuarios |")
    doc.append("| **Ola 2** | Alumnos, Docentes | Ciclos Lectivos, Carreras y Planes de Estudio |")
    doc.append("| **Ola 3** | Cursos (Comisiones), Asignaciones Docentes | Ciclos Lectivos, Materias y Docentes |")
    doc.append("| **Ola 4** | Inscripciones a Cursos | Alumnos, Cursos y Ciclos Lectivos |")
    doc.append("| **Ola 5** | Matrículas Anuales, Cuotas y Aranceles | Alumnos y Ciclos Lectivos |")
    doc.append("| **Ola 6** | Pagos y Tarea de Cuotas Vencidas | Matrículas, Cuotas y Alumnos |")
    doc.append("| **Ola 7** | Evaluaciones, Calificaciones, Asistencias, Mesas de Examen | Cursos, Materias, Docentes y Alumnos |")
    doc.append("| **Ola 8** | Declaraciones Juradas, Solicitudes, Documentación | Alumnos, Planes de Estudio y Carreras |")
    doc.append("")

    # 5. Fichas por módulo
    doc.append("## 5. Fichas por Módulo")
    doc.append("")

    # Ordenar módulos por ola y luego nombre
    ordered_prefixes = sorted(groups.keys(), key=lambda p: (metadata.get(p, {}).get('ola', 99), p))

    for prefix in ordered_prefixes:
        eps = groups[prefix]
        meta = metadata.get(prefix, {
            'nombre': prefix.capitalize(),
            'ola': 99,
            'entidades_tablas': f"`{prefix.capitalize()}`",
            'entidad_json': prefix.capitalize(),
            'dependencias': 'Módulos base',
            'reglas': 'Validaciones del contrato',
            'preguntas': 'Sin preguntas abiertas.'
        })

        # Mapear estado
        name_key = meta['nombre'].lower()
        matched_state = 'Parcial'
        for k, v in estados.items():
            if k in name_key or name_key in k:
                matched_state = v
                break
        if prefix in ['auth', 'usuarios']:
            matched_state = 'Hecho'

        # Endpoints pendientes vs implementados
        pendientes = []
        for ep in eps:
            is_done = (ep['metodo'], ep['ruta']) in impl
            if not is_done:
                roles_str = ', '.join(ep['roles'])
                pendientes.append(f"`{ep['metodo']} {ep['ruta']}` [{roles_str}]")

        total_eps = len(eps)
        done_eps = total_eps - len(pendientes)
        calcs = entidades.get(meta.get('entidad_json', ''), {}).get('calcs', [])
        calcs_str = ', '.join([f"`{c}`" for c in calcs]) if calcs else 'Ninguno'

        doc.append(f"### 5.{ordered_prefixes.index(prefix)+1} Módulo: {meta['nombre']} (`{prefix}`)")
        doc.append(f"- **Estado actual:** {matched_state} | **Rama sugerida:** `feature/back-{prefix}` | **Ola:** {meta['ola']}")
        doc.append(f"- **Entidades y tablas:** {meta['entidades_tablas']}")
        doc.append(f"- **Dependencias:** {meta['dependencias']}")
        doc.append(f"- **Campos calculados:** {calcs_str}")
        doc.append(f"- **Reglas de negocio aplicables:** {meta['reglas']}")
        doc.append(f"- **Endpoints pendientes ({len(pendientes)} de {total_eps} pendientes; {done_eps} listos):**")
        if pendientes:
            for pend in pendientes:
                doc.append(f"  - {pend}")
        else:
            doc.append("  - *Todos los endpoints implementados.*")
        doc.append(f"- **Preguntas abiertas:** {meta['preguntas']}")
        doc.append("")

    # 6. Lo que falta y no es código
    doc.append("## 6. Lo que Falta y No es Código")
    doc.append("")
    doc.append("Las tareas pendientes correspondientes a portada institucional, actualización de diagramas UML/DER, especificaciones de análisis y preparación de la defensa oral se gestionan en:")
    doc.append("- [Entregables y Tareas Pendientes (No Código)](../pendientes.md)")
    doc.append("")

    out_text = '\n'.join(doc)
    os.makedirs('docs/backend', exist_ok=True)
    with open('docs/backend/guia-de-modulos.md', 'w', encoding='utf-8') as f:
        f.write(out_text)

    line_count = len(out_text.splitlines())
    print(f"Guía generada con éxito en docs/backend/guia-de-modulos.md ({line_count} líneas).")

if __name__ == '__main__':
    generate_guide()
