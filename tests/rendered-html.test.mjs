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
  assert.match(html, /<title>Make a 4-Lane Scratch Rhythm Game<\/title>/i);
  assert.match(html, /Make 2 sprites\. Test them\. Then copy them\./);
  assert.ok(html.indexOf("Make Ball 1 and goal 1") < html.indexOf("Make score and time"));
  assert.match(html, /id="step-12"/);
  assert.match(html, /Save and turn in your game/);
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
  assert.match(html, /\(\(180\) \/ \(tempo\)\)/);
  assert.match(html, /\(\(pick random \(6\) to \(600\)\) \/ \(tempo\)\)/);
});

test("finished site has local progress, print support, and no starter preview", async () => {
  const [guide, css, packageJson] = await Promise.all([
    readFile(new URL("../app/guide.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);
  assert.match(guide, /MOD-SCRATCH-RHYTHM-01:v0\.7\.0:guide-progress/);
  assert.match(guide, /function Vocabulary/);
  assert.match(guide, /role="tooltip"/);
  assert.match(guide, /Point to the word, tap it, or use the Tab key/);
  assert.match(css, /\.vocabulary:hover \.vocabulary-tip, \.vocabulary:focus-within \.vocabulary-tip/);
  assert.match(guide, /pre className="blocks"/);
  assert.match(guide, /scratchblocks\.min\.js/);
  assert.match(guide, /make-goal-ring\.mp4/);
  assert.match(guide, /change-copied-keys\.mp4/);
  assert.match(guide, /Are you starting Part 3\?/);
  assert.match(guide, /Are you starting Part 4\?/);
  assert.match(guide, /After 20 seconds, tempo should be near 64/);
  assert.match(guide, /Stay on goal 1\. Make three more <Vocabulary term="scripts"/);
  assert.match(guide, /Delete the 4 extra scripts from goal 2/);
  assert.match(guide, /Goal 1 keeps its position, setup, timer, speed, and music scripts/);
  assert.doesNotMatch(guide, /Keep the timer, score reset, tempo, and music on the Stage/);
  assert.match(guide, /sprite<\/strong> is a picture you code/);
  assert.doesNotMatch(guide, /controlled playtest|copying phase|temporary x and y fields|Repair projects made/);
  assert.match(guide, /window\.confirm/);
  assert.match(guide, /window\.print/);
  assert.match(css, /@media print/);
  assert.match(css, /prefers-reduced-motion/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await access(new URL("../public/video/change-copied-keys.mp4", import.meta.url));
  await access(new URL("../public/video/change-copied-keys.vtt", import.meta.url));
  await assert.rejects(access(new URL("../app/_sites-preview/SkeletonPreview.tsx", import.meta.url)));
});
