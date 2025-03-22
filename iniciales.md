# Tickets Iniciales - Historia de Usuario: Añadir Candidato al Sistema

## Ticket #1: Backend - Implementación de Modelos y API Candidatos

### Descripción
Implementar la estructura de base de datos y API necesaria para la gestión de candidatos.

### Estructura Requerida
```
backend/
├── prisma/
│   └── schema.prisma
└── src/
    ├── controllers/
    ├── routes/
    ├── services/
    ├── middleware/
    ├── utils/
    ├── config/
    └── tests/
```

### Tareas Técnicas
- [ ] Implementar modelos Prisma:
  - Candidate (datos personales, estado, timestamps)
  - Education (título, institución, fechas)
  - WorkExperience (empresa, cargo, fechas, descripción)
  - CandidateHistory (tracking de cambios)

- [ ] Implementar endpoints REST:
  - POST /api/candidates
  - GET /api/candidates
  - GET /api/candidates/:id
  - PUT /api/candidates/:id
  - DELETE /api/candidates/:id
  - POST /api/candidates/:id/cv

- [ ] Sistema de archivos:
  - Configurar almacenamiento local en /uploads
  - Manejo de CV (PDF/DOCX)
  - Validaciones de archivo

### Criterios de Aceptación
- [ ] Base de datos migrada correctamente
- [ ] Endpoints funcionales con códigos HTTP apropiados
- [ ] Validaciones implementadas
- [ ] Tests pasando
- [ ] Sistema de archivos configurado

### Estimación
- Story Points: 8

## Ticket #2: Frontend - Formulario con Ant Design

### Descripción
Implementar interfaz de usuario para registro de candidatos.

### Estructura Requerida
```
frontend/src/
├── components/
│   └── candidates/
│       ├── CandidateForm
│       ├── EducationForm
│       ├── ExperienceForm
│       └── CVUpload
├── services/
└── tests/
```

### Tareas Técnicas
- [ ] Implementar componentes React con Ant Design:
  - Formulario principal de candidato
  - Formulario de educación (añadir/eliminar)
  - Formulario de experiencia (añadir/eliminar)
  - Componente de carga de CV con preview

- [ ] Implementar funcionalidades:
  - Validaciones en tiempo real
  - Vista previa de CV
  - Sistema de borradores automático
  - Integración con API backend

### Criterios de Aceptación
- [ ] Formulario responsive
- [ ] Validaciones funcionando
- [ ] Preview de CV operativo
- [ ] Sistema de borradores funcionando
- [ ] Tests completos

### Estimación
- Story Points: 5

## Ticket #3: Infraestructura - Sistema de Archivos y Tracking

### Descripción
Implementar sistema de almacenamiento y tracking de cambios.

### Tareas Técnicas
- [ ] Sistema de archivos:
  - Estructura de directorios en /uploads
  - Límites de tamaño configurados
  - Tipos de archivo permitidos

- [ ] Sistema de tracking:
  - Registro de cambios en base de datos
  - API para consulta de histórico

- [ ] Sistema de borradores:
  - Guardado automático
  - Limpieza periódica

### Criterios de Aceptación
- [ ] Archivos almacenados correctamente
- [ ] Tracking funcionando
- [ ] Borradores operativos
- [ ] Tests completos

### Estimación
- Story Points: 5

## Ticket #4: Tests Unitarios

### Descripción
Implementar suite completa de tests.

### Tareas Técnicas
- [ ] Tests Backend:
  - Tests unitarios de controllers y services
  - Tests de integración de API
  - Tests de sistema de archivos

- [ ] Tests Frontend:
  - Tests unitarios de componentes
  - Tests de integración de formularios
  - Tests de sistema de borradores

### Criterios de Aceptación
- [ ] Cobertura mínima 80%
- [ ] Tests documentados
- [ ] Tests ejecutándose localmente
- [ ] Reportes generados

### Estimación
- Story Points: 5

## Ticket #5: Documentación API con Swagger

### Descripción
Implementar documentación interactiva de API.

### Tareas Técnicas
- [ ] Configurar Swagger
- [ ] Documentar endpoints y modelos
- [ ] Implementar UI de Swagger

### Criterios de Aceptación
- [ ] Documentación en /api-docs
- [ ] Endpoints documentados
- [ ] Ejemplos incluidos
- [ ] UI funcional

### Estimación
- Story Points: 3

## Ticket #6: Documentación Frontend

### Descripción
Crear documentación técnica del frontend.

### Tareas Técnicas
- [ ] Documentar en Frontend.md:
  - Estructura del proyecto
  - Componentes principales
  - Guía de instalación
  - Convenciones de código

### Criterios de Aceptación
- [ ] Documentación clara
- [ ] Sin datos sensibles
- [ ] Ejemplos incluidos

### Estimación
- Story Points: 2

## Ticket #7: Documentación Backend

### Descripción
Crear documentación técnica del backend.

### Tareas Técnicas
- [ ] Documentar en Backend.md:
  - Arquitectura
  - Modelos de datos
  - Guía de instalación
  - Convenciones de código

### Criterios de Aceptación
- [ ] Documentación clara
- [ ] Sin datos sensibles
- [ ] Ejemplos incluidos

### Estimación
- Story Points: 2

## Ticket #8: Tests Optimizados

### Descripción
Implementar suite de tests optimizados para alcanzar una cobertura superior al 95%.

### Estructura Requerida
```
backend/src/tests/
├── controllers/
│   └── candidate.test.ts
├── fixtures/
│   └── test.helper.ts
└── test-files/
```

### Tareas Técnicas
- [ ] Tests de Validación de Campos:
  - Validación de campos nulos y undefined
  - Validación de campos vacíos
  - Validación de formatos (email, teléfono)
  - Validación de longitud máxima

- [ ] Tests de Manejo de Archivos:
  - Validación de tipos de archivo permitidos
  - Manejo de archivos faltantes
  - Límites de tamaño de archivo
  - Almacenamiento correcto

- [ ] Tests de Historial:
  - Registro de cambios en campos
  - Validación de estructura del historial
  - Verificación de tipos de cambio
  - Persistencia de datos históricos

- [ ] Tests de Orden Cronológico:
  - Validación de timestamps
  - Orden de cambios históricos
  - Consistencia temporal
  - Manejo de actualizaciones simultáneas

### Criterios de Aceptación
- [ ] Cobertura total superior al 95%
- [ ] Tests documentados y organizados por funcionalidad
- [ ] Manejo correcto de casos de error
- [ ] Validaciones completas implementadas
- [ ] Sistema de archivos probado exhaustivamente
- [ ] Historial verificado completamente

### Métricas de Cobertura
- Validación de campos: 100%
- Manejo de archivos: 95%
- Historial de cambios: 98%
- Orden cronológico: 100%
- Total estimado: 98%

### Estimación
- Story Points: 5

### Dependencias
- Requiere #1 (Backend - Implementación de Modelos y API)
- Requiere #3 (Infraestructura - Sistema de Archivos)

### Notas Técnicas
- Usar TestHelper para configuración común
- Implementar limpieza de datos entre tests
- Mantener independencia entre tests
- Documentar casos de prueba específicos
- Incluir pruebas de borde y casos extremos

## Prompts para Tests

### Prompt para Tests de Validación
```
Implementa tests para validar campos requeridos en el controlador de candidatos:
- Prueba para campos nulos o undefined (firstName, lastName)
- Prueba para campos vacíos o solo espacios
- Prueba para validación de formato de email
- Prueba para validación de formato de teléfono
- Prueba para validación de longitud máxima de campos
```

### Prompt para Tests de Archivos
```
Implementa tests para el manejo de archivos en la carga de CV:
- Prueba para rechazar tipos de archivo no permitidos (.txt)
- Prueba para manejar solicitudes sin archivo
- Prueba para rechazar archivos que excedan el límite de tamaño (5MB)
- Prueba para verificar el almacenamiento correcto del archivo
```

### Prompt para Tests de Historial
```
Implementa tests para verificar el historial de cambios:
- Prueba para verificar que se registran los cambios de campos
- Prueba para validar la estructura del historial (candidateId, changeType, changes)
- Prueba para verificar que se registran múltiples cambios en una actualización
- Prueba para comprobar que los cambios incluyen valores antiguos y nuevos
```

### Prompt para Tests de Orden Cronológico
```
Implementa tests para verificar el orden cronológico del historial:
- Prueba para verificar que los cambios más recientes aparecen primero
- Prueba para validar los timestamps de los cambios
- Prueba para comprobar la consistencia del orden en múltiples actualizaciones
- Prueba para verificar el comportamiento con actualizaciones en rápida sucesión
```

## Notas
- Total Story Points: 35
- Orden: #1 -> #3 -> #2 -> #4 -> #5 -> (#6 y #7) -> #8
- Docker configurado con PostgreSQL, Frontend y Backend 