// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'


// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(),
//         tailwindcss(),
//   ],
  
// })


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Solution TEMPORAIRE - Désactiver Babel
export default defineConfig({
  plugins: [
    react({
      babel: {
        babelrc: false,
        configFile: false,
      },
    }),
  ],
  server: {
    port: 3000,
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
})