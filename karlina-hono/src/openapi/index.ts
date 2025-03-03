import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";

const openapi = new OpenAPIHono();


openapi.doc("/doc", {
  openapi: "3.0.0",
  info: {
    title: "My API",
    version: "1.0.0",
  },
});


openapi.get("/ui", swaggerUI({ url: "/doc" }));

export default openapi;
