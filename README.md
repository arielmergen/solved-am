# LTI - Sistema de Gestión de Candidatos

Este proyecto es una aplicación full-stack que permite gestionar candidatos, con un frontend en React/TypeScript y un backend en Node.js/Express/TypeScript, usando Prisma como ORM y PostgreSQL como base de datos.

## Características

- ✨ Gestión completa de candidatos (CRUD)
- 📝 Formularios validados para crear y editar candidatos
- 📊 Lista de candidatos con filtrado y paginación
- 🔍 Vista detallada de candidatos
- 🔒 Gestión de estados de candidatos (DRAFT, ACTIVE, INACTIVE)
- 📅 Registro de fechas de creación y actualización
- 🎨 Interfaz moderna con Ant Design
- 🐳 Configuración Docker lista para usar

## Requisitos Previos

- Node.js (v18 o superior)
- Docker y Docker Compose
- Git

## Instalación y Configuración

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd <nombre-del-directorio>
```

2. Configura las variables de entorno:

En el directorio `backend`, crea un archivo `.env`:
```env
DATABASE_URL="postgresql://LTIdbUser:D1ymf8wyQEGthFR1E9xhCq@localhost:5432/LTIdb"
PORT=3010
```

En el directorio `frontend`, crea un archivo `.env`:
```env
PORT=3001
VITE_API_URL=http://localhost:3010
```

3. Inicia los servicios con Docker Compose:
```bash
docker-compose up -d
```

Esto iniciará:
- Base de datos PostgreSQL
- Backend en el puerto 3010
- Frontend en el puerto 3001

## Estructura del Proyecto

### Frontend (`/frontend`)
- `/src/components`: Componentes React
- `/src/services`: Servicios de API
- `/src/types`: Tipos TypeScript
- `/src/App.tsx`: Componente principal

### Backend (`/backend`)
- `/src/controllers`: Controladores de la API
- `/src/routes`: Rutas de la API
- `/src/types`: Tipos TypeScript
- `/prisma`: Esquema de la base de datos

## Desarrollo

Para desarrollo local sin Docker:

1. Backend:
```bash
cd backend
npm install
npm run prisma:generate
npm run dev
```

2. Frontend:
```bash
cd frontend
npm install
npm run start
```

## Acceso

- Frontend: http://localhost:3001
- Backend API: http://localhost:3010
- API Docs: http://localhost:3010/api-docs

## Base de Datos

PostgreSQL está configurado con:
- Host: localhost
- Puerto: 5432
- Usuario: LTIdbUser
- Contraseña: D1ymf8wyQEGthFR1E9xhCq
- Base de datos: LTIdb

## Comandos Útiles

```bash
# Reiniciar todos los servicios
docker-compose down && docker-compose up -d

# Ver logs
docker-compose logs -f

# Regenerar tipos de Prisma
cd backend && npm run prisma:generate

# Ejecutar migraciones
cd backend && npm run prisma:migrate

# Construir frontend
cd frontend && npm run build
```

## Solución de Problemas

1. Si el backend no se conecta a la base de datos:
   - Verifica que PostgreSQL esté corriendo: `docker-compose ps`
   - Verifica las credenciales en `.env`
   - Espera unos segundos después de iniciar Docker

2. Si el frontend no se conecta al backend:
   - Verifica que el backend esté corriendo
   - Confirma la URL en `VITE_API_URL`
   - Revisa la consola del navegador para errores CORS