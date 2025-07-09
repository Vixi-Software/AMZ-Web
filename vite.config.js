import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';
import path from "path"
import { fileURLToPath } from "url"
const __dirname = path.dirname(fileURLToPath(import.meta.url))
import tailwindcss from "@tailwindcss/vite"
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [plugin(), tailwindcss(),],
    server: {
        port: 55667,
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
})