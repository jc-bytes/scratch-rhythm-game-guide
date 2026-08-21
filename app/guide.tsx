"use client";

import { useEffect, useId, useMemo, useState, type ReactNode } from "react";

const STORAGE_KEY = "MOD-SCRATCH-RHYTHM-01:v0.13.0:guide-progress";

const stepNames = [
  "Get Scratch ready",
  "Make Ball 1 and goal 1",
  "Make score and time",
  "Make the timer and music",
  "Put them in lane 1",
  "Make Ball 1 fall",
  "Make D change the score",
  "Test lane 1",
  "Make all the copies",
  "Change the copied sprites",
  "Test the whole game",
  "Save and turn in your game",
];

function Script({ title, code }: { title: string; code: string }) {
  return <figure className="script-card"><figcaption>{title}</figcaption><pre className="blocks" aria-label={`Scratch blocks for ${title}`}>{code.trim()}</pre></figure>;
}

function Callout({ kind = "check", title, children }: { kind?: "check" | "tip" | "warning"; title: string; children: ReactNode }) {
  return <aside className={`callout ${kind}`}><strong>{title}</strong><div>{children}</div></aside>;
}

function SaveCheckpoint({ filename }: { filename: string }) {
  return <aside className="save-checkpoint" aria-label="Save your Scratch game">
    <div>
      <p className="eyebrow">Save checkpoint</p>
      <h3>Save your Scratch game now</h3>
    </div>
    <ol>
      <li>Click <strong>File → Save to your computer</strong>.</li>
      <li>Name the file <code>{filename}</code>.</li>
      <li>Wait for the download to finish. Keep this file.</li>
    </ol>
    <p>If something breaks later, you can open this copy and keep working.</p>
  </aside>;
}

const laneOneChecks = [
  { test: <>Ball 1 starts at the top.</>, help: <>Check Ball 1&apos;s blue start block: x <strong>-190</strong>, y <strong>143</strong>.</> },
  { test: <>A good <kbd>D</kbd> press adds 1 point.</>, help: <>Check both D-key blocks. Check y &lt; -140, y &gt; -170, and change score by 1.</> },
  { test: <>An early <kbd>D</kbd> press takes away 1 point.</>, help: <>Inside else, use change score by <strong>-1</strong>.</> },
  { test: <>Holding <kbd>D</kbd> counts only 1 press.</>, help: <>Put wait until not D before wait until D.</> },
  { test: <>Ball 1 hides, waits, and comes back.</>, help: <>Inside if, use this order: hide, wait, show, go to x -190 y 143.</> },
  { test: <>Starting again puts time and score at 0.</>, help: <>On goal 1, check set time to 0 and set score to 0. Keep only one setup script.</> },
];

function LaneOneTest() {
  const [answers, setAnswers] = useState<Record<number, "yes" | "no">>({});
  const yesCount = Object.values(answers).filter((answer) => answer === "yes").length;
  return <div className="yes-no-checks">
    {laneOneChecks.map((check, index) => <article className={`yes-no-check ${answers[index] ?? "unanswered"}`} data-lane-check key={index}>
      <div className="yes-no-question"><span>{index + 1}</span><strong>{check.test}</strong></div>
      <div className="yes-no-buttons" aria-label={`Answer check ${index + 1}`}>
        <button type="button" data-lane-answer="yes" aria-pressed={answers[index] === "yes"} onClick={() => setAnswers((old) => ({ ...old, [index]: "yes" }))}>Yes</button>
        <button type="button" data-lane-answer="no" aria-pressed={answers[index] === "no"} onClick={() => setAnswers((old) => ({ ...old, [index]: "no" }))}>No</button>
      </div>
      <p className="yes-no-answer good" data-lane-message="yes" hidden={answers[index] !== "yes"}>Good. Keep going.</p>
      <p className="yes-no-answer check" data-lane-message="no" hidden={answers[index] !== "no"}><strong>Check this:</strong> {check.help}</p>
    </article>)}
    <p className={`yes-no-summary ${yesCount === laneOneChecks.length ? "ready" : "not-ready"}`} data-lane-summary>
      {yesCount === laneOneChecks.length ? "All 6 answers are Yes. Lane 1 is ready to copy." : `${yesCount} of 6 checks say Yes. Fix every No before you copy.`}
    </p>
  </div>;
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
    <figure className="video-demo">
      <video controls playsInline preload="metadata" aria-label="Silent demonstration of making the time and score variables and the Goal 1 setup script">
        <source src="/video/make-score-and-time.mp4" type="video/mp4" />
        <track kind="captions" src="/video/make-score-and-time.vtt" srcLang="en" label="English instructions" default />
      </video>
      <figcaption><strong>1-minute video:</strong> Make time and score. Then make the complete 4-block setup on goal 1. The video has no sound. Pause after each action.</figcaption>
    </figure>
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
    <figure className="video-demo">
      <video controls playsInline preload="metadata" aria-label="Silent demonstration of making the Goal 1 timer, speed, and music scripts">
        <source src="/video/make-timer-and-music.mp4" type="video/mp4" />
        <track kind="captions" src="/video/make-timer-and-music.vtt" srcLang="en" label="English instructions" default />
      </video>
      <figcaption><strong>2½-minute video:</strong> Make the timer, speed, and music scripts on goal 1. It stops before lane positioning. The video has no sound. Pause after each script.</figcaption>
    </figure>
    <Callout title="Stop and check"><p>Goal 1 should have 4 scripts: setup, timer, speed, and music. Click the green flag. You should hear drums. Time should go up by 1 each second. Tempo should go up by 1 after 5 seconds.</p></Callout>
    <SaveCheckpoint filename="Rhythm-Game-Setup-Your-Name.sb3" />
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
      <video controls playsInline preload="metadata" aria-label="Silent demonstration of making Ball 1 and goal 1">
        <source src="/video/make-goal-ring.mp4" type="video/mp4" />
        <track kind="captions" src="/video/make-goal-ring.vtt" srcLang="en" label="English instructions" default />
      </video>
      <figcaption><strong>Short video:</strong> Make Ball 1. Copy it. Turn the copy into goal 1. The video has no sound. Pause after each action.</figcaption>
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
    <figure className="video-demo">
      <video controls playsInline preload="metadata" aria-label="Silent demonstration of positioning Goal 1 and Ball 1 in the first lane">
        <source src="/video/position-lane-1.mp4" type="video/mp4" />
        <track kind="captions" src="/video/position-lane-1.vtt" srcLang="en" label="English instructions" default />
      </video>
      <figcaption><strong>1-minute video:</strong> Put goal 1 at the bottom and Ball 1 at the top. The video has no sound. Check each number.</figcaption>
    </figure>
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
      <video controls playsInline preload="metadata" aria-label="Silent demonstration of building and testing the complete Ball 1 falling script">
        <source src="/video/make-ball-fall-only.mp4" type="video/mp4" />
        <track kind="captions" src="/video/make-ball-fall-only.vtt" srcLang="en" label="English instructions" default />
      </video>
      <figcaption><strong>Complete falling video:</strong> Build and test only the Ball 1 falling script. It stops before D-key scoring. The video is at normal speed and has no sound.</figcaption>
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
    <figure className="video-demo">
      <video controls playsInline preload="metadata" aria-label="Silent demonstration of making and testing the Ball 1 D-key scoring script">
        <source src="/video/make-d-score-complete.mp4" type="video/mp4" />
        <track kind="captions" src="/video/make-d-score-complete.vtt" srcLang="en" label="English instructions" default />
      </video>
      <figcaption><strong>3½-minute video:</strong> Make the complete D-key scoring script from the first green-flag block. The video has no sound. Check the 2 D-key blocks and the 2 y numbers.</figcaption>
    </figure>
    <Callout kind="tip" title="Why are there 2 wait blocks?"><p>The first wait checks that D is up. The second wait checks for a new D press. Holding D will not add many points.</p></Callout>
    <Callout title="When does D add a point?"><p>D adds a point when Ball 1 is below <strong>-140</strong> and above <strong>-170</strong>.</p></Callout>
  </>;

  if (step === 8) return <>
    <p className="step-intro">Test <Vocabulary term="lane 1" meaning="Goal 1, Ball 1, and the D key working together." />. Click Yes or No after each test. A No answer shows what to check here.</p>
    <LaneOneTest />
    <SaveCheckpoint filename="Rhythm-Game-Lane-1-Works-Your-Name.sb3" />
  </>;

  if (step === 9) return <>
    <p className="step-intro">Make and name all 6 copies. Do not change any blocks yet.</p>
    <Callout kind="tip" title="Are you starting Part 3?"><p>Do the 6 checks in step 8 first. Come back here when all 6 checks work.</p></Callout>
    <figure className="video-demo">
      <video controls playsInline preload="metadata" aria-label="Silent demonstration of duplicating and naming the six copied sprites">
        <source src="/video/make-all-copies.mp4" type="video/mp4" />
        <track kind="captions" src="/video/make-all-copies.vtt" srcLang="en" label="English instructions" default />
      </video>
      <figcaption><strong>1½-minute copying video:</strong> Copy and name the sprites. Stop when you have 4 goals and 4 balls. Do not change blocks yet.</figcaption>
    </figure>
    <h3>Copy the goals</h3>
    <ol className="action-list">
      <li>Right-click {valueChip("goal 1")}. Click <strong>duplicate</strong>.</li>
      <li>Name the copy {valueChip("goal 2")}.</li>
      <li>Right-click goal 1 again. Duplicate it. Name the copy {valueChip("goal 3")}.</li>
      <li>Right-click goal 1 again. Duplicate it. Name the copy {valueChip("goal 4")}.</li>
    </ol>
    <h3>Copy the balls</h3>
    <ol className="action-list">
      <li>Right-click {valueChip("Ball 1")}. Click <strong>duplicate</strong>.</li>
      <li>Name the copy {valueChip("Ball 2")}.</li>
      <li>Right-click Ball 1 again. Duplicate it. Name the copy {valueChip("Ball 3")}.</li>
      <li>Right-click Ball 1 again. Duplicate it. Name the copy {valueChip("Ball 4")}.</li>
    </ol>
    <div className="copy-checklist"><strong>Stop after copying</strong><span>4 goals</span><span>4 balls</span><span>8 sprites total</span></div>
    <Callout kind="warning" title="Copy the originals"><p>Always copy goal 1 and Ball 1. Do not copy goal 2, goal 3, Ball 2, or Ball 3.</p></Callout>
    <Callout title="Stop and check"><p>You should see goal 1, goal 2, goal 3, goal 4, Ball 1, Ball 2, Ball 3, and Ball 4. Do not change positions or keys until step 10.</p></Callout>
  </>;

  if (step === 10) return <>
    <p className="step-intro">Now change the copies. Finish one pass before starting the next pass.</p>
    <h3>Pass 1: Clean and move the goals</h3>
    <ol className="action-list">
      <li>Click {valueChip("goal 2")}. Keep its blue position script. Delete the 4 extra scripts from goal 2: setup, timer, speed, and music.</li>
      <li>In goal 2&apos;s blue block, change x to {valueChip("-112")}.</li>
      <li>Click {valueChip("goal 3")}. Keep its position script. Delete its other 4 scripts. Change x to {valueChip("-28")}.</li>
      <li>Click {valueChip("goal 4")}. Keep its position script. Delete its other 4 scripts. Change x to {valueChip("53")}.</li>
    </ol>
    <Callout title="Goal check"><p>Goal 1 keeps its position, setup, timer, speed, and music scripts. It has 5 scripts. Goal 2, goal 3, and goal 4 have only 1 position script each.</p></Callout>
    <h3>Pass 2: Move the balls</h3>
    <ol className="action-list">
      <li>Click {valueChip("Ball 2")}. Change its 3 blue x numbers to {valueChip("-112")}.</li>
      <li>Click {valueChip("Ball 3")}. Change its 3 blue x numbers to {valueChip("-28")}.</li>
      <li>Click {valueChip("Ball 4")}. Change its 3 blue x numbers to {valueChip("53")}.</li>
    </ol>
    <Callout kind="warning" title="Change only the blue blocks"><p>Do not type in the x and y boxes below the Stage. Do not change any y numbers.</p></Callout>
    <h3>Pass 3: Change the keys</h3>
    <ol className="action-list">
      <li>Ball 2 has 2 key blocks. Change both from <kbd>D</kbd> to <kbd>F</kbd>.</li>
      <li>Ball 3 has 2 key blocks. Change both from <kbd>D</kbd> to <kbd>J</kbd>.</li>
      <li>Ball 4 has 2 key blocks. Change both from <kbd>D</kbd> to <kbd>K</kbd>.</li>
    </ol>
    <table className="value-table wide"><caption>Numbers and keys for all 4 lanes</caption><thead><tr><th>Lane</th><th>Goal x, 1 time</th><th>Ball x, 3 times</th><th>Key, 2 times</th><th>Goal y</th><th>Ball top / bottom</th><th>Good-hit area</th></tr></thead><tbody>
      <tr><td>1</td><td>-190</td><td>-190</td><td><kbd>D</kbd></td><td>-130</td><td>143 / -180</td><td>-140 to -170</td></tr>
      <tr><td>2</td><td>-112</td><td>-112</td><td><kbd>F</kbd></td><td>-130</td><td>143 / -180</td><td>-140 to -170</td></tr>
      <tr><td>3</td><td>-28</td><td>-28</td><td><kbd>J</kbd></td><td>-130</td><td>143 / -180</td><td>-140 to -170</td></tr>
      <tr><td>4</td><td>53</td><td>53</td><td><kbd>K</kbd></td><td>-130</td><td>143 / -180</td><td>-140 to -170</td></tr>
    </tbody></table>
    <figure className="video-demo">
      <video controls playsInline preload="metadata" aria-label="Silent demonstration of changing both key choices in Ball 2, Ball 3, and Ball 4">
        <source src="/video/change-copied-keys.mp4" type="video/mp4" />
        <track kind="captions" src="/video/change-copied-keys.vtt" srcLang="en" label="English instructions" default />
      </video>
      <figcaption><strong>2-minute key video:</strong> Change only the 2 key menus in each copied ball. Do not change the numbers shown in the video. Use the table above.</figcaption>
    </figure>
    <Callout title="Stop and test"><p>Click the flag. Test D, F, J, and K. Each ball should fall into its own ring. Each key should score for only one lane.</p></Callout>
    <Callout kind="warning" title="Keep these the same"><p>Do not change the math blocks, random numbers, y numbers, score numbers, or block order in the 4 balls.</p></Callout>
    <SaveCheckpoint filename="Rhythm-Game-4-Lanes-Your-Name.sb3" />
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
    <details className="extension">
      <summary>Need to see copying and changing again?</summary>
      <Callout kind="warning" title="Watch the actions. Do not copy the numbers."><p>This example uses different x and y numbers. Keep the numbers and keys from steps 9 and 10.</p></Callout>
      <figure className="video-demo">
        <video controls playsInline preload="metadata" aria-label="Silent optional example of duplicating, renaming, cleaning, and modifying copied Scratch sprites">
          <source src="/video/copy-and-modify-example.mp4" type="video/mp4" />
          <track kind="captions" src="/video/copy-and-modify-example.vtt" srcLang="en" label="English instructions" default />
        </video>
        <figcaption><strong>Optional 6-minute example:</strong> Watch how sprites are copied, renamed, cleaned, and changed. Use the numbers from this guide, not the video.</figcaption>
      </figure>
    </details>
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

    <section className="save-banner" role="note" aria-label="Always save your Scratch game">
      <strong>SAVE YOUR SCRATCH GAME</strong>
      <span>Click <b>File → Save to your computer</b>. Guide check marks do not save your Scratch code.</span>
    </section>

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
    <footer><strong>MOD-SCRATCH-RHYTHM-01</strong><span>Version 0.13.0 · Grade 7 prototype</span></footer>
  </main>;
}
