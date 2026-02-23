# Inventario Toreto – Envío automático por correo

Este proyecto sirve tu `index.html` y expone un endpoint `/api/send-email` para **adjuntar y enviar** el PDF generado a `j.a.l.h@outlook.com`.

## Requisitos
- Node.js 18+

## Instalación
```bash
npm install
```

## Configuración
Copia `.env.example` a `.env` y completa tus credenciales SMTP:
```bash
cp .env.example .env
# edita .env y coloca SMTP_USER/SMTP_PASS, etc.
```

> Para Outlook/Office 365 suele funcionar `SMTP_HOST=smtp.office365.com` y `SMTP_PORT=587` con STARTTLS.

## Ejecutar
```bash
npm start
```
Abre: <http://localhost:3000>

## Flujo de uso
1. Llena el formulario.
2. Presiona **Generar PDF**.
3. Se descargará el PDF **y** se enviará automáticamente al correo configurado.

## Notas
- Si sirves `index.html` desde este mismo servidor, no necesitas CORS.
- Revisa la consola del servidor por errores de autenticación SMTP.
