# Foody App

Este es un proyecto full-stack que consiste en una aplicación móvil desarrollada con Expo/React Native y un backend en Node.js con Express y Prisma.

## Estructura del Proyecto

El proyecto está dividido en dos partes principales:

- `frontend/`: Aplicación móvil desarrollada con Expo/React Native
- `backend/`: Servidor API desarrollado con Node.js, Express y Prisma

## Requisitos Previos

- Node.js (versión LTS recomendada)
- pnpm (gestor de paquetes)
- Expo CLI (`npm install -g expo-cli`)
- PostgreSQL (para la base de datos)

## Configuración del Backend

1. Navega al directorio del backend:
```bash
cd backend
```

2. Instala las dependencias:
```bash
pnpm install
```

3. Configura las variables de entorno:
Crea un archivo `.env` en el directorio `backend` con el siguiente contenido:
```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/nombre_base_datos"
JWT_SECRET="tu_secreto_jwt"
PORT=3000
```

4. Inicializa la base de datos:
```bash
pnpm prisma:generate
pnpm prisma:push
```

5. Inicia el servidor de desarrollo:
```bash
pnpm dev
```

## Configuración del Frontend

1. Navega al directorio del frontend:
```bash
cd frontend
```

2. Instala las dependencias:
```bash
pnpm install
```

3. Configura las variables de entorno:
Crea un archivo `.env` en el directorio `frontend` con el siguiente contenido:
```env
API_URL=http://localhost:3000
```

4. Inicia la aplicación:
```bash
pnpm start
```

## Ejecutar la Aplicación

### Backend
- Desarrollo: `pnpm dev`
- Producción: `pnpm build` seguido de `pnpm start`

### Frontend
- Desarrollo: `pnpm start`
- Para iOS: `pnpm ios`
- Para Android: `pnpm android`

## Tecnologías Principales

### Backend
- Node.js
- Express
- TypeScript
- Prisma (ORM)
- PostgreSQL
- JWT para autenticación

### Frontend
- Expo
- React Native
- TypeScript
- React Navigation
- Expo Router

## Notas Importantes

- Asegúrate de tener PostgreSQL instalado y corriendo antes de iniciar el backend
- El backend debe estar corriendo para que el frontend funcione correctamente
- Para desarrollo móvil, necesitarás tener instalado el Expo Go en tu dispositivo o un emulador
