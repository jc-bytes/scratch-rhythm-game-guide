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
  assert.match(html, /Completed Scratch project/);
  assert.match(html, /Click every sprite\. Compare its code\./);
  assert.equal((html.match(/data-sprite-id=/g) ?? []).length, 8);
  assert.match(html, /data-sprite-panel="goal-1"/);
  assert.match(html, /data-sprite-panel="ball-4"/);
  assert.match(html, /The Stage should have no code/);
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
  assert.match(guide, /MOD-SCRATCH-RHYTHM-01:v0\.13\.0:guide-progress/);
  assert.match(guide, /function SaveCheckpoint/);
  assert.match(guide, /SAVE YOUR SCRATCH GAME/);
  assert.match(guide, /Guide check marks do not save your Scratch code/);
  assert.match(guide, /Rhythm-Game-Setup-Your-Name\.sb3/);
  assert.match(guide, /Rhythm-Game-Lane-1-Works-Your-Name\.sb3/);
  assert.match(guide, /Rhythm-Game-4-Lanes-Your-Name\.sb3/);
  assert.match(css, /\.save-banner \{ position: sticky/);
  assert.match(css, /\.save-checkpoint/);
  assert.match(guide, /function FinishedProjectInspector/);
  assert.match(guide, /Goal 1 keeps its position, setup, timer, speed, and music scripts/);
  assert.match(guide, /Position only/);
  assert.match(guide, /3\. K key scoring/);
  assert.match(css, /\.sprite-tray/);
  assert.match(css, /\.sprite-code-panel:not\(\.active\)/);
  assert.match(guide, /function Vocabulary/);
  assert.match(guide, /role="tooltip"/);
  assert.match(guide, /Point to the word, tap it, or use the Tab key/);
  assert.match(css, /\.vocabulary:hover \.vocabulary-tip, \.vocabulary:focus-within \.vocabulary-tip/);
  assert.match(guide, /pre className="blocks"/);
  assert.match(guide, /scratchblocks\.min\.js/);
  assert.match(guide, /make-goal-ring\.mp4/);
  assert.match(guide, /make-score-and-time\.mp4/);
  assert.match(guide, /complete 4-block setup on goal 1/);
  assert.match(guide, /make-timer-and-music\.mp4/);
  assert.match(guide, /position-lane-1\.mp4/);
  assert.match(guide, /change-copied-keys\.mp4/);
  assert.match(guide, /make-ball-fall-only\.mp4/);
  assert.match(guide, /make-d-score-complete\.mp4/);
  assert.match(guide, /from the first green-flag block/);
  assert.match(guide, /make-all-copies\.mp4/);
  assert.match(guide, /function LaneOneTest/);
  assert.match(guide, /data-lane-answer="yes"/);
  assert.match(guide, /Click Yes or No after each test/);
  assert.match(guide, /A No answer shows what to check here/);
  assert.match(guide, /All 6 answers are Yes\. Lane 1 is ready to copy/);
  assert.match(guide, /data-lane-summary/);
  assert.match(await readFile(new URL("../scripts/github-pages.js", import.meta.url), "utf8"), /function setupLaneOneTest/);
  assert.doesNotMatch(guide, /Go back to steps 2 through 7/);
  assert.match(guide, /copy-and-modify-example\.mp4/);
  assert.match(guide, /Watch the actions\. Do not copy the numbers\./);
  assert.match(guide, /Use the numbers from this guide, not the video/);
  assert.match(guide, /video is at normal speed/);
  assert.match(guide, /Are you starting Part 3\?/);
  assert.match(guide, /Are you starting Part 4\?/);
  assert.match(guide, /After 20 seconds, tempo should be near 64/);
  assert.match(guide, /Stay on goal 1\. Make three more <Vocabulary term="scripts"/);
  assert.match(guide, /Delete the 4 extra scripts from goal 2/);
  assert.match(guide, /Make and name all 6 copies\. Do not change any blocks yet\./);
  assert.match(guide, /Pass 1: Clean and move the goals/);
  assert.match(guide, /Pass 2: Move the balls/);
  assert.match(guide, /Pass 3: Change the keys/);
  assert.match(guide, /Change both from <kbd>D<\/kbd> to <kbd>F<\/kbd>/);
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
  await access(new URL("../public/video/make-goal-ring.mp4", import.meta.url));
  await access(new URL("../public/video/make-goal-ring.vtt", import.meta.url));
  await access(new URL("../public/video/make-score-and-time.mp4", import.meta.url));
  await access(new URL("../public/video/make-score-and-time.vtt", import.meta.url));
  await assert.rejects(access(new URL("../public/video/make-variables.mp4", import.meta.url)));
  await access(new URL("../public/video/make-timer-and-music.mp4", import.meta.url));
  await access(new URL("../public/video/make-timer-and-music.vtt", import.meta.url));
  await access(new URL("../public/video/position-lane-1.mp4", import.meta.url));
  await access(new URL("../public/video/position-lane-1.vtt", import.meta.url));
  await access(new URL("../public/video/make-ball-fall-only.mp4", import.meta.url));
  await access(new URL("../public/video/make-ball-fall-only.vtt", import.meta.url));
  await access(new URL("../public/video/make-all-copies.mp4", import.meta.url));
  await access(new URL("../public/video/make-all-copies.vtt", import.meta.url));
  await access(new URL("../public/video/make-d-score-complete.mp4", import.meta.url));
  await access(new URL("../public/video/make-d-score-complete.vtt", import.meta.url));
  await assert.rejects(access(new URL("../public/video/make-d-score.mp4", import.meta.url)));
  await access(new URL("../public/video/copy-and-modify-example.mp4", import.meta.url));
  await access(new URL("../public/video/copy-and-modify-example.vtt", import.meta.url));
  await assert.rejects(access(new URL("../app/_sites-preview/SkeletonPreview.tsx", import.meta.url)));
});
