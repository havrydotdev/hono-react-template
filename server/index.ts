import "./utils/compression-stream.js";

import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { compress } from "hono/compress";

const PROD = process.env.NODE_ENV === "production";

const app = new Hono();

const routes = app.get("/api/clock", (c) => {
  return c.json({
    time: new Date().toLocaleTimeString(),
  });
});

if (PROD) {
  app.use(
    "*",
    compress(),
    serveStatic({
      root: "",
      onNotFound: (path, c) => {
        console.log(
          `${__dirname}/${path} is not found, tried to access ${c.req.path}`,
        );
      },
    }),
  );
}

const clientScript = PROD
  ? '<script type="module" src="/static/main.js"></script>'
  : '<script type="module" src="/app/main.tsx"></script>';

app.get("/", (c) => {
  return c.html(`<html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        ${clientScript}
      </head>
      <body>
        <div id="root" />
      </body>
    </html>`);
});

export default app;
export type AppType = typeof routes;
