// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Auto-detect environment and set appropriate Nitro preset
const isVercel = !!process.env.VERCEL;
const nitroPreset = process.env.NITRO_PRESET || (isVercel ? "vercel" : "node-server");

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  nitro: {
    preset: nitroPreset,
    prerender: {
      crawlLinks: true,
      routes: ["/sitemap.xml", "/robots.txt"],
      ignore: ["/404"],
    },
    // Ensure consistent output structure for dist/server on local builds
    ...(isVercel ? {} : {
      output: {
        dir: "dist/server",
      },
    }),
  },
});
