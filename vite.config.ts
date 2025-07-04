import {defineConfig} from 'vite'
import path from 'path';
import vue from '@vitejs/plugin-vue'
import styleImport, {VantResolve} from 'vite-plugin-style-import';

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    plugins: [vue(), styleImport({
        resolves: [VantResolve()],
    }),]
})
