# Car Catalog

## Descripción
"Car Catalog" es una aplicación web construida con React y Tailwind CSS que permite a los usuarios explorar una lista de automóviles, ver detalles de cada uno y navegar por la aplicación de manera intuitiva.

## Estructura del Proyecto
El proyecto tiene la siguiente estructura de archivos:

```
car-catalog
├── public
│   ├── index.html
│   └── manifest.json
├── src
│   ├── assets
│   │   └── styles
│   │       └── main.css
│   ├── components
│   │   ├── App.jsx
│   │   ├── CarCard.jsx
│   │   ├── CarList.jsx
│   │   ├── Header.jsx
│   │   └── Footer.jsx
│   ├── pages
│   │   ├── Home.jsx
│   │   ├── CarDetails.jsx
│   │   └── NotFound.jsx
│   ├── services
│   │   └── api.js
│   ├── context
│   │   └── CarContext.jsx
│   ├── hooks
│   │   └── useCarData.js
│   ├── utils
│   │   └── helpers.js
│   ├── index.js
│   └── App.test.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── .gitignore
└── README.md
```

## Instalación
1. Clona el repositorio:
   ```
   git clone <URL_DEL_REPOSITORIO>
   ```
2. Navega al directorio del proyecto:
   ```
   cd car-catalog
   ```
3. Instala las dependencias:
   ```
   npm install
   ```

## Uso
Para iniciar la aplicación, ejecuta el siguiente comando:
```
npm start
```
Esto abrirá la aplicación en tu navegador predeterminado en `http://localhost:3000`.

## Contribuciones
Las contribuciones son bienvenidas. Si deseas contribuir, por favor abre un issue o envía un pull request.

## Licencia
Este proyecto está bajo la licencia MIT.