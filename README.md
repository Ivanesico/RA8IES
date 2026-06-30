# El Tiempo en España - RA8IES

Aplicación web meteorológica desarrollada con React y Node.js/Express que consume datos de la API OpenData de AEMET.

El proyecto permite consultar predicciones meteorológicas por comunidad autónoma y provincia, visualizar datos de observación en tiempo real, consultar el radar nacional de lluvias y trabajar con información meteorológica obtenida desde una API externa.

## Descripción del proyecto

RA8IES es una aplicación full stack orientada a la consulta de información meteorológica en España.

El frontend está desarrollado con React y Vite, ofreciendo una interfaz web desde la que el usuario puede buscar predicciones por comunidad autónoma o provincia, consultar observaciones meteorológicas en tiempo real y seleccionar una ubicación mediante un mapa interactivo.

El backend está desarrollado con Node.js y Express. Su función principal es actuar como intermediario entre el frontend y la API OpenData de AEMET, protegiendo la API Key mediante variables de entorno y gestionando las peticiones externas desde el servidor.

## Funcionalidades principales

* Consulta de predicción meteorológica por comunidad autónoma.
* Consulta de predicción meteorológica por provincia.
* Predicción para hoy y mañana.
* Observación meteorológica en tiempo real.
* Uso de geolocalización del navegador para obtener datos cercanos.
* Selección manual de ubicación mediante mapa interactivo.
* Visualización del radar nacional de lluvias de España.
* Backend propio para consumir la API de AEMET.
* Gestión de variables de entorno para proteger la API Key.
* Manejo de errores en peticiones al servidor y a la API externa.
* Navegación entre páginas mediante React Router.
* Despliegue del frontend en Netlify.

## Tecnologías utilizadas

### Frontend

* React
* JavaScript
* Vite
* React Router
* Leaflet
* React Leaflet
* Bootstrap
* HTML
* CSS

### Backend

* Node.js
* Express
* CORS
* dotenv
* API REST
* OpenData AEMET

### Herramientas

* Git
* GitHub
* Netlify
* npm

## Estructura del proyecto

```text
RA8IES/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── app.js
│   ├── server.js
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── router/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## Funcionamiento general

La aplicación se divide en dos partes:

### Frontend

El frontend permite al usuario interactuar con la aplicación desde el navegador. Desde la página principal se pueden consultar predicciones por comunidad autónoma o provincia, acceder al radar de lluvias y obtener observaciones meteorológicas mediante ubicación actual o selección manual en un mapa.

### Backend

El backend recibe las peticiones del frontend y las redirige a la API OpenData de AEMET. De esta forma, la clave de la API no queda expuesta en el cliente y se centraliza la lógica de consulta de datos meteorológicos.

## Endpoints principales del backend

Algunos de los endpoints desarrollados son:

```text
GET /api/aemet/prediccion/provincia/hoy/:provincia
GET /api/aemet/prediccion/provincia/manana/:provincia
GET /api/aemet/prediccion/ccaa/hoy/:ccaa
GET /api/aemet/prediccion/ccaa/manana/:ccaa
GET /api/aemet/observacion/convencional/todas
GET /api/aemet/red/radar/nacional
```

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/Ivanesico/RA8IES.git
```

```bash
cd RA8IES
```

## Configuración del backend

### 2. Entrar en la carpeta del backend

```bash
cd backend
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Crear archivo de variables de entorno

Crear un archivo `.env` dentro de la carpeta `backend` con la siguiente variable:

```env
AEMET_API_KEY=tu_api_key_de_aemet
PORT=3000
```

### 5. Ejecutar el backend

```bash
npm run dev
```

O en modo producción:

```bash
npm start
```

El backend se ejecutará por defecto en:

```text
http://localhost:3000
```

## Configuración del frontend

### 6. Entrar en la carpeta del frontend

Desde la raíz del proyecto:

```bash
cd frontend
```

### 7. Instalar dependencias

```bash
npm install
```

### 8. Ejecutar el frontend en desarrollo

```bash
npm run dev
```

El frontend se ejecutará normalmente en:

```text
http://localhost:5173
```

### 9. Generar build de producción

```bash
npm run build
```

## Despliegue

El frontend ha sido desplegado en Netlify, configurando el build del proyecto con Vite y publicando la carpeta `dist`.

Configuración recomendada para Netlify:

```text
Base directory: frontend
Build command: npm run build
Publish directory: dist
```

En caso de usar React Router, es recomendable configurar una redirección a `index.html` para que las rutas funcionen correctamente al recargar la página.

Archivo recomendado `netlify.toml`:

```toml
[build]
  base = "frontend"
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Aprendizajes del proyecto

Durante el desarrollo de este proyecto he trabajado conceptos como:

* Creación de una aplicación con React.
* Organización de componentes reutilizables.
* Navegación con React Router.
* Consumo de APIs externas.
* Creación de un backend con Node.js y Express.
* Uso de variables de entorno para proteger claves privadas.
* Gestión de errores en peticiones HTTP.
* Uso de mapas interactivos con Leaflet.
* Geolocalización desde el navegador.
* Despliegue de aplicaciones frontend en Netlify.
* Resolución de errores de build y configuración en producción.

## Mejoras futuras

* Mejorar el diseño responsive de la aplicación.
* Añadir más información visual a las predicciones.
* Implementar buscadores con autocompletado.
* Añadir favoritos o historial de búsquedas.
* Mejorar el manejo de errores para respuestas vacías de AEMET.
* Desplegar también el backend en una plataforma cloud.
* Añadir pruebas básicas del frontend y backend.

## Autor

Proyecto desarrollado por Iván Escobar Sánchez como práctica de desarrollo web con React, Node.js, Express y consumo de APIs externas.
