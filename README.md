# HueX Mobile

Aplicación móvil para ayudar a personas con daltonismo a identificar colores y simular visión.

## Estructura del Proyecto

- `backend/`: API REST construida con NestJS.
- `mobile/`: Aplicación móvil construida con React Native (Expo).

## Requisitos

- Node.js
- npm
- Expo Go (en tu dispositivo móvil) o Emulador Android/iOS.

## Instrucciones de Instalación

### Backend

1. Navega a la carpeta `backend`:
   ```bash
   cd backend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia el servidor:
   ```bash
   npm run start:dev
   ```
   El servidor correrá en `http://localhost:3000`.

### Mobile

1. Navega a la carpeta `mobile`:
   ```bash
   cd mobile
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia la aplicación:
   ```bash
   npx expo start -- -c
   ```
4. Escanea el código QR con la app Expo Go en tu móvil.

## Funcionalidades

### 🔍 Escáner de Color Mejorado
- **Identificación Precisa**: Uso de cámara con retícula de alta visibilidad.
- **Base de Datos Bilingüe**: Identifica ~400 colores con nombres en **Inglés / Español**.
- **Captura "Single-Shot"**: Previsualización fluida sin parpadeos y captura de alta calidad al pulsar.

### ⭐ Favoritos e Historial
- **Guardado Local**: Guarda tus colores escaneados en Favoritos.
- **Historial Reciente**: Accede a los últimos colores identificados.
- **Persistencia**: Los datos se guardan en el dispositivo.

### 🛠️ Otras Herramientas
- **Inicio**: Dashboard con acceso rápido.
- **Simulador**: (En desarrollo) Filtros de simulación de modos de visión.

## Tecnologías

- **Frontend**: React Native, Expo, NativeWind (TailwindCSS), React Navigation.
- **Backend**: NestJS, TypeORM, SQLite.
- **Cámara & Imagen**: `expo-camera`, `expo-image-manipulator`.

## Notas de la Versión

- **Mejora de UI/UX**: Se eliminó el "stutter" de la cámara usando un sistema de captura bajo demanda.
- **Traducción Completa**: Se completó la traducción de toda la librería de colores.
