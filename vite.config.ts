// vite.config.js
import vue from "@vitejs/plugin-vue";
import {   
    compilerOptions
} from "./tsconfig.json"

import path, {resolve} from "path";
import {defineConfig} from "vite";

// @ts-ignore
const alias = Object.entries(compilerOptions.paths)
    .reduce((acc, [key, [value]]) => {
        const aliasKey = key.substring(0, key.length - 2)
        const path = value.substring(0, value.length - 2)
        return {
            ...acc,
            [aliasKey]: resolve(__dirname, path)
        }
    }, {})

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias
    },
    // ...other config,
});