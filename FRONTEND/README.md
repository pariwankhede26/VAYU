# VAYU Frontend

This directory contains the React/Vite user interface. For project architecture, setup instructions, environment variables, and prototype-data limitations, see the repository [README](../README.md).

For optional Vite development, run `npm ci` and `npm run dev` from this directory, and start `node AI-BACKEND/server.js` from the repository root in another terminal. Vite proxies relative `/api` requests to the main server on port 5000.

For the production workflow, build with `npm run build --prefix FRONTEND` and start only `node AI-BACKEND/server.js`. See the repository [README](../README.md) for full setup instructions.
