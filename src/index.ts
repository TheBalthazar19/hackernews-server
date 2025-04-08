// src/index.ts
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { allRoutes } from "./routes/routes";
import { prismaClient } from "./extras/prisma";
import { env } from "./environment";
import { appDocs } from "./docs/swagger";
import { swaggerUI } from "@hono/swagger-ui";

const app = new Hono();

// Mount all routes
app.route("/", allRoutes);
const openApiSpec = appDocs.getOpenAPIDocument({
  openapi: '3.1.0',
  info: {
      title: 'HackerNews API',
      version: '1.0.0',
      description: 'API for a social media application'
  }
})



app.get('/docs/openapi.json', (c) => {
  return c.json(openApiSpec)
})


app.get('/docs', swaggerUI({ url: '/docs/openapi.json' }))
// Error handling middleware
app.onError((err, c) => {
  console.error(`${err}`);
  return c.json(
    {
      message: "Internal Server Error",
      error: env.NODE_ENV === "development" ? err.message : undefined,
    },
    500
  );
});

// Not found handler
app.notFound((c) => {
  return c.json(
    {
      message: "Not Found",
    },
    404
  );
});

// Start the server
const port = env.PORT ? parseInt(env.PORT.toString(), 10) : 3000;

console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM signal received: closing server");
  await prismaClient.$disconnect();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT signal received: closing server");
  await prismaClient.$disconnect();
  process.exit(0);
});