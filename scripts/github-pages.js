(() => {
  "use strict";

  const storageKey = "MOD-SCRATCH-RHYTHM-01:v0.9.0:guide-progress";
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

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
    if (saved && Array.isArray(saved.completed)) {
      completed = [...new Set(saved.completed.filter((number) => Number.isInteger(number) && number >= 1 && number <= panels.length))].sort((a, b) => a - b);
    }
    if (saved && Number.isInteger(saved.current)) current = Math.min(panels.length, Math.max(1, saved.current));
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
  loadScratchBlocks();
})();
