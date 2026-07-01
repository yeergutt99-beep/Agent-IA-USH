# Sistema Inteligente de Reservas para Restaurante

Monorepo full-stack con React + Vite + TypeScript, Material UI, Node/Express, Firebase Firestore/Auth, Telegram Bot API y OpenAI Responses API con function calling.

## Estructura
- `frontend/`: panel administrativo autenticado con Firebase Auth.
- `backend/`: API modular Express con controladores, rutas, servicios, repositorios Firestore e integraciones Telegram/OpenAI.
- `firestore.rules`: reglas para acceso autenticado del panel; el backend usa Admin SDK.

## Variables de entorno
Backend: `FIREBASE_PROJECT_ID`, `OPENAI_API_KEY`, `OPENAI_MODEL`, `TELEGRAM_BOT_TOKEN`, `FRONTEND_ORIGIN`, `PORT`.
Frontend: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_APP_ID`, `VITE_API_URL`.

## Comandos
```bash
npm install
npm run dev
npm run build
```

## Seguridad y reglas de negocio
El frontend nunca llama a OpenAI ni expone claves. Las reservas se crean solo en el backend, que revalida disponibilidad, evita duplicados activos por cliente/fecha/hora y conserva cancelaciones para auditoría.
