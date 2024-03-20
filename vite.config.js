// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        nested1: resolve("Adminpanel", 'Dashboard/Home.html'),
        nested2: resolve("AdminPanel", 'Authentication/Login.html'),
        nested3: resolve("AdminPanel", 'Doctors/Create.html'),
        nested4: resolve("AdminPanel", 'Doctors/Update.html'),
        nested5: resolve("AdminPanel", 'Doctors/Details.html'),
        nested6: resolve("AdminPanel", 'Messages/Details.html'),
        nested7: resolve("AdminPanel", 'Users/Profile.html'),
        nested8: resolve("Hospital", 'About.html'),
      },
    },
  },
})