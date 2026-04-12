import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { registerAccountApiPlugin } from './vite.register-api.js';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), registerAccountApiPlugin()],
});
