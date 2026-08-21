import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = path.resolve(process.argv[2] || path.join(projectRoot, "github-pages-dist"));
const publicUrl = new URL(process.argv[3] || "https://jc-bytes.github.io/scratch-rhythm-game-guide/");

if (!publicUrl.pathname.endsWith("/")) publicUrl.pathname += "/";

const workerUrl = new URL(`../dist/server/index.js?export=${Date.now()}`, import.meta.url);
const { default: worker } = await import(workerUrl.href);
const response = await worker.fetch(
  new Request(`${publicUrl.origin}/`, {
    headers: {
      accept: "text/html",
      "x-forwarded-host": publicUrl.host,
      "x-forwarded-proto": publicUrl.protocol.slice(0, -1),
    },
  }),
  { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
  { waitUntil() {}, passThroughOnException() {} },
);

if (!response.ok) throw new Error(`The server render failed with HTTP ${response.status}.`);

const rendered = await response.text();
const main = rendered.match(/<main>[\s\S]*?<\/main>/)?.[0];
const cssPath = rendered.match(/<link rel="stylesheet" href="([^"]+)"/)?.[1];

if (!main || !cssPath) throw new Error("The rendered guide is missing its main content or stylesheet.");

const staticMain = main.replace(/\b(src|href)="\/(?!\/)/g, '$1="./');
const title = "Build a 4-Lane Rhythm Game in Scratch";
const description = "A complete step-by-step student guide for building a four-lane Scratch rhythm game with D, F, J, and K controls.";
const imageUrl = new URL("og.png", publicUrl).href;
const stylesheet = `.${cssPath}`;
const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:url" content="${publicUrl.href}">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="./favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="${stylesheet}">
</head>
<body>
${staticMain}
<script src="./github-pages.js" defer></script>
</body>
</html>
`;

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });
await cp(path.join(projectRoot, "dist/client"), outputDirectory, { recursive: true });
await Promise.all([
  rm(path.join(outputDirectory, ".vite"), { recursive: true, force: true }),
  rm(path.join(outputDirectory, "_headers"), { force: true }),
  rm(path.join(outputDirectory, ".assetsignore"), { force: true }),
  rm(path.join(outputDirectory, "vinext-client-entry-manifest.json"), { force: true }),
  rm(path.join(outputDirectory, "_next/static/chunks"), { recursive: true, force: true }),
]);

const staticController = await readFile(path.join(projectRoot, "scripts/github-pages.js"), "utf8");
const notFound = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Guide moved</title><meta http-equiv="refresh" content="0;url=${publicUrl.href}"></head><body><p><a href="${publicUrl.href}">Open the Scratch rhythm game guide</a></p></body></html>\n`;

await Promise.all([
  writeFile(path.join(outputDirectory, "index.html"), html),
  writeFile(path.join(outputDirectory, "404.html"), notFound),
  writeFile(path.join(outputDirectory, "github-pages.js"), staticController),
  writeFile(path.join(outputDirectory, ".nojekyll"), ""),
]);

console.log(`Exported GitHub Pages site to ${outputDirectory}`);
