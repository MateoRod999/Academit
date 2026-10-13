# Documentación del Proyecto - Academit

Bienvenido al índice central de documentación técnica y metodológica de **Academit** (TP Integrador - Taller 3).

## Índice General

1. [Flujo de Trabajo del Equipo](flujo-de-trabajo.md): Convenciones de Git, ramas principales y de trabajo, nomenclatura de commits, plantilla de Pull Request y lista de control.
2. [Análisis del Sistema (Entregable 1)](analisis/README.md): Alcance del proyecto, actores del instituto, matriz de Requisitos Funcionales (RF01 - RF57) y Reglas de Negocio (RN01 - RN14).
3. [Diagramas UML](uml/README.md): Diagramas de casos de uso, clases, secuencia y modelo entidad-relación (DER).
4. [Documentación del Frontend](frontend/README.md): Arquitectura de la aplicación React + Vite, guía para agregar pantallas, capa de servicios API y mocks, catálogo de componentes y mapa de pantallas.

---

### Organización del Repositorio
```
docs/
├── README.md               # Este índice general
├── flujo-de-trabajo.md     # Convenciones de Git y desarrollo
├── analisis/
│   └── README.md           # Enlace y resumen del Entregable 1
├── uml/
│   └── README.md           # Modelos y diagramas PlantUML (.puml)
└── frontend/               # Documentación específica del frontend (Fase 2)
    ├── README.md           # Guía general del frontend
    ├── estructura.md       # Organización de directorios y responsabilidades
    ├── agregar-una-pantalla.md  # Guía paso a paso para nuevas pantallas
    ├── api-y-mocks.md      # Funcionamiento de la capa mock y modo API real
    ├── roles-y-permisos.md # Matriz de roles y control de acceso
    ├── componentes.md      # Catálogo de componentes compartidos
    ├── contrato-api.md     # Especificación REST para backend
    └── mapa-de-pantallas.md # Matriz de pantallas, rutas y requisitos
```
