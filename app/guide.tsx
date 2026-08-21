"use client";

import { useEffect, useId, useMemo, useState, type ReactNode } from "react";

const STORAGE_KEY = "MOD-SCRATCH-RHYTHM-01:v0.9.0:guide-progress";

const stepNames = [
  "Get Scratch ready",
  "Make Ball 1 and goal 1",
  "Make score and time",
  "Make the timer and music",
  "Put them in lane 1",
  "Make Ball 1 fall",
  "Make D change the score",
  "Test lane 1",
  "Copy lane 1 to make lane 2",
  "Make lanes 3 and 4",
  "Test the whole game",
  "Save and turn in your game",
];

function Script({ title, code }: { title: string; code: string }) {
  return <figure className="script-card"><figcaption>{title}</figcaption><pre className="blocks" aria-label={`Scratch blocks for ${title}`}>{code.trim()}</pre></figure>;
}

function Callout({ kind = "check", title, children }: { kind?: "check" | "tip" | "warning"; title: string; children: ReactNode }) {
  return <aside className={`callout ${kind}`}><strong>{title}</strong><div>{children}</div></aside>;
}

function Vocabulary({ term, meaning }: { term: string; meaning: string }) {
  const tooltipId = useId();
  return <span className="vocabulary">
    <button type="button" className="vocabulary-term" aria-describedby={tooltipId}>{term}</button>
    <span id={tooltipId} className="vocabulary-tip" role="tooltip">{meaning}</span>
  </span>;
}

type FinishedSprite = {
  id: string;
  name: string;
  kind: "goal" | "ball";
  scripts: { title: string; code: string }[];
};

const goalPosition = (x: number) => `
when green flag clicked
go to x: (${x}) y: (-130)
`;

const ballPosition = (x: number) => `
when green flag clicked
go to x: (${x}) y: (143)
`;

const ballFall = (x: number) => `
when green flag clicked
show
forever
  glide ((180) / (tempo)) secs to x: (${x}) y: (-180)
  if <(y position) < (-179)> then
    hide
    wait ((pick random (6) to (600)) / (tempo)) seconds
    show
    go to x: (${x}) y: (143)
  end
end
`;

const ballScore = (key: string) => `
when green flag clicked
forever
  wait until <not <key [${key.toLowerCase()} v] pressed?>>
  wait until <key [${key.toLowerCase()} v] pressed?>
  if <<(y position) < (-140)> and <(y position) > (-170)>> then
    change [score v] by (1)
  else
    change [score v] by (-1)
  end
end
`;

const finishedSprites: FinishedSprite[] = [
  { id: "goal-1", name: "goal 1", kind: "goal", scripts: [
    { title: "1. Position", code: goalPosition(-190) },
    { title: "2. Setup", code: `when green flag clicked\nset [time v] to (0)\nset [score v] to (0)\nset tempo to (60) :: music` },
    { title: "3. Timer", code: `when green flag clicked\nforever\n  change [time v] by (1)\n  wait (1) seconds\nend` },
    { title: "4. Speed", code: `when green flag clicked\nforever\n  wait (5) seconds\n  change tempo by (1) :: music\nend` },
    { title: "5. Music", code: `when green flag clicked\nforever\n  play drum (2 v) for (0.5) beats :: music\n  play drum (6 v) for (0.5) beats :: music\n  play drum (1 v) for (0.5) beats :: music\n  play drum (6 v) for (0.5) beats :: music\n  play drum (2 v) for (0.5) beats :: music\n  play drum (6 v) for (0.5) beats :: music\n  play drum (1 v) for (0.5) beats :: music\n  play drum (6 v) for (0.5) beats :: music\nend` },
  ] },
  { id: "ball-1", name: "Ball 1", kind: "ball", scripts: [
    { title: "1. Start position", code: ballPosition(-190) },
    { title: "2. Falling loop", code: ballFall(-190) },
    { title: "3. D key scoring", code: ballScore("D") },
  ] },
  { id: "goal-2", name: "goal 2", kind: "goal", scripts: [{ title: "Position only", code: goalPosition(-112) }] },
  { id: "ball-2", name: "Ball 2", kind: "ball", scripts: [
    { title: "1. Start position", code: ballPosition(-112) },
    { title: "2. Falling loop", code: ballFall(-112) },
    { title: "3. F key scoring", code: ballScore("F") },
  ] },
  { id: "goal-3", name: "goal 3", kind: "goal", scripts: [{ title: "Position only", code: goalPosition(-28) }] },
  { id: "ball-3", name: "Ball 3", kind: "ball", scripts: [
    { title: "1. Start position", code: ballPosition(-28) },
    { title: "2. Falling loop", code: ballFall(-28) },
    { title: "3. J key scoring", code: ballScore("J") },
  ] },
  { id: "goal-4", name: "goal 4", kind: "goal", scripts: [{ title: "Position only", code: goalPosition(53) }] },
  { id: "ball-4", name: "Ball 4", kind: "ball", scripts: [
    { title: "1. Start position", code: ballPosition(53) },
    { title: "2. Falling loop", code: ballFall(53) },
    { title: "3. K key scoring", code: ballScore("K") },
  ] },
];

function FinishedProjectInspector() {
  const [selected, setSelected] = useState(finishedSprites[0].id);

  return <section className="sprite-inspector" aria-labelledby="sprite-inspector-title">
    <div className="sprite-inspector-heading">
      <p className="eyebrow">Completed Scratch project</p>
      <h3 id="sprite-inspector-title">Click every sprite. Compare its code.</h3>
      <p>Check all 8 sprites before you turn in the game. The Stage should have no code.</p>
    </div>
    <div className="sprite-tray" aria-label="Finished project sprites">
      {finishedSprites.map((sprite) => <button key={sprite.id} type="button" className={selected === sprite.id ? "selected" : ""} data-sprite-id={sprite.id} aria-pressed={selected === sprite.id} aria-controls={`code-${sprite.id}`} onClick={() => setSelected(sprite.id)}>
        <span className={`sprite-thumb ${sprite.kind}`} aria-hidden="true" />
        <strong>{sprite.name}</strong>
        <small>{sprite.scripts.length} {sprite.scripts.length === 1 ? "script" : "scripts"}</small>
      </button>)}
    </div>
    <div className="sprite-code-workspace">
      {finishedSprites.map((sprite) => <section key={sprite.id} id={`code-${sprite.id}`} className={`sprite-code-panel ${selected === sprite.id ? "active" : ""}`} data-sprite-panel={sprite.id} hidden={selected !== sprite.id} aria-labelledby={`code-title-${sprite.id}`}>
        <div className="selected-sprite-title"><span className={`sprite-thumb ${sprite.kind}`} aria-hidden="true" /><div><p>Selected sprite</p><h4 id={`code-title-${sprite.id}`}>{sprite.name}</h4></div><strong>{sprite.scripts.length} {sprite.scripts.length === 1 ? "script" : "separate scripts"}</strong></div>
        {sprite.kind === "goal" && sprite.id !== "goal-1" ? <Callout kind="warning" title="Position only"><p>If you see setup, timer, speed, or music here, delete those extra scripts.</p></Callout> : null}
        <div className="sprite-script-list">{sprite.scripts.map((script) => <Script key={script.title} title={script.title} code={script.code} />)}</div>
      </section>)}
    </div>
  </section>;
}

const valueChip = (value: string) => <code>{value}</code>;

function StepContent({ step }: { step: number }) {
  if (step === 1) return <>
    <p className="step-intro">Start with an empty Scratch project. Do not make any <Vocabulary term="sprites" meaning="Pictures you can give Scratch blocks to." /> yet.</p>
    <ol className="action-list">
      <li>Open <a href="https://scratch.mit.edu/projects/editor/" target="_blank" rel="noreferrer">Scratch Create</a>.</li>
      <li>Find the cat. Click its trash can.</li>
      <li>Click <strong>Add Extension</strong> at the bottom left.</li>
      <li>Click <strong>Music</strong>. You should see a green Music button.</li>
      <li>Click <strong>File → Save to your computer</strong>.</li>
      <li>Name the file <code>4-Lane Rhythm Game - Your Name.sb3</code>.</li>
    </ol>
    <Callout kind="tip" title="Words in this guide"><p>Bold words with a dotted line have a quick meaning. Point to the word, tap it, or use the Tab key. A <strong>sprite</strong> is a picture you code. The <strong>Stage</strong> is the white game screen. A <strong>script</strong> is a group of connected blocks. <strong>Duplicate</strong> means make a copy. A <strong>lane</strong> is one ball path.</p></Callout>
    <Callout title="Stop and check"><p>You should see a white Stage, no cat, and a green Music button.</p></Callout>
  </>;

  if (step === 3) return <>
    <p className="step-intro">Make two <Vocabulary term="variables" meaning="Named number boxes that can change while the game runs." />. One shows time. One shows score.</p>
    <ol className="action-list">
      <li>Click <strong>Variables</strong>, then <strong>Make a Variable</strong>.</li>
      <li>Make a variable named {valueChip("time")}. Choose <strong>For all sprites</strong>.</li>
      <li>Make a variable named {valueChip("score")}. Choose <strong>For all sprites</strong>.</li>
      <li>Keep both boxes checked. You should see time and score on the Stage.</li>
      <li>Click the {valueChip("goal 1")} sprite.</li>
      <li>Copy the four blocks below. Connect them in this order.</li>
    </ol>
    <Script title="Goal 1 setup" code={`
when green flag clicked
set [time v] to (0)
set [score v] to (0)
set tempo to (60) :: music
    `} />
    <Callout kind="warning" title="Keep this on goal 1"><p>Do not put another copy on a ball. Goal 1 will control the score, time, <Vocabulary term="tempo" meaning="The music speed number. A bigger number makes the game faster." />, and music.</p></Callout>
  </>;

  if (step === 4) return <>
    <p className="step-intro">Stay on goal 1. Make three more <Vocabulary term="scripts" meaning="Groups of connected Scratch blocks that give instructions." />. Do not connect these scripts to each other.</p>
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
    <Script title="Music. Put all 8 drum blocks inside forever." code={`
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
    <Callout title="Stop and check"><p>Goal 1 should have 4 scripts: setup, timer, speed, and music. Click the green flag. You should hear drums. Time should go up by 1 each second. Tempo should go up by 1 after 5 seconds.</p></Callout>
  </>;

  if (step === 2) return <>
    <p className="step-intro">Make one ball. Then copy it. The copy will become an empty ring.</p>
    <ol className="action-list">
      <li>Click <strong>Choose a Sprite</strong>.</li>
      <li>Click the Scratch <strong>Ball</strong>.</li>
      <li>Name it {valueChip("Ball 1")}.</li>
      <li>Change its size to {valueChip("150")}.</li>
      <li>Right-click Ball 1. Click <Vocabulary term="duplicate" meaning="Make a copy of the sprite and all of its blocks." />.</li>
      <li>Name the copy {valueChip("goal 1")}.</li>
      <li>Click <strong>Costumes</strong>. Click the circle.</li>
      <li>Turn <Vocabulary term="Fill" meaning="The color inside a shape." /> off. Choose an orange <Vocabulary term="Outline" meaning="The line around the outside of a shape." />.</li>
      <li>Keep the goal size at {valueChip("150")}.</li>
    </ol>
    <figure className="video-demo">
      <video controls playsInline preload="metadata" aria-label="Silent demonstration of changing a duplicated Ball sprite into an orange goal ring">
        <source src="/video/make-goal-ring.mp4" type="video/mp4" />
        <track kind="captions" src="/video/make-goal-ring.vtt" srcLang="en" label="English instructions" default />
      </video>
      <figcaption><strong>Short video:</strong> Copy Ball 1. Open Costumes. Turn Fill off. Keep an orange Outline. The video has no sound.</figcaption>
    </figure>
    <Callout title="Stop and check"><p>You should have 2 sprites. Ball 1 is full. Goal 1 is an empty orange ring.</p></Callout>
  </>;

  if (step === 5) return <>
    <p className="step-intro">Put Ball 1 above goal 1. Both sprites use the same <Vocabulary term="x number" meaning="The left and right position. The same x number puts both sprites in one lane." />.</p>
    <ol className="action-list">
      <li>Click {valueChip("goal 1")}. Copy the first script below.</li>
      <li>Click {valueChip("Ball 1")}. Copy the second script below.</li>
      <li>Click the green flag.</li>
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
    <Callout title="Stop and check"><p>Ball 1 should be above goal 1. Both use x <strong>-190</strong>. Ball 1 uses y <strong>143</strong>. Goal 1 uses y <strong>-130</strong>.</p></Callout>
  </>;

  if (step === 6) return <>
    <p className="step-intro">Make Ball 1 fall in a <Vocabulary term="loop" meaning="Blocks that repeat. The forever block repeats until you stop the game." />. Put the small round blocks inside the white spaces.</p>
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
    <figure className="video-demo">
      <video controls playsInline preload="metadata" aria-label="One-minute demonstration of building the Ball 1 falling script">
        <source src="/video/make-ball-fall.mp4" type="video/mp4" />
        <track kind="captions" src="/video/make-ball-fall.vtt" srcLang="en" label="English instructions" default />
      </video>
      <figcaption><strong>One-minute video:</strong> Watch the falling script being built. The video moves 4 times faster and has no sound. Pause after each group of blocks.</figcaption>
    </figure>
    <div className="recipe-grid">
      <article><span className="recipe-category operators">Operators</span><h3>How fast it falls</h3><p>Put <strong>180</strong> before divide. Put <strong>tempo</strong> after divide.</p></article>
      <article><span className="recipe-category operators">Operators</span><h3>Wait before coming back</h3><p>Put <strong>pick random 6 to 600</strong> before divide. Put <strong>tempo</strong> after divide.</p></article>
      <article><span className="recipe-category motion">Motion</span><h3>Go back to the top</h3><p>All Ball 1 x numbers are <strong>-190</strong>. The top y number is <strong>143</strong>.</p></article>
    </div>
    <Callout title="Stop and check"><p>Click the flag. Ball 1 should fall down. It should hide at the bottom. Then it should come back at the top.</p></Callout>
  </>;

  if (step === 7) return <>
    <p className="step-intro">Press D when Ball 1 is inside goal 1. A good press adds 1 point. A bad press takes away 1 point.</p>
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
    <Callout kind="tip" title="Why are there 2 wait blocks?"><p>The first wait checks that D is up. The second wait checks for a new D press. Holding D will not add many points.</p></Callout>
    <Callout title="When does D add a point?"><p>D adds a point when Ball 1 is below <strong>-140</strong> and above <strong>-170</strong>.</p></Callout>
  </>;

  if (step === 8) return <>
    <p className="step-intro">Test <Vocabulary term="lane 1" meaning="Goal 1, Ball 1, and the D key working together." /> now. Do not copy lane 1 until all 6 checks work.</p>
    <ul className="test-list">
      <li><span>1</span>Click the green flag. Ball 1 starts at the top.</li>
      <li><span>2</span>Press <kbd>D</kbd> when Ball 1 is inside the ring. Score goes up by 1.</li>
      <li><span>3</span>Press <kbd>D</kbd> too soon. Score goes down by 1.</li>
      <li><span>4</span>Hold <kbd>D</kbd>. It should count only 1 press.</li>
      <li><span>5</span>Wait. Ball 1 should hide and come back.</li>
      <li><span>6</span>Click stop. Click the flag again. Time and score go back to 0.</li>
    </ul>
    <Callout kind="warning" title="Did one check fail?"><p>Go back to steps 2 through 7. Check every number. Check the block order. Copy lane 1 only after all 6 checks work.</p></Callout>
  </>;

  if (step === 9) return <>
    <p className="step-intro">Copy lane 1. Change the copy into lane 2. Test lane 2 before making more copies.</p>
    <Callout kind="tip" title="Are you starting Part 3?"><p>Do the 6 checks in step 8 first. Come back here when all 6 checks work.</p></Callout>
    <ol className="action-list">
      <li>Right-click {valueChip("goal 1")}. Click <strong>duplicate</strong>.</li>
      <li>Name the copy {valueChip("goal 2")}.</li>
      <li>Click goal 2. Keep its blue <strong>go to</strong> position script.</li>
      <li>Delete the 4 extra scripts from goal 2: setup, timer, speed, and music.</li>
      <li>Find goal 2&apos;s blue <strong>go to</strong> block.</li>
      <li>Change x to {valueChip("-112")}. Keep y at {valueChip("-130")}.</li>
      <li>Right-click {valueChip("Ball 1")}. Click <strong>duplicate</strong>.</li>
      <li>Name the copy {valueChip("Ball 2")}.</li>
      <li>Ball 2 has 3 x numbers. Change all 3 from {valueChip("-190")} to {valueChip("-112")}.</li>
      <li>Ball 2 has 2 key blocks. Change both from <kbd>D</kbd> to <kbd>F</kbd>.</li>
      <li>Click the flag. Press F when Ball 2 is inside goal 2.</li>
    </ol>
    <div className="copy-checklist"><strong>First, clean goal 2</strong><span>Keep 1 position script</span><span>Delete 4 copied scripts</span></div>
    <div className="change-count"><strong>Then make 8 changes</strong><span>2 sprite names</span><span>1 goal x number</span><span>3 ball x numbers</span><span>2 ball keys</span></div>
    <Callout kind="warning" title="Change the blue blocks"><p>Change the x numbers inside the blue blocks. Do not move the sprites by typing in the x and y boxes below the Stage.</p></Callout>
    <Callout title="Stop and check"><p>You should see 2 rings. Ball 2 should fall into ring 2. F should score for lane 2. D should still score for lane 1.</p></Callout>
  </>;

  if (step === 10) return <>
    <p className="step-intro">Make lane 3. Test it. Then make lane 4. Always copy goal 1 and Ball 1.</p>
    <ol className="action-list">
      <li>Copy {valueChip("goal 1")}. Name the copy {valueChip("goal 3")}.</li>
      <li>On goal 3, keep the position script. Delete setup, timer, speed, and music.</li>
      <li>Copy {valueChip("Ball 1")}. Name the copy {valueChip("Ball 3")}.</li>
      <li>Use x {valueChip("-28")} in goal 3 one time.</li>
      <li>Use x {valueChip("-28")} in Ball 3 three times.</li>
      <li>Change both Ball 3 key blocks to <kbd>J</kbd>.</li>
      <li>Click the flag. Test J. Do not continue until lane 3 works.</li>
      <li>Copy {valueChip("goal 1")}. Name the copy {valueChip("goal 4")}.</li>
      <li>On goal 4, keep the position script. Delete setup, timer, speed, and music.</li>
      <li>Copy {valueChip("Ball 1")}. Name the copy {valueChip("Ball 4")}.</li>
      <li>Use x {valueChip("53")} in goal 4 one time.</li>
      <li>Use x {valueChip("53")} in Ball 4 three times.</li>
      <li>Change both Ball 4 key blocks to <kbd>K</kbd>.</li>
      <li>Click the flag. Test K.</li>
    </ol>
    <table className="value-table wide"><caption>Numbers and keys for all 4 lanes</caption><thead><tr><th>Lane</th><th>Goal x, 1 time</th><th>Ball x, 3 times</th><th>Key, 2 times</th><th>Goal y</th><th>Ball top / bottom</th><th>Good-hit area</th></tr></thead><tbody>
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
      <figcaption><strong>Short video:</strong> Open the 2 key menus in each copied ball. Change both keys. The video has no sound. Use the table for the correct key.</figcaption>
    </figure>
    <div className="change-count"><strong>Each new lane needs cleanup and 8 changes</strong><span>Delete 4 goal scripts</span><span>2 names</span><span>1 goal x number</span><span>3 ball x numbers</span><span>2 keys</span></div>
    <Callout kind="warning" title="Check every goal"><p>Goal 1 keeps its position, setup, timer, speed, and music scripts. Goals 2, 3, and 4 keep only their position scripts. Click each ball. Delete <strong>set score to 0</strong> if you see it. In the whole project, keep only one setup, one timer, one speed script, and one music script. Keep all four on goal 1.</p></Callout>
    <Callout kind="warning" title="Keep these the same"><p>Do not change the math blocks, random numbers, y numbers, score numbers, or block order in the 4 balls.</p></Callout>
  </>;

  if (step === 11) return <>
    <p className="step-intro">Test the whole game. Do the checks in order. If one check fails, use the help boxes below.</p>
    <Callout kind="tip" title="Are you starting Part 4?"><p>First, finish the clean-up box in step 10. Then come back for this one-minute test.</p></Callout>
    <div className="key-map" aria-label="Lane controls"><span><kbd>D</kbd> lane 1</span><span><kbd>F</kbd> lane 2</span><span><kbd>J</kbd> lane 3</span><span><kbd>K</kbd> lane 4</span></div>
    <ul className="test-list">
      <li><span>1</span><div><strong>Start again.</strong> Click stop. Click the green flag. Score is 0. Time is 0. Tempo is 60.</div></li>
      <li><span>2</span><div><strong>Wait 10 seconds.</strong> Do not press a key. Time should be about 10. You should hear one drum beat. Each ball should fall into its own ring.</div></li>
      <li><span>3</span><div><strong>Test D, F, J, and K.</strong> Press each key when its ball is inside its ring. Each good press adds 1 point.</div></li>
      <li><span>4</span><div><strong>Make one bad press.</strong> Press a key too soon. Score should go down by 1.</div></li>
      <li><span>5</span><div><strong>Hold one key.</strong> It should count 1 time only.</div></li>
      <li><span>6</span><div><strong>Watch the balls.</strong> Each ball should hide at the bottom. It should come back after a short wait.</div></li>
      <li><span>7</span><div><strong>Start again.</strong> Click stop. Click the flag. Score and time should go back to 0.</div></li>
    </ul>
    <Callout kind="warning" title="Check the tempo"><p>Tempo goes up by <strong>1</strong> every <strong>5 seconds</strong>. After 20 seconds, tempo should be near 64. It should not be 80 or more.</p></Callout>
    <div className="debug-grid">
      <article><h3>The ball misses the ring</h3><p>Go to the table in step 10. Check all 3 x numbers for that ball.</p></article>
      <article><h3>The wrong key scores</h3><p>Find that ball&apos;s 2 key blocks. Change both blocks to the correct key.</p></article>
      <article><h3>Time goes too fast</h3><p>Keep 1 timer on goal 1. Delete timer copies from goals 2, 3, and 4 and from all balls.</p></article>
      <article><h3>Music is too fast</h3><p>Keep 1 music script and 1 speed script on goal 1. Delete their copies from goals 2, 3, and 4 and from all balls.</p></article>
      <article><h3>One press changes score many times</h3><p>Put <strong>wait until not key pressed</strong> before <strong>wait until key pressed</strong>.</p></article>
      <article><h3>The ball does not come back</h3><p>Inside the if block, use this order: hide, wait, show, go to.</p></article>
    </div>
  </>;

  return <>
    <p className="step-intro">Compare your sprites with the finished project. Then save and test your game one more time.</p>
    <FinishedProjectInspector />
    <ol className="action-list">
      <li>Click <strong>File → Save to your computer</strong>.</li>
      <li>Name it <code>YourClass_Lastname_Firstname_4-Lane-Rhythm-Game.sb3</code>.</li>
      <li>Find the file on your computer.</li>
      <li>Check the end of the file name. It must end in <strong>.sb3</strong>.</li>
      <li>Open the saved file in Scratch.</li>
      <li>Check for 4 goals and 4 balls.</li>
      <li>Click the flag. Test D, F, J, and K one more time.</li>
      <li>Turn in the <strong>.sb3 file</strong> where your teacher told you.</li>
    </ol>
    <div className="finish-card"><p className="eyebrow">Finished game</p><h3>Check your game</h3><ul><li>4 lanes in a row</li><li>D, F, J, and K keys</li><li>Score and time</li><li>Drum music</li><li>Balls wait and come back</li><li>The game gets faster slowly</li><li>A saved .sb3 file that opens</li></ul></div>
    <details className="extension"><summary>Done early? Pick 1 extra idea</summary><ul><li>Give each lane a different color.</li><li>Add a start screen.</li><li>Play a sound for a good hit.</li><li>Stop the game after 60 seconds.</li></ul></details>
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
    if (!window.confirm("Start over? This will remove all 12 check marks on this device.")) return;
    setCompleted([]);
    setCurrent(1);
  }

  return <main>
    <header className="hero">
      <nav aria-label="Guide progress"><span className="brand">Scratch game guide</span><span className="progress-label">{completed.length} of 12 steps done</span></nav>
      <div className="hero-grid">
        <div><p className="eyebrow">Grade 7 Technology</p><h1>Make a 4-lane Scratch game</h1><p className="lede">First, make 1 goal and 1 falling ball. Test them. When they work, copy them to make 4 lanes.</p><button className="start-button" onClick={() => goTo(completed.length === 12 ? 1 : Math.min(12, completed.length + 1))}>{completed.length ? "Keep going" : "Start step 1"}</button></div>
        <div className="game-preview" aria-label="Four game lanes controlled by D, F, J, and K">{[["D", "#ffca3a"], ["F", "#ff924c"], ["J", "#ff595e"], ["K", "#8ac926"]].map(([key, color], index) => <div className="lane" key={key}><span className="falling-ball" style={{ background: color, animationDelay: `${index * .25}s` }} /><span className="goal-ring" style={{ borderColor: color }} /><kbd>{key}</kbd></div>)}</div>
      </div>
    </header>

    <section className="principle"><p className="eyebrow">The plan</p><h2>Make 2 sprites. Test them. Then copy them.</h2><p className="principle-summary">Goal 1 is the ring. Ball 1 falls into the ring. Goal 1 also runs the score, timer, speed, and music. You will make these 2 sprites work first. Then you will copy them.</p><aside className="resume-note"><strong>Did you watch the Part 1 video?</strong><span>Use steps 1 to 7 to check your work. Keep the setup, timer, speed, and music on goal 1, like the video. When you copy goal 1, delete those 4 extra scripts from each new goal. Do not copy the sprites until lane 1 passes all checks in step 8.</span></aside></section>

    <section className="guide-shell" aria-label="Step-by-step project guide">
      <aside className="step-sidebar">
        <div className="progress-track" aria-label={`${percent}% complete`}><span style={{ width: `${percent}%` }} /></div>
        <p className="sidebar-progress">{percent}% complete</p>
        <ol>{stepNames.map((name, index) => { const number = index + 1; return <li key={name}><button className={current === number ? "current" : ""} onClick={() => goTo(number)} aria-current={current === number ? "step" : undefined}><span className={completed.includes(number) ? "done" : ""}>{completed.includes(number) ? "✓" : number}</span>{name}</button></li>; })}</ol>
        <button className="quiet-button" onClick={() => window.print()}>Print all steps</button>
        <button className="quiet-button reset" onClick={resetProgress}>Start over</button>
      </aside>

      <div className="step-workspace">
        <div className="mobile-progress"><label htmlFor="step-select">Pick a step</label><select id="step-select" value={current} onChange={(event) => goTo(Number(event.target.value))}>{stepNames.map((name, index) => <option value={index + 1} key={name}>{index + 1}. {name}{completed.includes(index + 1) ? " ✓" : ""}</option>)}</select><div className="progress-track"><span style={{ width: `${percent}%` }} /></div></div>
        {stepNames.map((name, index) => { const number = index + 1; return <article id={`step-${number}`} key={name} className={`step-panel ${current === number ? "active" : ""}`} aria-labelledby={`step-${number}-title`} aria-hidden={current !== number}>
          <div className="step-heading"><p className="eyebrow">Step {number} of 12</p><h2 id={`step-${number}-title`}>{name}</h2></div>
          <StepContent step={number} />
        </article>; })}
        <div className="step-controls"><button className="back-button" disabled={current === 1} onClick={() => goTo(current - 1)}>Go back</button><button className="done-button" onClick={finishAndContinue}>{current === 12 ? (completed.includes(12) ? "Game is done" : "I finished my game") : (completed.includes(current) ? "Next step" : "I did this step")}</button></div>
        <p className="storage-note">Your check marks stay only on this browser and this device. You must also save your Scratch game as an .sb3 file.</p>
      </div>
    </section>
    <footer><strong>MOD-SCRATCH-RHYTHM-01</strong><span>Version 0.9.0 · Grade 7 prototype</span></footer>
  </main>;
}
