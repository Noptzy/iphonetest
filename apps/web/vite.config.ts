import { fileURLToPath, URL } from "node:url"
import tailwindcss from "@tailwindcss/vite"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const API_PROXY_TARGET = process.env.VITE_API_PROXY_TARGET || "http://localhost:3001"

const proxyRules = {
	"/rpc": { target: API_PROXY_TARGET, changeOrigin: true },
	"/api": { target: API_PROXY_TARGET, changeOrigin: true },
	"/uploads": { target: API_PROXY_TARGET, changeOrigin: true },
}

export default defineConfig({
	plugins: [
		tanstackRouter({
			target: "react",
			autoCodeSplitting: true,
			routeFileIgnorePattern: "^(_apis|_components|_data|_hooks)",
		}),
		react(),
		tailwindcss(),
	],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
	server: {
		port: 3000,
		proxy: proxyRules,
	},
	preview: {
		port: 3000,
		proxy: proxyRules,
	},
})
