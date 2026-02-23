# Inventario Toreto (con logo ADO)

Front-end HTML que genera PDF y abre WhatsApp/correo. Backend opcional para envío automático.

## Estructura
```
/ (raíz)
├── index.html
├── logo.png
└── backend/
    ├── package.json
    ├── server.js
    └── .env.example
```

## Uso rápido
1. Abre `index.html` en tu navegador.
2. Captura el checklist, genera y descarga el PDF. El botón **Enviar** abre WhatsApp/correo (adjunta el PDF descargado).

## Backend opcional
1. `cd backend && npm install`
2. Copia `.env.example` a `.env` y rellena credenciales.
3. `npm start`
4. En `index.html` asigna `const BACKEND_URL = "http://localhost:3000"` para envío automático.
