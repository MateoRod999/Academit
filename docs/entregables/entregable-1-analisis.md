## Descripción del problema

Un instituto educativo privado administra hoy a sus alumnos, docentes, cursos, evaluaciones, asistencias, matrículas, cuotas y pagos en planillas, documentos y registros independientes, sin una fuente única de información.

Esa dispersión genera estas dificultades:

- Consultar rápido los datos de un alumno.
- Conocer su situación académica (notas y asistencias).
- Registrar inscripciones y controlar los cupos de cada curso.
- Organizar cursos, materias y ciclos lectivos.
- Registrar calificaciones y asistencias de forma ordenada.
- Gestionar matrículas, generar cuotas y registrar pagos.
- Detectar cuotas vencidas y calcular la deuda de cada alumno.
- Obtener información general de la institución.

Por eso se necesita un sistema web que centralice estas operaciones, con acceso diferenciado según el rol de cada usuario.

## Objetivos

### Objetivo general

Desarrollar un sistema web integral que permita gestionar los aspectos académicos, administrativos y financieros de un instituto educativo, y que demuestre la correspondencia entre análisis, diseño, base de datos, backend, API, frontend y pruebas.

### Objetivos específicos

- Relevar y documentar los actores, requisitos funcionales y no funcionales y reglas de negocio del instituto.
- Modelar el sistema con UML (casos de uso, clases y secuencia) y con un DER propio.
- Diseñar e implementar una base de datos relacional que garantice la integridad de los datos.
- Desarrollar un backend en Java con Spring Boot, organizado en capas (Controller, Service, Repository).
- Exponer una API REST documentada para la comunicación con el frontend.
- Construir un frontend responsive con HTML5, CSS3 y Bootstrap, con validaciones.
- Implementar autenticación y control de acceso por roles.
- Verificar el funcionamiento con pruebas documentadas y presentar el sistema en una defensa oral.

## Actores

El sistema tiene cuatro actores; el rol Alumno es opcional según el enunciado y aquí se incluye con consultas y trámites académicos básicos.

| Actor | Qué puede hacer |
| --- | --- |
| Administrador | Gestionar usuarios, alumnos, docentes, cursos, materias y ciclos lectivos; consultar inscripciones; gestionar matrículas; consultar cuotas; registrar y consultar pagos; consultar información académica. |
| Personal administrativo | Registrar alumnos; gestionar inscripciones; registrar matrículas; consultar cuotas; registrar pagos; consultar la deuda de los alumnos; consultar información básica de los estudiantes; consultar docentes y sus asignaciones de curso y materia (solo lectura). |
| Docente | Consultar sus cursos asignados y los alumnos de esos cursos; registrar y consultar evaluaciones; registrar calificaciones; registrar asistencias; consultar información académica de sus cursos. |
| Alumno | Consultar sus datos personales, plan de estudios, materias, calificaciones, asistencias, matrícula, cuotas y pagos realizados; inscribirse a mesas de examen y presentar la declaración jurada de materias a cursar. |

## Requisitos funcionales

Se listan 45 requisitos agrupados por módulo. Cada uno se vincula luego con un caso de uso, clases, tablas, endpoints, pantallas y pruebas.

| Código | Requisito | Actor principal |
| --- | --- | --- |
| **Usuarios y acceso** |  |  |
| RF01 | Autenticar usuarios (login con usuario y contraseña) | Todos |
| RF02 | Cerrar sesión | Todos |
| RF03 | Gestionar usuarios (alta, modificación, baja lógica) | Administrador |
| RF04 | Asignar rol a un usuario | Administrador |
| RF05 | Restringir funcionalidades según el rol | Sistema |
| **Alumnos** |  |  |
| RF06 | Registrar alumno | Administrador, Administrativo |
| RF07 | Modificar alumno | Administrador, Administrativo |
| RF08 | Consultar y buscar alumnos (por DNI, apellido o nombre) | Administrador, Administrativo, Docente |
| RF09 | Dar de baja lógicamente a un alumno | Administrador |
| **Docentes** |  |  |
| RF10 | Registrar docente | Administrador |
| RF11 | Modificar docente | Administrador |
| RF12 | Consultar y buscar docentes | Administrador, Administrativo (solo lectura) |
| RF13 | Dar de baja a un docente | Administrador |
| **Cursos, materias y ciclos** |  |  |
| RF14 | Registrar curso con capacidad máxima | Administrador |
| RF15 | Modificar y consultar cursos | Administrador |
| RF16 | Asociar un curso a un ciclo lectivo | Administrador |
| RF17 | Registrar, modificar, consultar y dar de baja materias | Administrador |
| RF18 | Asociar materias a cursos | Administrador |
| RF19 | Asignar docentes a cursos y materias | Administrador |
| RF20 | Registrar y consultar ciclos lectivos | Administrador |
| RF21 | Consultar los alumnos inscriptos en un curso | Administrador, Administrativo, Docente |
| **Inscripciones** |  |  |
| RF22 | Registrar inscripción de un alumno a un curso y ciclo lectivo, verificando cupo | Administrativo |
| RF23 | Consultar inscripciones | Administrador, Administrativo |
| RF24 | Anular una inscripción | Administrativo |
| **Matrículas** |  |  |
| RF25 | Registrar matrícula de un alumno en un ciclo lectivo | Administrativo |
| RF26 | Consultar matrículas (por alumno y por ciclo lectivo) | Administrador, Administrativo |
| RF27 | Modificar el estado de una matrícula (pendiente, activa, cancelada) | Administrador, Administrativo |
| **Cuotas y pagos** |  |  |
| RF28 | Generar las 12 cuotas mensuales de una matrícula | Administrativo |
| RF29 | Consultar cuotas (por alumno y por matrícula) | Administrador, Administrativo, Alumno |
| RF30 | Actualizar a vencidas las cuotas impagas con vencimiento pasado | Sistema |
| RF31 | Anular una cuota | Administrador |
| RF32 | Registrar pago completo de una cuota (medio de pago y usuario que lo registra) | Administrador, Administrativo |
| RF33 | Consultar pagos por alumno, por cuota y por período | Administrador, Administrativo |
| RF34 | Consultar situación administrativa del alumno (cuotas pendientes y vencidas, importe adeudado, total abonado) | Administrador, Administrativo, Alumno |
| RF35 | Consultar deuda de los alumnos | Administrativo |
| **Evaluaciones y calificaciones** |  |  |
| RF36 | Registrar evaluación (materia, curso, fecha, tipo, descripción) | Docente |
| RF37 | Consultar y modificar evaluaciones | Docente |
| RF38 | Registrar calificación de un alumno en una evaluación | Docente |
| RF39 | Modificar calificación | Docente |
| RF40 | Consultar calificaciones de un alumno | Administrador, Docente, Alumno |
| **Asistencias** |  |  |
| RF41 | Registrar asistencia de un curso en una fecha (presente, ausente, tardanza, justificado) | Docente |
| RF42 | Consultar historial de asistencia de un alumno | Administrador, Docente, Alumno |
| RF43 | Calcular porcentaje de asistencia, asistencias e inasistencias (opcional) | Docente, Alumno |
| **Consultas generales** |  |  |
| RF44 | Consultar situación académica del alumno (materias, notas y asistencias) | Administrador, Docente, Alumno |
| RF45 | Consultar los cursos asignados al docente | Docente |
| RF46 | Generar el seguro cuatrimestral de una matrícula (3 por ciclo lectivo) y registrar su pago completo | Administrativo |
| RF47 | Gestionar el plan de estudios (materias por año y correlativas) | Administrador |
| RF48 | Consultar el plan de estudios y las correlativas | Alumno, Administrador, Administrativo, Docente |
| RF49 | Gestionar mesas de examen (materia, fecha, docente, cupo) | Administrador |
| RF50 | Inscribirse a una mesa de examen y dar de baja esa inscripción | Alumno |
| RF51 | Presentar la declaración jurada de materias a cursar en un ciclo lectivo | Alumno |
| RF52 | Consultar declaraciones juradas e inscriptos a cada mesa de examen | Administrador, Administrativo, Docente |
| RF53 | Gestionar carreras (alta, modificación, consulta y baja lógica) | Administrador |
| RF54 | Asociar cada plan de estudios y cada curso a una carrera | Administrador |
| RF55 | Consultar carreras, sus planes de estudios y sus cursos | Todos |
| RF56 | Solicitar cambio de carrera (funcionalidad adicional) | Alumno |
| RF57 | Resolver un cambio de carrera y reasignar el plan de estudios del alumno (funcionalidad adicional) | Administrador, Administrativo |
| RF58 | Consultar las asignaciones de docentes a cursos y materias | Administrador, Administrativo (solo lectura) |

## Requisitos no funcionales

| Código | Categoría | Requisito |
| --- | --- | --- |
| RNF01 | Seguridad | Las contraseñas se almacenan cifradas (hash con BCrypt) y nunca en texto plano. |
| RNF02 | Seguridad | El acceso a la API requiere autenticación; las rutas no públicas rechazan solicitudes sin sesión válida (HTTP 401). |
| RNF03 | Control de acceso | Cada endpoint y pantalla se restringe según el rol; un rol sin permiso recibe HTTP 403. |
| RNF04 | Usabilidad | La interfaz es consistente: navbar, tablas, formularios, tarjetas y alertas de Bootstrap; los errores se informan con mensajes claros. |
| RNF05 | Diseño responsive | Todas las pantallas se adaptan a computadora, tablet y celular. |
| RNF06 | Rendimiento | Las consultas habituales (listados y búsquedas) responden en menos de 3 segundos con datos de prueba; los listados extensos usan paginación. |
| RNF07 | Validación | Los datos se validan en el frontend y en el backend: obligatorios, longitud, formato, fechas, valores numéricos, email y duplicados. |
| RNF08 | Integridad de datos | La base usa claves primarias y foráneas, restricciones únicas y NOT NULL; las operaciones críticas (pago, inscripción) son transaccionales. |
| RNF09 | Mantenibilidad | El backend se organiza en capas Controller, Service y Repository, con separación entre entidades y DTO. |
| RNF10 | Organización del código | Paquetes y nombres consistentes, código comentado donde corresponda y repositorio con control de versiones. |
| RNF11 | Compatibilidad | El sistema funciona en los navegadores actuales (Chrome, Firefox, Edge). |
| RNF12 | Auditoría | Cada pago registra el usuario que lo realizó y la fecha. |

## Reglas de negocio

| Código | Regla | Requisitos |
| --- | --- | --- |
| RN01 | Un alumno no puede tener dos inscripciones para el mismo curso y ciclo lectivo. | RF22 |
| RN02 | Un alumno solo puede tener una inscripción por ciclo lectivo. | RF22 |
| RN03 | Un curso no puede superar su capacidad máxima de alumnos. | RF14, RF22 |
| RN04 | Para inscribir, el alumno, el curso y el ciclo lectivo deben existir y estar activos. | RF22 |
| RN05 | Una matrícula pertenece a un único alumno y a un único ciclo lectivo, y no puede duplicarse. | RF25 |
| RN06 | Una cuota debe estar asociada a una matrícula; no existen cuotas sueltas. | RF28 |
| RN07 | Una cuota impaga cuya fecha de vencimiento ya pasó se considera VENCIDA. | RF30 |
| RN08 | Una cuota pasa a PAGADA al registrarse su pago completo; una cuota PAGADA tiene exactamente un pago. | RF32 |
| RN09 | No se admiten pagos parciales: el pago debe ser por el importe completo de la cuota, y no puede registrarse sobre una cuota PAGADA o ANULADA. | RF32 |
| RN10 | Todo pago registra la cuota, la fecha, el importe, el medio de pago y el usuario que lo cargó. | RF32 |
| RN11 | Un docente solo puede registrar evaluaciones y calificaciones en los cursos y materias que tiene asignados. | RF36, RF38 |
| RN12 | Un docente solo puede registrar asistencia de los cursos que tiene asignados. | RF41 |
| RN13 | No se puede eliminar un alumno con información académica o administrativa histórica; se usa baja lógica. | RF09 |
| RN14 | Solo se registran calificaciones de alumnos inscriptos en el curso de la evaluación, y la nota debe estar entre 1 y 10. | RF38 |
| RN15 | En un mismo curso y fecha, un alumno tiene un solo registro de asistencia. | RF41 |
| RN16 | Solo se puede registrar una matrícula en un ciclo lectivo existente; la matrícula CANCELADA no genera nuevas cuotas. | RF25, RF27 |
| RN17 | Un usuario tiene un único rol y solo accede a las funciones permitidas para ese rol. | RF05 |
| RN18 | Además de las 12 cuotas mensuales, cada matrícula tiene un seguro que se paga cada cuatrimestre (3 por ciclo lectivo); tiene su propio vencimiento, importe y estado, y se paga completo. | RF28, RF46 |
| RN19 | Un alumno solo puede inscribirse a una mesa de examen de una materia que figure en su plan de estudios y una sola vez por mesa; la mesa no puede superar su cupo. | RF49, RF50 |
| RN20 | La declaración jurada solo incluye materias del plan de estudios cuyas correlativas el alumno tenga aprobadas, y se presenta una vez por ciclo lectivo con matrícula ACTIVA. | RF47, RF51 |
| RN21 | Una evaluación o examen se aprueba con nota igual o mayor a 4; con nota menor a 4 queda desaprobado. | RF38, RF40 |
| RN22 | Cada alumno cursa una carrera a través de un único plan de estudios vigente; el plan pertenece a una sola carrera. | RF06, RF47, RF54 |
| RN23 | Cada curso pertenece a una única carrera y a un único ciclo lectivo; un alumno solo puede inscribirse a cursos de su carrera. | RF14, RF22, RF54 |
| RN24 | Las correlativas se definen dentro de un plan de estudios y solo vinculan materias de ese plan; una materia no puede ser correlativa de sí misma. | RF47 |
| RN25 | No se puede eliminar una carrera con planes, cursos o alumnos asociados; se usa baja lógica. | RF53 |
| RN26 | Un cambio de carrera requiere aprobación y conserva el historial académico del alumno; solo cambia su plan de estudios vigente. | RF56, RF57 |
| RN27 | El personal administrativo solo puede consultar docentes y sus asignaciones; el alta, la modificación y la baja son exclusivas del Administrador. | RF10, RF11, RF12, RF19, RF58 |

Decisiones de diseño que el grupo debe confirmar: quedaron definidas 12 cuotas mensuales por matrícula, un seguro cuatrimestral, pagos siempre completos (sin pagos a cuenta), notas de 1 a 10 con 4 como mínimo para aprobar, y el rol Alumno con consulta de sus datos, inscripción a exámenes y declaración jurada de materias a cursar.
