"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

const STORAGE_KEY = "MOD-SCRATCH-RHYTHM-01:v0.4.1:guide-progress";

const stepNames = [
  "Prepare Scratch",
  "Create shared variables",
  "Build the Stage controller",
  "Make Ball 1 and goal 1",
  "Place the first two sprites",
  "Make Ball 1 fall",
  "Add D-key scoring",
  "Test lane 1",
  "Copy and test lane 2",
  "Copy and test lanes 3 and 4",
  "Run the final playtest",
  "Save, reopen, and submit",
];

function Script({ title, code }: { title: string; code: string }) {
  return <figure className="script-card"><figcaption>{title}</figcaption><pre className="blocks" aria-label={`Scratch blocks for ${title}`}>{code.trim()}</pre></figure>;
}

function Callout({ kind = "check", title, children }: { kind?: "check" | "tip" | "warning"; title: string; children: ReactNode }) {
  return <aside className={`callout ${kind}`}><strong>{title}</strong><div>{children}</div></aside>;
}

const valueChip = (value: string) => <code>{value}</code>;

function StepContent({ step }: { step: number }) {
  if (step === 1) return <>
    <p className="step-intro">Begin with a blank project. Do not copy any sprites yet.</p>
    <ol className="action-list">
      <li>Open <a href="https://scratch.mit.edu/projects/editor/" target="_blank" rel="noreferrer">Scratch Create</a>.</li>
      <li>Click the trash can on the cat sprite.</li>
      <li>Click <strong>Add Extension</strong> at the bottom left.</li>
      <li>Choose <strong>Music</strong>. A green Music category should appear.</li>
      <li>Use <strong>File → Save to your computer</strong>. Name the file <code>4-Lane Rhythm Game - Your Name.sb3</code>.</li>
    </ol>
    <Callout title="Checkpoint"><p>You should have an empty white Stage, no cat, and a green Music category.</p></Callout>
  </>;

  if (step === 2) return <>
    <p className="step-intro">The Stage will control the parts shared by every lane. This keeps the timer and music from being copied four times.</p>
    <ol className="action-list">
      <li>Click <strong>Variables</strong>, then <strong>Make a Variable</strong>.</li>
      <li>Create {valueChip("time")} for all sprites.</li>
      <li>Create {valueChip("score")} for all sprites.</li>
      <li>Keep both variable checkboxes selected so the values show on the Stage.</li>
      <li>Click the <strong>Stage</strong> thumbnail. Build this setup script on the Stage.</li>
    </ol>
    <Script title="Stage setup" code={`
when green flag clicked
set [time v] to (0)
set [score v] to (0)
set tempo to (60) :: music
    `} />
    <Callout kind="warning" title="Keep shared code on the Stage"><p>Do not put the score reset, timer, or drum loop on a goal or ball. Those sprites will be duplicated later.</p></Callout>
  </>;

  if (step === 3) return <>
    <p className="step-intro">Stay on the Stage. Make these three separate scripts. They all start with their own green-flag block.</p>
    <div className="script-grid">
      <Script title="Timer" code={`
when green flag clicked
forever
  change [time v] by (1)
  wait (1) seconds
end
      `} />
      <Script title="Speed up slowly" code={`
when green flag clicked
forever
  wait (5) seconds
  change tempo by (1) :: music
end
      `} />
    </div>
    <Script title="Drum pattern. Put all eight drum blocks inside forever." code={`
when green flag clicked
forever
  play drum (2 v) for (0.5) beats :: music
  play drum (6 v) for (0.5) beats :: music
  play drum (1 v) for (0.5) beats :: music
  play drum (6 v) for (0.5) beats :: music
  play drum (2 v) for (0.5) beats :: music
  play drum (6 v) for (0.5) beats :: music
  play drum (1 v) for (0.5) beats :: music
  play drum (6 v) for (0.5) beats :: music
end
    `} />
    <Callout title="Quick test"><p>Click the green flag. You should hear a repeating beat, time should count by ones, and the tempo should rise by one after five seconds.</p></Callout>
  </>;

  if (step === 4) return <>
    <p className="step-intro">Make the first two sprites from one matching shape. Ball 1 stays filled. Its duplicate becomes the goal ring.</p>
    <ol className="action-list">
      <li>Click <strong>Choose a Sprite</strong> and add the Scratch <strong>Ball</strong>.</li>
      <li>Rename it {valueChip("Ball 1")} and set its size to {valueChip("150")}.</li>
      <li>Right-click Ball 1 and choose <strong>duplicate</strong>.</li>
      <li>Rename the duplicate {valueChip("goal 1")}.</li>
      <li>With goal 1 selected, open <strong>Costumes</strong>. Select the circle, turn its <strong>Fill</strong> off, and choose an orange <strong>Outline</strong>.</li>
      <li>Leave the goal&apos;s size at {valueChip("150")}.</li>
    </ol>
    <figure className="video-demo">
      <video controls playsInline preload="metadata" aria-label="Silent demonstration of changing a duplicated Ball sprite into an orange goal ring">
        <source src="/video/make-goal-ring.mp4" type="video/mp4" />
        <track kind="captions" src="/video/make-goal-ring.vtt" srcLang="en" label="English instructions" default />
      </video>
      <figcaption><strong>21-second video check:</strong> duplicate Ball 1, select the costume, remove the fill, and keep an orange outline. This excerpt has no audio, so follow the numbered steps above while watching.</figcaption>
    </figure>
    <Callout title="Checkpoint"><p>Your sprite list should contain exactly two sprites: one filled <strong>Ball 1</strong> and one outline <strong>goal 1</strong>.</p></Callout>
  </>;

  if (step === 5) return <>
    <p className="step-intro">Put both sprites in lane 1. They share the same x value so the ball falls through the middle of the ring.</p>
    <ol className="action-list">
      <li>Select {valueChip("goal 1")} and add its position script.</li>
      <li>Select {valueChip("Ball 1")} and add a separate position script.</li>
      <li>Click the green flag and compare the Stage with the checkpoint below.</li>
    </ol>
    <div className="script-grid">
    <Script title="goal 1 starts at the bottom" code={`
when green flag clicked
go to x: (-190) y: (-130)
    `} />
    <Script title="Ball 1 starts above goal 1" code={`
when green flag clicked
go to x: (-190) y: (143)
    `} />
    </div>
    <div className="mini-stage" aria-label="Ball 1 above goal 1 in the bottom-left lane"><span className="mini-ball" /><span className="mini-goal" /><span className="coordinate top">Ball: x -190, y 143</span><span className="coordinate">Goal: x -190, y -130</span></div>
    <Callout kind="tip" title="Match the lane"><p>Both sprites use x <strong>-190</strong>. Ball 1 uses y <strong>143</strong>; goal 1 uses y <strong>-130</strong>.</p></Callout>
  </>;

  if (step === 6) return <>
    <p className="step-intro">Build one complete falling loop on Ball 1. The round reporter blocks go inside the white spaces.</p>
    <Script title="Ball 1 falling loop" code={`
when green flag clicked
show
forever
  glide ((180) / (tempo)) secs to x: (-190) y: (-180)
  if <(y position) < (-179)> then
    hide
    wait ((pick random (6) to (600)) / (tempo)) seconds
    show
    go to x: (-190) y: (143)
  end
end
    `} />
    <div className="recipe-grid">
      <article><span className="recipe-category operators">Operators</span><h3>Falling time</h3><p>Put <strong>180</strong> on the left of divide and <strong>tempo</strong> on the right.</p></article>
      <article><span className="recipe-category operators">Operators</span><h3>Random pause</h3><p>Put <strong>pick random 6 to 600</strong> on the left of divide and <strong>tempo</strong> on the right.</p></article>
      <article><span className="recipe-category motion">Motion</span><h3>Reset position</h3><p>Every x value in Ball 1 is <strong>-190</strong>. The top y value is <strong>143</strong>.</p></article>
    </div>
    <Callout title="Quick test"><p>Click the flag. Ball 1 should fall through the ring, disappear, pause, and return to the top.</p></Callout>
  </>;

  if (step === 7) return <>
    <p className="step-intro">This script gives one point when D is pressed while the ball is inside the goal. An early or late press removes one point.</p>
    <Script title="Ball 1 scoring loop" code={`
when green flag clicked
forever
  wait until <not <key [d v] pressed?>>
  wait until <key [d v] pressed?>
  if <<(y position) < (-140)> and <(y position) > (-170)>> then
    change [score v] by (1)
  else
    change [score v] by (-1)
  end
end
    `} />
    <Callout kind="tip" title="Why wait twice?"><p>The first wait makes Scratch wait for D to be released. The second waits for the next press. Holding D cannot score over and over.</p></Callout>
    <Callout title="The hit zone"><p>The ball scores only while its y position is below <strong>-140</strong> and above <strong>-170</strong>.</p></Callout>
  </>;

  if (step === 8) return <>
    <p className="step-intro">Do not copy a broken lane. Test goal 1 and Ball 1 before moving on.</p>
    <ul className="test-list">
      <li><span>1</span>Click the green flag. Ball 1 begins at the top of goal 1&apos;s lane.</li>
      <li><span>2</span>Press <kbd>D</kbd> while the ball overlaps the ring. Score rises by 1.</li>
      <li><span>3</span>Press <kbd>D</kbd> too early. Score drops by 1.</li>
      <li><span>4</span>Hold <kbd>D</kbd>. It should count only one press.</li>
      <li><span>5</span>Wait for the ball to disappear and return.</li>
      <li><span>6</span>Stop and start again. Time and score return to 0.</li>
    </ul>
    <Callout kind="warning" title="Fix lane 1 now"><p>If any check fails, return to steps 4 through 7. Compare every number and block order before duplicating.</p></Callout>
  </>;

  if (step === 9) return <>
    <p className="step-intro">Make one complete copy of lane 1. Finish every edit for lane 2, then test F before making more sprites.</p>
    <Callout kind="tip" title="Starting Part 3?"><p>Run the six checks in step 8 first. If lane 1 passes, return here and begin the copying phase.</p></Callout>
    <ol className="action-list">
      <li>Right-click {valueChip("goal 1")} and choose <strong>duplicate</strong>.</li>
      <li>Rename the copy {valueChip("goal 2")}.</li>
      <li>In goal 2&apos;s blue <strong>go to</strong> block, change x to {valueChip("-112")}. Keep y at {valueChip("-130")}.</li>
      <li>Right-click {valueChip("Ball 1")}, duplicate it, and rename the copy {valueChip("Ball 2")}.</li>
      <li>In Ball 2, change all <strong>three</strong> x values from {valueChip("-190")} to {valueChip("-112")}.</li>
      <li>Change both key choices from <kbd>D</kbd> to <kbd>F</kbd>.</li>
      <li>Click the flag. Press F when Ball 2 overlaps goal 2. Fix lane 2 before continuing.</li>
    </ol>
    <div className="copy-checklist"><strong>Lane 2 is finished when you make these 8 edits</strong><span>2 sprite names</span><span>1 goal x value</span><span>3 ball x values</span><span>2 ball key choices</span></div>
    <Callout kind="warning" title="Edit the scripts"><p>Change the numbers inside the blue blocks. Do not use the temporary x and y fields below the Stage to position the copied sprites.</p></Callout>
    <Callout title="Lane 2 checkpoint"><p>The flag places two rings in a row. Ball 2 falls through the second ring, F scores that lane, and D still scores only lane 1.</p></Callout>
  </>;

  if (step === 10) return <>
    <p className="step-intro">Repeat the lane 2 process twice. Always copy the tested lane 1 sprites, then finish and test one new lane at a time.</p>
    <ol className="action-list">
      <li>Duplicate {valueChip("goal 1")} and {valueChip("Ball 1")} to make {valueChip("goal 3")} and {valueChip("Ball 3")}.</li>
      <li>Use x {valueChip("-28")} in the goal once and in Ball 3 three times. Change both Ball 3 keys to <kbd>J</kbd>.</li>
      <li>Click the flag and test J. Continue only when lane 3 works.</li>
      <li>Duplicate {valueChip("goal 1")} and {valueChip("Ball 1")} again to make {valueChip("goal 4")} and {valueChip("Ball 4")}.</li>
      <li>Use x {valueChip("53")} in the goal once and in Ball 4 three times. Change both Ball 4 keys to <kbd>K</kbd>.</li>
      <li>Click the flag and test K.</li>
    </ol>
    <table className="value-table wide"><caption>Final values for all four lanes</caption><thead><tr><th>Lane</th><th>Goal x, once</th><th>Ball x, 3 blocks</th><th>Key, 2 blocks</th><th>Goal y</th><th>Ball top / bottom</th><th>Hit zone</th></tr></thead><tbody>
      <tr><td>1</td><td>-190</td><td>-190</td><td><kbd>D</kbd></td><td>-130</td><td>143 / -180</td><td>-140 to -170</td></tr>
      <tr><td>2</td><td>-112</td><td>-112</td><td><kbd>F</kbd></td><td>-130</td><td>143 / -180</td><td>-140 to -170</td></tr>
      <tr><td>3</td><td>-28</td><td>-28</td><td><kbd>J</kbd></td><td>-130</td><td>143 / -180</td><td>-140 to -170</td></tr>
      <tr><td>4</td><td>53</td><td>53</td><td><kbd>K</kbd></td><td>-130</td><td>143 / -180</td><td>-140 to -170</td></tr>
    </tbody></table>
    <figure className="video-demo">
      <video controls playsInline preload="metadata" aria-label="Silent demonstration of changing both key choices in copied Ball sprites">
        <source src="/video/change-copied-keys.mp4" type="video/mp4" />
        <track kind="captions" src="/video/change-copied-keys.vtt" srcLang="en" label="English instructions" default />
      </video>
      <figcaption><strong>31-second video check:</strong> open each copied key menu and change both key blocks. The clip is faster than the original recording and has no audio. Use the table above for the correct key in each lane.</figcaption>
    </figure>
    <div className="change-count"><strong>For every copied lane, make 8 edits:</strong><span>2 names</span><span>1 goal x value</span><span>3 ball x values</span><span>2 key choices</span></div>
    <Callout kind="warning" title="Repair projects made from the video"><p>Each goal sprite should have only its green-flag position script. Delete timer, tempo, and drum scripts from goal 1 through goal 4. On every ball, remove <strong>set score to 0</strong> from the scoring script. Keep one score reset, one timer, one speed-up script, and one drum loop on the Stage.</p></Callout>
    <Callout kind="warning" title="Do not change these"><p>Keep the tempo formulas, random numbers, y values, score changes, and block order the same in all four balls.</p></Callout>
  </>;

  if (step === 11) return <>
    <p className="step-intro">Run one controlled playtest. Do each check in order so you know which script to repair if something fails.</p>
    <Callout kind="tip" title="Starting Part 4?"><p>This is the third and final classroom phase. Complete the repair check in step 10 before you start this one-minute test.</p></Callout>
    <div className="key-map" aria-label="Lane controls"><span><kbd>D</kbd> lane 1</span><span><kbd>F</kbd> lane 2</span><span><kbd>J</kbd> lane 3</span><span><kbd>K</kbd> lane 4</span></div>
    <ul className="test-list">
      <li><span>1</span><div><strong>Reset.</strong> Click stop, then the green flag. Score and time begin at 0. Music tempo begins at 60.</div></li>
      <li><span>2</span><div><strong>Observe.</strong> Do not press a key for 10 seconds. Time reaches about 10, one drum pattern plays, and every ball falls toward its own ring.</div></li>
      <li><span>3</span><div><strong>Test the lanes.</strong> Press D, F, J, and K when the matching ball overlaps its ring. Each correct press adds 1.</div></li>
      <li><span>4</span><div><strong>Test a mistake.</strong> Press one key too early. Score drops by 1.</div></li>
      <li><span>5</span><div><strong>Test holding.</strong> Hold one key down. It counts once, not over and over.</div></li>
      <li><span>6</span><div><strong>Watch the return.</strong> Balls disappear at the bottom and return after different random pauses.</div></li>
      <li><span>7</span><div><strong>Restart.</strong> Click stop, then the flag. Score and time return to 0 and the four balls start again.</div></li>
    </ul>
    <Callout kind="warning" title="Tempo should rise slowly"><p>The correct speed-up script changes tempo by <strong>1</strong> after every <strong>5 seconds</strong>. After about 20 seconds, tempo should be near 64, not 80 or higher.</p></Callout>
    <div className="debug-grid">
      <article><h3>Ball misses its ring</h3><p>Match all three x values to the lane table in step 10.</p></article>
      <article><h3>Wrong key scores</h3><p>Change both key blocks inside that ball&apos;s scoring script.</p></article>
      <article><h3>Timer runs too fast</h3><p>Remove timer scripts from sprites. Keep one timer on the Stage.</p></article>
      <article><h3>Music is stacked or too fast</h3><p>Keep one drum loop and one change-tempo-by-1 script on the Stage. Remove copies from every sprite.</p></article>
      <article><h3>Score changes many times</h3><p>Check that <strong>wait until not key pressed</strong> comes before <strong>wait until key pressed</strong>.</p></article>
      <article><h3>Ball never returns</h3><p>Put hide, wait, show, and go to inside the if block in that order.</p></article>
    </div>
  </>;

  return <>
    <p className="step-intro">Save the working project before you close Scratch.</p>
    <ol className="action-list">
      <li>Click <strong>File → Save to your computer</strong>.</li>
      <li>Name it <code>YourClass_Lastname_Firstname_4-Lane-Rhythm-Game.sb3</code>.</li>
      <li>Find the downloaded file. Confirm that its name ends in <strong>.sb3</strong>.</li>
      <li>Open the downloaded file in Scratch. Confirm that it loads four goals, four balls, and the Stage.</li>
      <li>Click the flag and run one final D, F, J, K test in the reopened file.</li>
      <li>Submit the <strong>.sb3 file</strong> where your teacher instructed.</li>
    </ol>
    <div className="finish-card"><p className="eyebrow">Finished project</p><h3>Your game needs all of these</h3><ul><li>Four aligned lanes</li><li>D, F, J, and K controls</li><li>Score and time</li><li>Repeating drum beat</li><li>Random note delays</li><li>Gradual speed increase</li><li>A saved .sb3 file that opens</li></ul></div>
    <details className="extension"><summary>Finished early? Try one extension</summary><ul><li>Give each lane a different color.</li><li>Add a start screen before the game begins.</li><li>Play a short sound for a correct hit.</li><li>Add a 60-second game-over screen.</li></ul></details>
  </>;
}

export default function Guide() {
  const [current, setCurrent] = useState(1);
  const [completed, setCompleted] = useState<number[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const scratchWindow = window as typeof window & {
      scratchblocks?: { renderMatching: (selector: string, options: { style: string; languages: string[]; scale: number }) => void };
    };
    const renderBlocks = () => scratchWindow.scratchblocks?.renderMatching("pre.blocks", {
      style: "scratch3",
      languages: ["en"],
      scale: 0.78,
    });

    if (scratchWindow.scratchblocks) {
      renderBlocks();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>('script[data-scratchblocks="true"]');
    const script = existing || document.createElement("script");
    script.addEventListener("load", renderBlocks, { once: true });
    if (!existing) {
      script.src = "/vendor/scratchblocks.min.js";
      script.dataset.scratchblocks = "true";
      script.defer = true;
      document.head.append(script);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
        if (saved && Array.isArray(saved.completed)) setCompleted(saved.completed.filter((n: unknown) => typeof n === "number" && n >= 1 && n <= 12));
        if (saved && typeof saved.current === "number") setCurrent(Math.min(12, Math.max(1, saved.current)));
      } catch { /* Keep the guide usable if browser storage is blocked. */ }
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ current, completed }));
  }, [current, completed, loaded]);

  const percent = useMemo(() => Math.round((completed.length / 12) * 100), [completed]);

  function goTo(step: number) {
    setCurrent(step);
    requestAnimationFrame(() => document.querySelector(".guide-shell")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function finishAndContinue() {
    setCompleted((old) => old.includes(current) ? old : [...old, current].sort((a, b) => a - b));
    if (current < 12) goTo(current + 1);
  }

  function resetProgress() {
    if (!window.confirm("Reset all 12 completed-step checks on this device?")) return;
    setCompleted([]);
    setCurrent(1);
  }

  return <main>
    <header className="hero">
      <nav aria-label="Guide progress"><span className="brand">Scratch build guide</span><span className="progress-label">{completed.length} of 12 steps finished</span></nav>
      <div className="hero-grid">
        <div><p className="eyebrow">Grade 7 Technology</p><h1>Build a 4-lane rhythm game</h1><p className="lede">Start with a blank Scratch project. Build one goal and one falling ball carefully. When that lane works, copy it three times.</p><button className="start-button" onClick={() => goTo(completed.length === 12 ? 1 : Math.min(12, completed.length + 1))}>{completed.length ? "Continue the guide" : "Start step 1"}</button></div>
        <div className="game-preview" aria-label="Four game lanes controlled by D, F, J, and K">{[["D", "#ffca3a"], ["F", "#ff924c"], ["J", "#ff595e"], ["K", "#8ac926"]].map(([key, color], index) => <div className="lane" key={key}><span className="falling-ball" style={{ background: color, animationDelay: `${index * .25}s` }} /><span className="goal-ring" style={{ borderColor: color }} /><kbd>{key}</kbd></div>)}</div>
      </div>
    </header>

    <section className="principle"><p className="eyebrow">The plan</p><h2>Build two sprites. Test them. Then copy.</h2><p className="principle-summary">Goal 1 teaches the target position. Ball 1 teaches falling, timing, keyboard input, and score. The other six sprites reuse that tested pattern.</p><aside className="resume-note"><strong>Already followed the Part 1 video?</strong><span>Use steps 1 through 7 as a repair checklist. The guide moves the timer, score reset, tempo, and music to the Stage so those shared scripts do not get copied four times. Copy sprites only after lane 1 passes step 8.</span></aside></section>

    <section className="guide-shell" aria-label="Step-by-step project guide">
      <aside className="step-sidebar">
        <div className="progress-track" aria-label={`${percent}% complete`}><span style={{ width: `${percent}%` }} /></div>
        <p className="sidebar-progress">{percent}% complete</p>
        <ol>{stepNames.map((name, index) => { const number = index + 1; return <li key={name}><button className={current === number ? "current" : ""} onClick={() => goTo(number)} aria-current={current === number ? "step" : undefined}><span className={completed.includes(number) ? "done" : ""}>{completed.includes(number) ? "✓" : number}</span>{name}</button></li>; })}</ol>
        <button className="quiet-button" onClick={() => window.print()}>Print all steps</button>
        <button className="quiet-button reset" onClick={resetProgress}>Reset progress</button>
      </aside>

      <div className="step-workspace">
        <div className="mobile-progress"><label htmlFor="step-select">Go to a step</label><select id="step-select" value={current} onChange={(event) => goTo(Number(event.target.value))}>{stepNames.map((name, index) => <option value={index + 1} key={name}>{index + 1}. {name}{completed.includes(index + 1) ? " ✓" : ""}</option>)}</select><div className="progress-track"><span style={{ width: `${percent}%` }} /></div></div>
        {stepNames.map((name, index) => { const number = index + 1; return <article id={`step-${number}`} key={name} className={`step-panel ${current === number ? "active" : ""}`} aria-labelledby={`step-${number}-title`} aria-hidden={current !== number}>
          <div className="step-heading"><p className="eyebrow">Step {number} of 12</p><h2 id={`step-${number}-title`}>{name}</h2></div>
          <StepContent step={number} />
        </article>; })}
        <div className="step-controls"><button className="back-button" disabled={current === 1} onClick={() => goTo(current - 1)}>Previous step</button><button className="done-button" onClick={finishAndContinue}>{current === 12 ? (completed.includes(12) ? "Completed" : "Mark project complete") : (completed.includes(current) ? "Next step" : "I finished this step")}</button></div>
        <p className="storage-note">Progress saves only in this browser on this device. Your Scratch project must still be saved as an .sb3 file.</p>
      </div>
    </section>
    <footer><strong>MOD-SCRATCH-RHYTHM-01</strong><span>Version 0.4.1 · Grade 7 prototype</span></footer>
  </main>;
}
