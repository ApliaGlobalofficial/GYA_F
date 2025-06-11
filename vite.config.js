// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })





import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allows access from external networks
    port: 5173, // Ensure it matches your local port
    strictPort: true, // Ensures Vite doesn't change the port
    allowedHosts: ['cfc4-103-161-199-138.ngrok-free.app'], // Add your ngrok host here
    cors: true, // Enable CORS
  },
});
