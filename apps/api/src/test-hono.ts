import { serve } from "@hono/node-server"
import { serveStatic } from "@hono/node-server/serve-static"
import { Hono } from "hono"

const app = new Hono()

app.use("/test1/*", serveStatic({ root: "./uploads", rewriteRequestPath: (p) => p.replace(/^\/test1/, "") }))
app.use("/test2/*", serveStatic({ root: "./uploads", rewriteRequestPath: (p) => p.replace(/^\/test2\//, "") }))
app.use("/test3/*", serveStatic({ root: "./" }))

serve({ fetch: app.fetch, port: 3002 }, () => console.log("Listening on 3002"))
