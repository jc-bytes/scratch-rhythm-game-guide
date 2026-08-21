import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request("http://localhost/", { headers: { accept: "text/html" } }), {
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
  }, { waitUntil() {}, passThroughOnException() {} });
}

test("server-renders the complete Scratch rhythm-game guide", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<title>Build a 4-Lane Rhythm Game in Scratch<\/title>/i);
  assert.match(html, /Build two sprites\. Test them\. Then copy\./);
  assert.match(html, /id="step-12"/);
  assert.match(html, /Save, reopen, and submit/);
  assert.match(html, /Ball 4/);
  assert.match(html, />K<\/kbd>/);
  assert.match(html, /YourClass_Lastname_Firstname_4-Lane-Rhythm-Game\.sb3/);
  assert.doesNotMatch(html, /Your site is taking shape|codex-preview|react-loading-skeleton/i);
});

test("guide preserves the tested lane values from the finished project", async () => {
  const html = await (await render()).text();
  for (const value of ["-190", "-112", "-28", "53", "-130", "143", "-180", "-140", "-170"]) {
    assert.match(html, new RegExp(value.replace("-", "\\-")));
  }
  for (const key of ["D", "F", "J", "K"]) assert.match(html, new RegExp(`>${key}<\\/kbd>`));
  assert.match(html, /180 ÷ tempo/);
  assert.match(html, /pick random 6 to 600 ÷ tempo/);
});

test("finished site has local progress, print support, and no starter preview", async () => {
  const [guide, css, packageJson] = await Promise.all([
    readFile(new URL("../app/guide.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);
  assert.match(guide, /MOD-SCRATCH-RHYTHM-01:v0\.4\.0:guide-progress/);
  assert.match(guide, /make-goal-ring\.mp4/);
  assert.match(guide, /change-copied-keys\.mp4/);
  assert.match(guide, /Starting Part 3\?/);
  assert.match(guide, /Starting Part 4\?/);
  assert.match(guide, /After about 20 seconds, tempo should be near 64/);
  assert.match(guide, /Repair projects made from the video/);
  assert.match(guide, /shared scripts do not get copied four times/);
  assert.match(guide, /window\.confirm/);
  assert.match(guide, /window\.print/);
  assert.match(css, /@media print/);
  assert.match(css, /prefers-reduced-motion/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await access(new URL("../public/video/change-copied-keys.mp4", import.meta.url));
  await access(new URL("../public/video/change-copied-keys.vtt", import.meta.url));
  await assert.rejects(access(new URL("../app/_sites-preview/SkeletonPreview.tsx", import.meta.url)));
});
