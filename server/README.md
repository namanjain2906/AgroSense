# Server deployment notes

This project expects a few environment variables to be set when deployed (Render, Heroku, Vercel serverless services, etc.).

Required env vars:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Strong random string for signing JWTs
- `FRONTEND_URL` - Comma-separated list of allowed frontend origins (e.g. `https://agrosense-delta.vercel.app`)

Optional (recommended for production):
- `NODE_ENV=production`
- `COOKIE_SECURE=true` (ensures cookies are sent only over HTTPS)

Quick Render checklist
1. Push your updated server code to the Git repo (this repo contains CORS updates).
2. In Render dashboard for your service, set the following environment variables:
   - `MONGODB_URI` = <your mongo uri>
   - `JWT_SECRET` = <a long random string>
   - `FRONTEND_URL` = `https://agrosense-delta.vercel.app`
   - `NODE_ENV` = `production`
   - `COOKIE_SECURE` = `true`
3. Trigger a redeploy (or restart the service).
4. Verify the service health endpoint: `GET https://<your-render-service>/health` should return HTTP 200.

Troubleshooting CORS issues
- If the browser reports `No 'Access-Control-Allow-Origin' header is present`, confirm the deployed server is the latest code and that `FRONTEND_URL` includes your frontend origin.
- Check server logs — the server prints `CORS allowed origins` on startup showing what it allows.
- Ensure the frontend is sending credentials only when needed: the client uses `withCredentials: true` for refresh routes; ensure `COOKIE_SECURE=true` and HTTPS are active in production.

Local testing
- Run the server locally with the env in `.env.example` adjusted for your machine.
- Start frontend dev server; ensure `client/.env` contains `VITE_API_BASE_URL` pointing to your backend.

