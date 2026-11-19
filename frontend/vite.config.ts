import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import legacy from "@vitejs/plugin-legacy";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    legacy({
      targets: ["defaults", "not IE 11"],
    }),
  ],

  server: {
    host: true,

    // ============================================================
    // LOCAL SERVER
    // ============================================================

    // Local V2 runs on:
    // http://localhost:5173

    // ============================================================
    // TEST SERVER
    // ============================================================

    // Uncomment these for Test Server
    //
    // port: 5182,
    
    // allowedHosts: [
    //   "spotty-dogs-worry.loca.lt",
    // ],

  },
});