import build from "@hono/vite-build/bun";
import devServer from "@hono/vite-dev-server";
import react from "@vitejs/plugin-react";
import { type UserConfig, defineConfig } from "vite";
import { chunkSplitPlugin } from "vite-plugin-chunk-split";

const clientConfig: UserConfig = {
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler", { target: "18" }]],
      },
    }),
    chunkSplitPlugin({ strategy: "unbundle" }),
  ],
  build: {
    rollupOptions: {
      input: "./app/main.tsx",
      output: {
        dir: "./dist/static",
        entryFileNames: "main.js",
      },
    },
    copyPublicDir: false,
  },
};

export default defineConfig(({ mode }) => {
  if (mode === "client") return clientConfig;

  return {
    plugins: [
      build({
        entry: "server/index.ts",
      }),
      devServer({
        entry: "server/index.ts",
      }),
    ],
  };
});
