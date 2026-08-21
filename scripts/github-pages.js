(() => {
  "use strict";

  const storageKey = "MOD-SCRATCH-RHYTHM-01:v0.14.0:guide-progress";
  const legacyStorageKey = "MOD-SCRATCH-RHYTHM-01:v0.13.0:guide-progress";
  const panels = [...document.querySelectorAll(".step-panel")];
  const stepButtons = [...document.querySelectorAll(".step-sidebar li button")];
  const select = document.querySelector("#step-select");
  const backButton = document.querySelector(".back-button");
  const doneButton = document.querySelector(".done-button");
  const startButton = document.querySelector(".start-button");
  const resetButton = document.querySelector(".quiet-button.reset");
  const printButton = document.querySelector(".quiet-button:not(.reset)");
  const progressLabel = document.querySelector(".progress-label");
  const sidebarProgress = document.querySelector(".sidebar-progress");
  const progressBars = [...document.querySelectorAll(".progress-track > span")];
  const optionLabels = select ? [...select.options].map((option) => option.textContent.replace(/ ✓$/, "")) : [];
  let current = 1;
  let completed = [];

  function loadScratchBlocks() {
    const library = document.createElement("script");
    library.src = "./vendor/scratchblocks.min.js";
    library.addEventListener("load", () => {
      window.scratchblocks?.renderMatching("pre.blocks", {
        style: "scratch3",
        languages: ["en"],
        scale: 0.78,
      });
    }, { once: true });
    document.head.append(library);
  }

  function setupSpriteInspectors() {
    document.querySelectorAll(".sprite-inspector").forEach((inspector) => {
      const buttons = [...inspector.querySelectorAll("[data-sprite-id]")];
      const panels = [...inspector.querySelectorAll("[data-sprite-panel]")];
      buttons.forEach((button) => button.addEventListener("click", () => {
        const selected = button.dataset.spriteId;
        buttons.forEach((item) => {
          const active = item.dataset.spriteId === selected;
          item.classList.toggle("selected", active);
          item.setAttribute("aria-pressed", String(active));
        });
        panels.forEach((panel) => {
          const active = panel.dataset.spritePanel === selected;
          panel.classList.toggle("active", active);
          panel.hidden = !active;
        });
      }));
    });
  }

  function setupLaneOneTest() {
    const checks = [...document.querySelectorAll("[data-lane-check]")];
    const summary = document.querySelector("[data-lane-summary]");
    const updateSummary = () => {
      const yesCount = checks.filter((check) => check.dataset.answer === "yes").length;
      const ready = yesCount === checks.length;
      if (!summary) return;
      summary.classList.toggle("ready", ready);
      summary.classList.toggle("not-ready", !ready);
      summary.textContent = ready
        ? "All 6 answers are Yes. Lane 1 is ready to copy."
        : `${yesCount} of 6 checks say Yes. Fix every No before you copy.`;
    };
    checks.forEach((check) => {
      const buttons = [...check.querySelectorAll("[data-lane-answer]")];
      buttons.forEach((button) => button.addEventListener("click", () => {
        const answer = button.dataset.laneAnswer;
        check.dataset.answer = answer;
        check.classList.toggle("yes", answer === "yes");
        check.classList.toggle("no", answer === "no");
        check.classList.remove("unanswered");
        buttons.forEach((item) => item.setAttribute("aria-pressed", String(item.dataset.laneAnswer === answer)));
        check.querySelectorAll("[data-lane-message]").forEach((message) => {
          message.hidden = message.dataset.laneMessage !== answer;
        });
        updateSummary();
      }));
    });
    updateSummary();
  }

  function setupVideoCaptions() {
    document.querySelectorAll("[data-guided-video]").forEach((video) => {
      const caption = video.parentElement?.querySelector("[data-video-caption]");
      const sync = () => {
        const textTrack = video.textTracks?.[0];
        if (!textTrack) return;
        textTrack.mode = "hidden";
        const cue = textTrack.activeCues?.[0];
        if (caption && cue?.text) caption.textContent = cue.text;
      };
      video.addEventListener("loadedmetadata", sync);
      video.addEventListener("timeupdate", sync);
      video.querySelector("track")?.addEventListener("load", sync);
      sync();
    });
  }

  try {
    const currentSaved = localStorage.getItem(storageKey);
    const legacySaved = currentSaved ? null : localStorage.getItem(legacyStorageKey);
    const saved = JSON.parse(currentSaved || legacySaved || "null");
    if (saved && Array.isArray(saved.completed)) {
      const oldSteps = saved.completed.filter((number) => Number.isInteger(number) && number >= 1 && number <= (legacySaved ? 12 : panels.length));
      const migrateStep = (number) => number <= 9 ? [number] : number === 10 ? [10, 11, 12] : number === 11 ? [13] : number === 12 ? [14] : [];
      completed = [...new Set(legacySaved ? oldSteps.flatMap(migrateStep) : oldSteps)].sort((a, b) => a - b);
    }
    if (saved && Number.isInteger(saved.current)) {
      const nextCurrent = legacySaved ? (saved.current <= 9 ? saved.current : saved.current === 10 ? 10 : saved.current === 11 ? 13 : 14) : saved.current;
      current = Math.min(panels.length, Math.max(1, nextCurrent));
    }
  } catch {
    // The guide still works when browser storage is unavailable.
  }

  function save() {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ current, completed }));
    } catch {
      // The guide still works when browser storage is unavailable.
    }
  }

  function render() {
    const percent = Math.round((completed.length / panels.length) * 100);
    panels.forEach((panel, index) => {
      const active = index + 1 === current;
      panel.classList.toggle("active", active);
      panel.setAttribute("aria-hidden", String(!active));
    });
    stepButtons.forEach((button, index) => {
      const number = index + 1;
      const active = number === current;
      const finished = completed.includes(number);
      button.classList.toggle("current", active);
      if (active) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
      const badge = button.querySelector("span");
      if (badge) {
        badge.classList.toggle("done", finished);
        badge.textContent = finished ? "✓" : String(number);
      }
    });
    if (select) {
      select.value = String(current);
      [...select.options].forEach((option, index) => {
        option.textContent = `${optionLabels[index]}${completed.includes(index + 1) ? " ✓" : ""}`;
      });
    }
    if (progressLabel) progressLabel.textContent = `${completed.length} of ${panels.length} steps done`;
    if (sidebarProgress) sidebarProgress.textContent = `${percent}% complete`;
    progressBars.forEach((bar) => {
      bar.style.width = `${percent}%`;
      bar.parentElement?.setAttribute("aria-label", `${percent}% complete`);
    });
    if (backButton) backButton.disabled = current === 1;
    if (doneButton) {
      doneButton.textContent = current === panels.length
        ? (completed.includes(current) ? "Game is done" : "I finished my game")
        : (completed.includes(current) ? "Next step" : "I did this step");
    }
    if (startButton) startButton.textContent = completed.length ? "Keep going" : "Start step 1";
    save();
  }

  function goTo(step, scroll = true) {
    current = Math.min(panels.length, Math.max(1, step));
    render();
    if (scroll) document.querySelector(".guide-shell")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  stepButtons.forEach((button, index) => button.addEventListener("click", () => goTo(index + 1)));
  select?.addEventListener("change", () => goTo(Number(select.value)));
  backButton?.addEventListener("click", () => goTo(current - 1));
  doneButton?.addEventListener("click", () => {
    if (!completed.includes(current)) completed = [...completed, current].sort((a, b) => a - b);
    if (current < panels.length) current += 1;
    render();
    document.querySelector(".guide-shell")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  startButton?.addEventListener("click", () => goTo(completed.length === panels.length ? 1 : Math.min(panels.length, completed.length + 1)));
  printButton?.addEventListener("click", () => window.print());
  resetButton?.addEventListener("click", () => {
    if (!window.confirm(`Start over? This will remove all ${panels.length} check marks on this device.`)) return;
    completed = [];
    current = 1;
    render();
  });

  render();
  setupSpriteInspectors();
  setupLaneOneTest();
  setupVideoCaptions();
  loadScratchBlocks();
})();
