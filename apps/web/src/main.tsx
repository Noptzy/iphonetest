import { QueryClientProvider } from "@tanstack/react-query"
import { RouterProvider } from "@tanstack/react-router"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { fetchCurrentUser } from "./libs/auth/use-session.ts"
import { getQueryClient } from "./libs/tanstack-query/client.ts"
import { createAppRouter } from "./router.tsx"
import "./styles.css"

async function bootstrap() {
	const queryClient = getQueryClient()
	const user = await fetchCurrentUser()
	const router = createAppRouter({ queryClient, user })

	const rootElement = document.getElementById("root")
	if (!rootElement) throw new Error("Root element not found")

	createRoot(rootElement).render(
		<StrictMode>
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
			</QueryClientProvider>
		</StrictMode>,
	)
}

bootstrap()
