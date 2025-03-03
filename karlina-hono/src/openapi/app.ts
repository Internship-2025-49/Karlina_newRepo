import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { describeRoute } from 'hono-openapi';

import {
  resolver,
  validator as vValidator,
} from 'hono-openapi/valibot';
import { querySchema, responseSchema } from './validation.js';

const app = new Hono();

app.get(
  '/hallo',
  describeRoute({
    description: 'Say hello to the user',
    responses: {
      200: {
        description: 'Successful response',
        content: {
          'text/plain': { schema: resolver(responseSchema) },
        },
      },
    },
  }),
  vValidator('query', querySchema),
  (c) => {
    const query = c.req.valid('query');
    return c.text(`Hello ${query?.name ?? 'Hono'}!`);
  }
);


serve({
  fetch: app.fetch,
  port: 3000,
});

console.log("✅ Server berjalan di http://localhost:3000");
