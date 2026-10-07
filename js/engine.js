/* Forge engine: helpers, storage, Rust runner, step renderers, players. */

// ───────────────────────── Helpers ─────────────────────────
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}
// Phosphor icon. Weights: "regular" | "bold" | "fill" | "duotone".
function ic(name, weight = "duotone", cls = "") {
  const w = weight === "regular" ? "ph" : `ph-${weight}`;
  return `<i class="${w} ph-${name} ${cls}" aria-hidden="true"></i>`;
}
// Brand logo from Simple Icons, drawn with currentColor via CSS mask.
const logo = (slug, cls = "") => `<span class="logo ${cls}" style="--logo:url(https://cdn.jsdelivr.net/npm/simple-icons@13/icons/${slug}.svg)" aria-hidden="true"></span>`;

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Inline markdown: `code`, **bold**, *em*. Code spans are protected first.
function inline(s) {
  const codes = [];
  let out = String(s).replace(/`([^`]+)`/g, (_, c) => {
    codes.push(c);
    return `\u0000${codes.length - 1}\u0000`;
  });
  out = esc(out)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?!\w)/g, "$1<em>$2</em>");
  return out.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${esc(codes[+i])}</code>`);
}

// Paragraph or list from a plain string. "\n\n" splits paragraphs; lines starting "- " form a list.
function para(s) {
  return String(s)
    .split(/\n\n+/)
    .map((chunk) => {
      const lines = chunk.split("\n");
      if (lines.every((l) => l.trim().startsWith("- "))) {
        return `<ul>${lines.map((l) => `<li>${inline(l.trim().slice(2))}</li>`).join("")}</ul>`;
      }
      const html = lines
        .map((l) => (l.trim().startsWith("- ") ? `• ${inline(l.trim().slice(2))}` : inline(l)))
        .join("<br>");
      return `<p>${html}</p>`;
    })
    .join("");
}

// Syntax highlight with CodeMirror's rust mode.
function highlight(code) {
  if (!window.CodeMirror || !CodeMirror.runMode) return esc(code);
  let html = "";
  CodeMirror.runMode(code, "rust", (text, style) => {
    if (text === "\n") { html += "\n"; return; }
    html += style ? `<span class="cm-${style.replace(/ +/g, " cm-")}">${esc(text)}</span>` : esc(text);
  });
  return html;
}
const codeBlock = (code, cls = "") => `<pre class="code-block ${cls}">${highlight(code)}</pre>`;

function renderBlocks(body) {
  return body
    .map((b) => {
      if (typeof b === "string") return para(b);
      if (b.code) return codeBlock(b.code);
      if (b.terminal) return `<pre class="code-block term">${esc(b.terminal)}</pre>`;
      if (b.shell) return `<div class="shell-block"><code>${esc(b.shell)}</code><button class="copy-btn" data-copy="${esc(b.shell)}">Copy</button></div>`;
      if (b.tip) return `<div class="callout tip"><span class="ci tip-ic">${ic("lightbulb")}</span><div>${inline(b.tip)}</div></div>`;
      if (b.warn) return `<div class="callout warn"><span class="ci warn-ic">${ic("warning")}</span><div>${inline(b.warn)}</div></div>`;
      if (b.cards) return `<div class="cards">${b.cards.map((c) => `<div class="card"><div class="ic">${ic(c.icon)}</div><b>${inline(c.title)}</b><span>${inline(c.text)}</span></div>`).join("")}</div>`;
      if (b.table) return `<table class="tbl"><thead><tr>${b.table.head.map((x) => `<th>${inline(x)}</th>`).join("")}</tr></thead><tbody>${b.table.rows.map((r) => `<tr>${r.map((x) => `<td>${inline(x)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
      if (b.logos) return `<div class="logos">${b.logos.map(([slug, name]) => `<div class="logo-tile">${logo(slug)}<span>${esc(name)}</span></div>`).join("")}</div>`;
      if (b.html) return b.html;
      return "";
    })
    .join("");
}

document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-copy]");
  if (!btn) return;
  navigator.clipboard?.writeText(btn.dataset.copy).then(() => {
    btn.textContent = "Copied";
    setTimeout(() => (btn.textContent = "Copy"), 1200);
  });
});

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove("show"), 2200);
}

function confetti(n = 90) {
  const wrap = el(`<div class="confetti"></div>`);
  const colors = ["#f26b2a", "#fcd34d", "#34d399", "#7cb4ff", "#e7a0ff", "#ff9a5a"];
  for (let i = 0; i < n; i++) {
    const c = document.createElement("i");
    c.style.left = Math.random() * 100 + "vw";
    c.style.background = colors[i % colors.length];
    c.style.animationDuration = 1.8 + Math.random() * 1.8 + "s";
    c.style.animationDelay = Math.random() * 0.5 + "s";
    c.style.transform = `rotate(${Math.random() * 360}deg)`;
    wrap.appendChild(c);
  }
  document.body.appendChild(wrap);
  setTimeout(() => wrap.remove(), 4200);
}

// ───────────────────────── Storage ─────────────────────────
const Store = {
  key: "forge.v1",
  data: null,
  load() {
    try { this.data = JSON.parse(localStorage.getItem(this.key)) || null; } catch { this.data = null; }
    this.data = Object.assign({ xp: 0, streak: 0, lastDay: null, lessons: {}, quiz: {}, project: {}, review: [], theme: null, narrate: false }, this.data || {});
  },
  save() {
    try { localStorage.setItem(this.key, JSON.stringify(this.data)); } catch {}
    updateTopStats();
  },
  today() { return new Date().toISOString().slice(0, 10); },
  touchDay() {
    const d = this.data, t = this.today();
    if (d.lastDay === t) return;
    const y = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
    d.streak = d.lastDay === y ? d.streak + 1 : 1;
    d.lastDay = t;
  },
  addXP(n, anchor) {
    this.data.xp += n;
    this.touchDay();
    this.save();
    if (anchor) floatXP(n, anchor);
  }
};
function floatXP(n, anchor) {
  const r = anchor.getBoundingClientRect();
  const f = el(`<div class="xp-float">+${n} XP</div>`);
  f.style.left = r.left + r.width / 2 - 30 + "px";
  f.style.top = r.top - 10 + "px";
  document.body.appendChild(f);
  setTimeout(() => f.remove(), 1000);
}
function updateTopStats() {
  if (!Store.data) return;
  $("#xp").textContent = Store.data.xp;
  const t = Store.today(), y = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  const alive = Store.data.lastDay === t || Store.data.lastDay === y;
  $("#streak").textContent = alive ? Store.data.streak : 0;
}

// ───────────────────────── Rust runner ─────────────────────────
const Rust = {
  async run(code) {
    const res = await fetch("https://play.rust-lang.org/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channel: "stable", mode: "debug", edition: "2021", crateType: "bin", tests: false, backtrace: false, code })
    });
    if (!res.ok) throw new Error("Playground returned " + res.status);
    const j = await res.json();
    if (j.error) throw new Error(j.error);
    return { success: !!j.success, stdout: j.stdout || "", stderr: j.stderr || "" };
  },
  cleanStderr(s) {
    return s
      .split("\n")
      .filter((l) => !/^\s*(Compiling|Finished|Running) /.test(l))
      .join("\n")
      .trim();
  },
  stripComments(code) {
    return code.replace(/\/\/[^\n]*/g, "");
  },
  evaluate(check, code, r) {
    const items = [];
    const out = r.stdout;
    const src = this.stripComments(code);
    if (check.success) items.push({ label: "Your program compiles and runs", pass: r.success });
    (check.stdoutIncludes || []).forEach((s) => items.push({ label: `Output includes <code>${esc(s)}</code>`, pass: out.includes(s) }));
    if (check.stdoutRegex) items.push({ label: check.failMsg ? esc(check.failMsg) : "Output has the right shape", pass: new RegExp(check.stdoutRegex, "m").test(out) });
    if (check.minLines) {
      const n = out.split("\n").filter((l) => l.trim()).length;
      items.push({ label: `Prints at least ${check.minLines} lines (you printed ${n})`, pass: n >= check.minLines });
    }
    if (check.codeRegex) {
      const ok = check.codeRegex.every((re) => new RegExp(re).test(src));
      items.push({ label: check.failMsg && !check.stdoutRegex ? inline(check.failMsg) : "Your code uses what the task asks for", pass: ok });
    }
    return { pass: items.every((i) => i.pass), items };
  }
};

// Editor + output panel. Returns { cm, getCode, setCode, run() }
function makeEditor(host, { code, onRun, runLabel = "Run" }) {
  host.innerHTML = `
    <div class="editor-wrap">
      <div class="editor-bar">
        <span class="fname">src/main.rs</span>
        <span class="spacer"></span>
        <button class="btn btn-ghost btn-sm" data-act="reset" title="Reset code">${ic("arrow-counter-clockwise", "bold")} Reset</button>
        <button class="btn btn-primary btn-sm" data-act="run">${ic("play", "fill")} ${runLabel} <kbd style="background:rgba(0,0,0,.2);color:#fff;border-color:rgba(255,255,255,.3)">⌘↵</kbd></button>
      </div>
      <div class="cm-host"></div>
      <div class="output">
        <div class="output-head">Output <span class="st"></span></div>
        <pre><span class="muted">Press Run to compile and run your code with the real Rust compiler.</span></pre>
      </div>
    </div>`;
  const cm = CodeMirror($(".cm-host", host), {
    value: code,
    mode: "rust",
    theme: "forge",
    lineNumbers: true,
    indentUnit: 4,
    tabSize: 4,
    matchBrackets: true,
    autoCloseBrackets: true,
    viewportMargin: Infinity,
    extraKeys: {
      "Cmd-Enter": () => run(),
      "Ctrl-Enter": () => run(),
      Tab: (c) => c.execCommand(c.somethingSelected() ? "indentMore" : "insertSoftTab")
    }
  });
  setTimeout(() => cm.refresh(), 30);
  const runBtn = $('[data-act="run"]', host);
  const st = $(".st", host);
  const pre = $(".output pre", host);
  let running = false;
  async function run() {
    if (running) return;
    running = true;
    runBtn.disabled = true;
    st.className = "st run";
    st.innerHTML = `<span class="spinner"></span> Compiling…`;
    pre.innerHTML = `<span class="muted">Sending your code to the Rust compiler…</span>`;
    const code = cm.getValue();
    try {
      const r = await Rust.run(code);
      const err = Rust.cleanStderr(r.stderr);
      let html = "";
      if (r.stdout) html += esc(r.stdout);
      if (err) html += (html ? "\n" : "") + `<span class="${r.success ? "muted" : "err"}">${esc(err)}</span>`;
      if (!html) html = `<span class="muted">(Your program ran but printed nothing.)</span>`;
      pre.innerHTML = html;
      st.className = "st " + (r.success ? "ok" : "bad");
      st.innerHTML = r.success ? `${ic("check-circle", "fill")} Ran successfully` : `${ic("x-circle", "fill")} Did not compile`;
      onRun && onRun(r, code);
    } catch (e) {
      st.className = "st bad";
      st.textContent = "Offline";
      pre.innerHTML = `<span class="err">Could not reach the Rust Playground (play.rust-lang.org).\nCheck your internet connection and try again.\n\n${esc(e.message)}</span>`;
      onRun && onRun(null, code, e);
    } finally {
      running = false;
      runBtn.disabled = false;
    }
  }
  runBtn.onclick = run;
  return { cm, run, getCode: () => cm.getValue(), setCode: (c) => cm.setValue(c), resetBtn: $('[data-act="reset"]', host) };
}

// ───────────────────────── Narration ─────────────────────────
const Voice = {
  supported: "speechSynthesis" in window,
  voice: null,
  pick() {
    if (!this.supported) return;
    const vs = speechSynthesis.getVoices();
    this.voice = vs.find((v) => /Samantha|Google US English|Daniel|Karen|Serena/i.test(v.name) && /^en/i.test(v.lang)) || vs.find((v) => /^en/i.test(v.lang)) || null;
  },
  speak(text, { onBoundary, onEnd } = {}) {
    if (!this.supported) return onEnd && onEnd();
    speechSynthesis.cancel();
    if (!this.voice) this.pick();
    const u = new SpeechSynthesisUtterance(text);
    if (this.voice) u.voice = this.voice;
    u.rate = 1.0;
    u.onboundary = (e) => onBoundary && onBoundary(e.charIndex);
    u.onend = () => onEnd && onEnd();
    speechSynthesis.speak(u);
  },
  stop() { if (this.supported) speechSynthesis.cancel(); }
};
if (Voice.supported) speechSynthesis.onvoiceschanged = () => Voice.pick();

// ───────────────────────── Step renderers ─────────────────────────
// Each renderer gets (step, api). api: { body, foot(cfg), next(), record(ok), award(n, anchor), mode, onKey(fn) }

const Steps = {};

Steps.read = (s, api) => {
  api.body.innerHTML = `
    <div class="step-kicker">Learn</div>
    <h1 class="step-title">${inline(s.title)}</h1>
    <div class="prose">${renderBlocks(s.body)}</div>`;
  api.foot({ actions: [{ label: "Continue", primary: true, onClick: api.next }] });
};

Steps.recap = (s, api) => {
  api.body.innerHTML = `
    <div class="step-kicker">Recap</div>
    <h1 class="step-title">What you learned</h1>
    <ul class="recap-list">${s.points.map((p, i) => `<li style="animation-delay:${i * 0.08}s"><span class="n">${i + 1}</span><span>${inline(p)}</span></li>`).join("")}</ul>`;
  api.foot({ actions: [{ label: "Finish lesson", primary: true, onClick: api.next }] });
};

// Explainer: animated scenes with captions and optional narration.
Steps.explainer = (s, api) => {
  let i = 0, playing = false, timer = null, wordTimer = null;
  const seen = new Set([0]);
  api.body.innerHTML = `
    <div class="step-kicker">Explainer</div>
    <h1 class="step-title">${inline(s.title)}</h1>
    <div class="explainer">
      <div class="ex-stage"></div>
      <div class="ex-caption"></div>
      <div class="ex-controls">
        <button class="btn btn-ghost btn-sm" data-a="prev" title="Previous">${ic("caret-left", "bold")}</button>
        <button class="btn btn-primary btn-sm" data-a="play" style="min-width:104px">${ic("play", "fill")} Play</button>
        <div class="ex-dots">${s.scenes.map((_, k) => `<button data-k="${k}" aria-label="Scene ${k + 1}"></button>`).join("")}</div>
        <button class="btn btn-ghost btn-sm" data-a="voice" title="Narration">${ic(Store.data.narrate ? "speaker-high" : "speaker-slash", "bold")} Voice</button>
        <button class="btn btn-ghost btn-sm" data-a="next" title="Next">${ic("caret-right", "bold")}</button>
      </div>
    </div>
    <p class="explore-count">Press <b>Play</b> to watch, or step through with the arrows. Turn on <b>Voice</b> to hear it read aloud.</p>`;
  const stage = $(".ex-stage", api.body), cap = $(".ex-caption", api.body), playBtn = $('[data-a="play"]', api.body);

  function words(text) {
    let pos = 0;
    return text.split(" ").map((w) => {
      const start = text.indexOf(w, pos);
      pos = start + w.length;
      return `<span class="word" data-c="${start}">${esc(w)}</span>`;
    }).join(" ");
  }
  function show(k) {
    clearTimeout(timer); clearInterval(wordTimer); Voice.stop();
    i = Math.max(0, Math.min(s.scenes.length - 1, k));
    seen.add(i);
    stage.innerHTML = s.scenes[i].visual;
    cap.innerHTML = words(s.scenes[i].say);
    $$(".ex-dots button", api.body).forEach((d, n) => {
      d.classList.toggle("on", n === i);
      d.classList.toggle("seen", seen.has(n) && n !== i);
    });
    if (!playing) $$(".word", cap).forEach((w) => w.classList.add("on"));
    else narrate();
  }
  function narrate() {
    const ws = $$(".word", cap);
    const advance = () => {
      if (!playing) return;
      if (i < s.scenes.length - 1) timer = setTimeout(() => show(i + 1), 700);
      else { setPlaying(false); ws.forEach((w) => w.classList.add("on")); }
    };
    if (Store.data.narrate && Voice.supported) {
      Voice.speak(s.scenes[i].say, {
        onBoundary: (c) => ws.forEach((w) => { if (+w.dataset.c <= c) w.classList.add("on"); }),
        onEnd: () => { ws.forEach((w) => w.classList.add("on")); advance(); }
      });
    } else {
      let n = 0;
      wordTimer = setInterval(() => {
        if (n < ws.length) ws[n++].classList.add("on");
        else { clearInterval(wordTimer); timer = setTimeout(advance, 900); }
      }, 260);
    }
  }
  function setPlaying(p) {
    playing = p;
    playBtn.innerHTML = p ? `${ic("pause", "fill")} Pause` : i === s.scenes.length - 1 && seen.size === s.scenes.length ? `${ic("arrow-clockwise", "bold")} Replay` : `${ic("play", "fill")} Play`;
    if (!p) { clearTimeout(timer); clearInterval(wordTimer); Voice.stop(); $$(".word", cap).forEach((w) => w.classList.add("on")); }
  }
  playBtn.onclick = () => {
    if (playing) return setPlaying(false);
    if (i === s.scenes.length - 1 && seen.size === s.scenes.length) { playing = true; setPlaying(true); show(0); return; }
    setPlaying(true); show(i);
  };
  $('[data-a="prev"]', api.body).onclick = () => { setPlaying(false); show(i - 1); };
  $('[data-a="next"]', api.body).onclick = () => { setPlaying(false); show(i + 1); };
  $$(".ex-dots button", api.body).forEach((d) => (d.onclick = () => { setPlaying(false); show(+d.dataset.k); }));
  $('[data-a="voice"]', api.body).onclick = (e) => {
    Store.data.narrate = !Store.data.narrate; Store.save();
    e.currentTarget.innerHTML = `${ic(Store.data.narrate ? "speaker-high" : "speaker-slash", "bold")} Voice`;
    if (playing) show(i);
  };
  api.onKey((e) => {
    if (e.key === "ArrowRight") { setPlaying(false); show(i + 1); return true; }
    if (e.key === "ArrowLeft") { setPlaying(false); show(i - 1); return true; }
    if (e.key === " ") { playBtn.click(); return true; }
  });
  api.cleanup(() => { setPlaying(false); });
  show(0);
  api.foot({ actions: [{ label: "Continue", primary: true, onClick: api.next }] });
};

// Anatomy: tap parts of code to learn what each does.
Steps.anatomy = (s, api) => {
  const ids = new Set();
  const lineHtml = s.lines.map((segs) => segs.map((seg) => {
    if (typeof seg === "string") return highlight(seg);
    ids.add(seg[1]);
    return `<span class="tok" data-note="${seg[1]}">${highlight(seg[0])}</span>`;
  }).join("")).join("\n");
  api.body.innerHTML = `
    <div class="step-kicker">Explore</div>
    <h1 class="step-title">${inline(s.title)}</h1>
    <p class="prose">${inline(s.intro)}</p>
    <pre class="code-block anatomy-code">${lineHtml}</pre>
    <div class="anatomy-slot"><div class="anatomy-note"><p class="placeholder">${ic("hand-tap")} Tap a highlighted part of the code.</p></div></div>
    <div class="explore-count"></div>`;
  const seen = new Set();
  const note = $(".anatomy-slot", api.body), count = $(".explore-count", api.body);
  const upd = () => (count.textContent = `${seen.size} of ${ids.size} parts explored${seen.size === ids.size ? " — nice work" : ""}`);
  upd();
  $$(".tok", api.body).forEach((t) => (t.onclick = () => {
    const id = t.dataset.note, n = s.notes[id];
    seen.add(id);
    $$(".tok", api.body).forEach((x) => {
      x.classList.toggle("active", x.dataset.note === id);
      if (seen.has(x.dataset.note)) x.classList.add("seen");
    });
    note.innerHTML = `<div class="anatomy-note"><div class="lbl">${esc(n.label)}</div><p>${inline(n.text)}</p></div>`;
    upd();
  }));
  api.foot({ actions: [{ label: "Continue", primary: true, onClick: api.next }] });
};

// Memory: step through code, watch variable boxes.
Steps.memory = (s, api) => {
  let f = 0;
  api.body.innerHTML = `
    <div class="step-kicker">Step through</div>
    <h1 class="step-title">${inline(s.title)}</h1>
    <p class="prose">${inline(s.intro)}</p>
    <div class="mem">
      <div>
        <pre class="code-block mem-code">${s.code.map((l, k) => `<span class="mem-line" data-l="${k}"><span class="ln">${k + 1}</span>${highlight(l)}</span>`).join("")}</pre>
        <div class="mem-out"></div>
      </div>
      <div class="mem-boxes"></div>
    </div>
    <div class="mem-note"></div>
    <div class="mem-ctrl">
      <button class="btn btn-ghost btn-sm" data-a="back">${ic("caret-left", "bold")} Back</button>
      <button class="btn btn-primary" data-a="step">Step ${ic("caret-right", "bold")}</button>
      <button class="btn btn-ghost btn-sm" data-a="reset">${ic("arrow-counter-clockwise", "bold")} Restart</button>
      <span class="frame-n"></span>
    </div>`;
  const boxes = $(".mem-boxes", api.body), note = $(".mem-note", api.body), out = $(".mem-out", api.body);
  const stepBtn = $('[data-a="step"]', api.body);
  function render() {
    const fr = s.frames[f];
    $$(".mem-line", api.body).forEach((l) => {
      const k = +l.dataset.l;
      l.classList.toggle("cur", k === fr.line);
      l.classList.toggle("done", k < fr.line);
    });
    boxes.innerHTML = fr.boxes.length
      ? fr.boxes.map((b) => `
        <div class="box ${b.state || ""}">
          <div class="bn"><span>${esc(b.name)}</span>${b.mut ? `<span class="mut">mut</span>` : ""}<span class="bt">${esc(b.type || "")}</span></div>
          <div class="bv">${esc(b.value)}${b.was ? `<span class="was">${esc(b.was)}</span>` : ""}</div>
        </div>`).join("")
      : `<div class="mem-empty">empty</div>`;
    const outs = s.frames.slice(0, f + 1).filter((x) => x.output).map((x) => esc(x.output));
    out.innerHTML = outs.join("<br>");
    note.innerHTML = inline(fr.note);
    $(".frame-n", api.body).textContent = `${f} / ${s.frames.length - 1}`;
    const atEnd = f === s.frames.length - 1;
    stepBtn.disabled = atEnd;
    stepBtn.innerHTML = atEnd ? `Done ${ic("check", "bold")}` : `Step ${ic("caret-right", "bold")}`;
    if (atEnd) api.foot({ actions: [{ label: "Continue", primary: true, onClick: api.next }] });
  }
  $('[data-a="back"]', api.body).onclick = () => { if (f > 0) { f--; render(); } };
  stepBtn.onclick = () => { if (f < s.frames.length - 1) { f++; render(); } };
  $('[data-a="reset"]', api.body).onclick = () => { f = 0; render(); };
  api.onKey((e) => {
    if (e.key === "ArrowRight" || e.key === " ") { stepBtn.click(); return true; }
    if (e.key === "ArrowLeft") { $('[data-a="back"]', api.body).click(); return true; }
  });
  api.foot({ text: "Step through every line to continue.", actions: [{ label: "Continue", primary: true, disabled: true }] });
  render();
};

// Terminal: type the commands yourself.
Steps.terminal = (s, api) => {
  let c = 0;
  api.body.innerHTML = `
    <div class="step-kicker">Try it</div>
    <h1 class="step-title">${inline(s.title)}</h1>
    <p class="prose">${inline(s.intro)}</p>
    <div class="termw">
      <div>
        <div class="term">
          <div class="term-bar"><i></i><i></i><i></i></div>
          <div class="term-body">
            <div class="term-lines"></div>
            <div class="term-input-row"><span class="pr">~ $</span><input class="term-input" spellcheck="false" autocomplete="off" aria-label="Terminal input"></div>
          </div>
        </div>
        <div class="term-hint"></div>
        <div class="cmd-slot"></div>
      </div>
      <div class="tree"><h5>${ic("folder-open")} Files</h5><div class="tree-body"><span class="tree-empty">No project yet.</span></div></div>
    </div>`;
  const lines = $(".term-lines", api.body), input = $(".term-input", api.body), hint = $(".term-hint", api.body);
  const tbody = $(".tree-body", api.body), slot = $(".cmd-slot", api.body), pr = $(".term-input-row .pr", api.body);
  let cwd = "~", tree = [];
  const addLine = (html, cls = "") => { lines.appendChild(el(`<div class="term-line ${cls}">${html}</div>`)); $(".term-body", api.body).scrollTop = 1e6; };
  function setHint() {
    if (c >= s.commands.length) {
      hint.innerHTML = `<span class="done-line">${ic("check-circle", "fill")} All done. You made and ran a Rust project.</span>`;
      input.disabled = true;
      api.foot({ actions: [{ label: "Continue", primary: true, onClick: api.next }] });
      return;
    }
    hint.innerHTML = `Type: <code data-fill="1">${esc(s.commands[c].cmd)}</code> <button class="link-btn" data-fill="1">(type it for me)</button>`;
    $$("[data-fill]", hint).forEach((b) => (b.onclick = () => { input.value = s.commands[c].cmd; input.focus(); }));
  }
  input.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    e.stopPropagation();
    const val = input.value.trim().replace(/\s+/g, " ");
    input.value = "";
    if (!val) return;
    addLine(`<span class="pr">${esc(cwd)} $</span> ${esc(val)}`);
    const cmd = s.commands[c];
    if (!cmd || val !== cmd.cmd) {
      addLine(`Not quite. Try typing: ${esc(cmd ? cmd.cmd : "")}`, "dim");
      $(".term", api.body).classList.add("shake");
      setTimeout(() => $(".term", api.body).classList.remove("shake"), 400);
      return;
    }
    input.disabled = true;
    let k = 0;
    const step = () => {
      if (k < cmd.output.length) {
        const o = cmd.output[k++];
        o.startsWith("!!") ? addLine(esc(o.slice(2)), "hello") : addLine(esc(o), "dim");
        setTimeout(step, 380);
      } else {
        if (cmd.cmd.startsWith("cd ")) { cwd = "~/" + cmd.cmd.slice(3); pr.textContent = cwd + " $"; }
        if (cmd.tree) {
          const old = new Set(tree);
          tree = cmd.tree;
          tbody.innerHTML = tree.map((t) => `<div class="${old.has(t) ? "" : "fresh"}">${esc(t)}</div>`).join("");
        }
        slot.innerHTML = `<div class="cmd-explain">${inline(cmd.explain)}</div>`;
        c++;
        input.disabled = false;
        input.focus();
        setHint();
      }
    };
    setTimeout(step, 250);
  });
  setHint();
  setTimeout(() => input.focus(), 50);
  api.foot({ text: "Run every command to continue.", actions: [{ label: "Continue", primary: true, disabled: true }] });
};

// Files: click through a project's files.
Steps.files = (s, api) => {
  const seen = new Set();
  api.body.innerHTML = `
    <div class="step-kicker">Explore</div>
    <h1 class="step-title">${inline(s.title)}</h1>
    <p class="prose">${inline(s.intro)}</p>
    <div class="filesw">
      <div class="file-list">${s.files.map((f, k) => `<button class="file-btn" data-k="${k}">${ic(/\/$/.test(f.path) ? "folder" : f.path.endsWith(".rs") ? "file-code" : "file-text")} ${esc(f.path)}</button>`).join("")}</div>
      <div class="file-view"><div class="anatomy-note"><p class="placeholder">${ic("cursor-click")} Pick a file to look inside.</p></div></div>
    </div>`;
  const view = $(".file-view", api.body);
  $$(".file-btn", api.body).forEach((b) => (b.onclick = () => {
    const f = s.files[+b.dataset.k];
    seen.add(b.dataset.k);
    $$(".file-btn", api.body).forEach((x) => { x.classList.toggle("on", x === b); if (seen.has(x.dataset.k)) x.classList.add("seen"); });
    const isRust = f.path.endsWith(".rs");
    view.innerHTML = `${isRust ? codeBlock(f.content) : `<pre class="code-block term">${esc(f.content)}</pre>`}<div class="anatomy-note"><div class="lbl">${esc(f.path)}</div><p>${inline(f.note)}</p></div>`;
    if (seen.size === s.files.length) api.foot({ actions: [{ label: "Continue", primary: true, onClick: api.next }] });
  }));
  api.foot({ text: "Open every file to continue.", actions: [{ label: "Continue", primary: true, disabled: true }] });
};

// Bits: toggle bits of a u8 / i8.
Steps.bits = (s, api) => {
  let mode = "u8", bits = [0, 0, 0, 0, 0, 0, 0, 0], made42 = false;
  api.body.innerHTML = `
    <div class="step-kicker">Play</div>
    <h1 class="step-title">${inline(s.title)}</h1>
    <p class="prose">${inline(s.intro)}</p>
    <div class="bits">
      <div class="bits-mode"><button data-m="u8" class="on">u8</button><button data-m="i8">i8</button></div>
      <div class="bit-row"></div>
      <div class="bits-value"><span class="big">0</span><span class="range"></span></div>
      <div class="bits-sum"></div>
      <div class="bits-actions">
        <button class="btn btn-ghost btn-sm" data-a="dec">− 1</button>
        <button class="btn btn-ghost btn-sm" data-a="inc">+ 1</button>
        <button class="btn btn-ghost btn-sm" data-a="max">Max</button>
        <button class="btn btn-ghost btn-sm" data-a="min">Min</button>
        <span style="flex:1"></span>
        <span class="pill" data-ch>${ic("target", "bold")} Challenge: make 42</span>
      </div>
      <div class="bits-msg"></div>
    </div>`;
  const row = $(".bit-row", api.body), big = $(".big", api.body), msg = $(".bits-msg", api.body);
  const place = (k) => 2 ** (7 - k);
  const val = () => {
    const u = bits.reduce((a, b, k) => a + b * place(k), 0);
    return mode === "u8" ? u : u >= 128 ? u - 256 : u;
  };
  const setVal = (v) => {
    let u = mode === "u8" ? v : (v + 256) % 256;
    bits = bits.map((_, k) => (u & place(k) ? 1 : 0));
  };
  const range = () => (mode === "u8" ? [0, 255] : [-128, 127]);
  function say(text, cls) { msg.className = `bits-msg show ${cls}`; msg.innerHTML = text; }
  function render() {
    row.innerHTML = bits.map((b, k) => `<button class="bit ${b ? "on" : ""} ${mode === "i8" && k === 0 ? "sign" : ""}" data-k="${k}">${b}<small>${mode === "i8" && k === 0 ? "−128" : place(k)}</small></button>`).join("");
    $$(".bit", row).forEach((x) => (x.onclick = () => { bits[+x.dataset.k] ^= 1; msg.className = "bits-msg"; render(); }));
    const v = val();
    big.textContent = v;
    const [lo, hi] = range();
    $(".range", api.body).innerHTML = `<code>${mode}</code> holds ${lo} to ${hi}`;
    const parts = bits.map((b, k) => (b ? (mode === "i8" && k === 0 ? "−128" : place(k)) : null)).filter((x) => x !== null);
    $(".bits-sum", api.body).textContent = parts.length > 1 ? parts.join(" + ").replace(/\+ −/g, "− ") + " = " + v : "";
    if (v === 42 && !made42) {
      made42 = true;
      const ch = $("[data-ch]", api.body);
      ch.className = "pill ok"; ch.innerHTML = `${ic("seal-check", "fill")} You made 42!`;
      api.award(5, ch);
    }
  }
  $$(".bits-mode button", api.body).forEach((b) => (b.onclick = () => {
    mode = b.dataset.m;
    $$(".bits-mode button", api.body).forEach((x) => x.classList.toggle("on", x === b));
    msg.className = "bits-msg";
    if (mode === "i8") say("In <code>i8</code>, the leftmost bit is worth <b>−128</b>. That is how a signed type stores negative numbers. Turn it on and see.", "info");
    render();
  }));
  $('[data-a="inc"]', api.body).onclick = () => {
    const [, hi] = range(), v = val();
    if (v === hi) {
      setVal(range()[0]);
      say(`<b>Overflow!</b> ${hi} + 1 does not fit in <code>${mode}</code>. In a normal (debug) build, Rust <b>stops the program</b> with <code>attempt to add with overflow</code>. In a release build it wraps around to ${range()[0]}, as you see now. Rust never ignores it quietly in debug mode.`, "bad");
    } else { setVal(v + 1); msg.className = "bits-msg"; }
    render();
  };
  $('[data-a="dec"]', api.body).onclick = () => {
    const [lo, hi] = range(), v = val();
    if (v === lo) {
      setVal(hi);
      say(`<b>Overflow!</b> ${lo} − 1 does not fit in <code>${mode}</code>. Debug builds stop with <code>attempt to subtract with overflow</code>. Release builds wrap to ${hi}.`, "bad");
    } else { setVal(v - 1); msg.className = "bits-msg"; }
    render();
  };
  $('[data-a="max"]', api.body).onclick = () => { setVal(range()[1]); msg.className = "bits-msg"; render(); };
  $('[data-a="min"]', api.body).onclick = () => { setVal(range()[0]); msg.className = "bits-msg"; render(); };
  render();
  api.foot({ actions: [{ label: "Continue", primary: true, onClick: api.next }] });
};

// ───────────────────────── Questions ─────────────────────────
// Shared check/feedback flow for every question type.
function questionFlow(api, q, { ready, grade, reveal, reset }) {
  let tries = 0;
  const refresh = () => api.foot({ actions: [{ label: "Check", primary: true, disabled: !ready(), onClick: check }] });
  function check() {
    if (!ready()) return;
    tries++;
    const ok = grade();
    if (tries === 1) api.record(ok, q);
    if (ok) {
      reveal(true);
      if (tries === 1 && api.mode === "lesson") api.award(5, $(".foot-actions", document));
      api.foot({ state: "ok", title: tries === 1 ? pick(["Correct!", "Nice work!", "Exactly right!", "You got it!"]) : "Correct now!", text: q.explain, actions: [{ label: "Continue", kind: "ok", onClick: api.next }] });
    } else if (api.mode === "quiz" || tries >= 2) {
      reveal(false, true);
      api.foot({ state: "bad", title: api.mode === "quiz" ? "Not quite" : "Here is the answer", text: q.explain, actions: [{ label: "Continue", kind: "bad", onClick: api.next }] });
    } else {
      reveal(false, false);
      api.foot({ state: "bad", title: "Not quite. Try again.", text: q.wrongHint || "Read the question again. Look closely at the code.", actions: [{ label: "Try again", kind: "bad", onClick: () => { reset(); refresh(); } }] });
    }
  }
  return refresh;
}
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const optionHtml = (o, k) => `<button class="option" data-k="${k}"><span class="key">${k + 1}</span><span>${inline(o)}</span></button>`;

Steps.mcq = (q, api) => {
  let sel = null;
  api.body.innerHTML = `
    <div class="step-kicker">${api.mode === "quiz" ? "Question" : "Check"}</div>
    <h1 class="step-title">${inline(q.prompt)}</h1>
    ${q.code ? codeBlock(q.code) : ""}
    <div class="options">${q.options.map(optionHtml).join("")}</div>`;
  const opts = $$(".option", api.body);
  const refresh = questionFlow(api, q, {
    ready: () => sel !== null,
    grade: () => sel === q.answer,
    reveal: (ok, showAnswer) => {
      opts.forEach((o) => (o.disabled = ok || showAnswer));
      opts[sel].classList.remove("selected");
      opts[sel].classList.add(ok ? "correct" : "wrong");
      if (!ok) opts[sel].classList.add("shake");
      if (showAnswer) opts[q.answer].classList.add("correct");
    },
    reset: () => { opts.forEach((o) => o.classList.remove("wrong", "selected", "shake")); sel = null; }
  });
  const choose = (k) => {
    if (opts[k].disabled || opts.some((o) => o.classList.contains("wrong") || o.classList.contains("correct"))) return;
    sel = k;
    opts.forEach((o, n) => o.classList.toggle("selected", n === k));
    refresh();
  };
  opts.forEach((o) => (o.onclick = () => choose(+o.dataset.k)));
  api.onKey((e) => { const n = parseInt(e.key, 10); if (n >= 1 && n <= opts.length) { choose(n - 1); return true; } });
  refresh();
};

Steps.compile = (q, api) => {
  const opts = [`${ic("check-circle", "fill", "c-ok")} Yes, it compiles`, `${ic("x-circle", "fill", "c-bad")} No, it has an error`];
  let sel = null;
  api.body.innerHTML = `
    <div class="step-kicker">Will it compile?</div>
    <h1 class="step-title">${inline(q.prompt)}</h1>
    ${codeBlock(q.code)}
    <div class="options compile-choices">${opts.map((o, k) => `<button class="option" data-k="${k}"><span class="key">${k + 1}</span><span>${o}</span></button>`).join("")}</div>`;
  const els = $$(".option", api.body);
  const correct = q.answer ? 0 : 1;
  const refresh = questionFlow(api, q, {
    ready: () => sel !== null,
    grade: () => sel === correct,
    reveal: (ok, showAnswer) => {
      els.forEach((o) => (o.disabled = ok || showAnswer));
      els[sel].classList.remove("selected");
      els[sel].classList.add(ok ? "correct" : "wrong");
      if (showAnswer) els[correct].classList.add("correct");
    },
    reset: () => { els.forEach((o) => o.classList.remove("wrong", "selected")); sel = null; }
  });
  const choose = (k) => {
    if (els[k].disabled || els.some((o) => o.classList.contains("wrong") || o.classList.contains("correct"))) return;
    sel = k; els.forEach((o, n) => o.classList.toggle("selected", n === k)); refresh();
  };
  els.forEach((o) => (o.onclick = () => choose(+o.dataset.k)));
  api.onKey((e) => { if (e.key === "1" || e.key === "2") { choose(+e.key - 1); return true; } });
  refresh();
};

Steps.fill = (q, api) => {
  const parts = q.template.split(/\[(\d+)\]/);
  let html = "";
  parts.forEach((p, k) => {
    if (k % 2 === 0) html += highlight(p);
    else {
      const w = Math.max(...q.answers[+p].map((a) => a.length), 3);
      html += `<input class="blank" data-i="${p}" style="--w:${w}" spellcheck="false" autocomplete="off" autocapitalize="off" aria-label="Blank ${+p + 1}">`;
    }
  });
  api.body.innerHTML = `
    <div class="step-kicker">${api.mode === "quiz" ? "Question" : "Fill in"}</div>
    <h1 class="step-title">${inline(q.prompt)}</h1>
    <pre class="code-block fill-code">${html}</pre>`;
  const inputs = $$(".blank", api.body);
  const okAt = (inp) => q.answers[+inp.dataset.i].includes(inp.value.trim());
  const refresh = questionFlow(api, q, {
    ready: () => inputs.every((i) => i.value.trim()),
    grade: () => inputs.every(okAt),
    reveal: (ok, showAnswer) => {
      inputs.forEach((i) => {
        const good = okAt(i);
        i.classList.add(good ? "correct" : "wrong");
        if (showAnswer && !good) i.value = q.answers[+i.dataset.i][0];
        if (ok || showAnswer) i.disabled = true;
      });
    },
    reset: () => inputs.forEach((i) => { i.classList.remove("wrong", "correct"); if (!okAt(i)) i.value = ""; })
  });
  inputs.forEach((i) => i.addEventListener("input", () => { i.classList.remove("wrong", "correct"); refresh(); }));
  setTimeout(() => inputs[0] && inputs[0].focus(), 60);
  refresh();
};

Steps.order = (q, api) => {
  let bank = shuffle(q.items.map((t, k) => ({ t, k })));
  if (bank.every((b, n) => b.k === n)) bank.reverse();
  let picked = [];
  api.body.innerHTML = `
    <div class="step-kicker">${api.mode === "quiz" ? "Question" : "Put in order"}</div>
    <h1 class="step-title">${inline(q.prompt)}</h1>
    <div class="order-answer"></div>
    <div class="order-bank"></div>`;
  const ans = $(".order-answer", api.body), bk = $(".order-bank", api.body);
  let locked = false;
  function render() {
    ans.innerHTML = picked.map((p, n) => `<button class="chip placed ${q.code ? "mono" : ""}" data-n="${n}"><span class="n">${n + 1}.</span>${esc(p.t)}</button>`).join("");
    bk.innerHTML = bank.map((b) => `<button class="chip ${q.code ? "mono" : ""} ${picked.includes(b) ? "used" : ""}" data-k="${b.k}">${esc(b.t)}</button>`).join("");
    $$(".chip", ans).forEach((c) => (c.onclick = () => { if (locked) return; picked.splice(+c.dataset.n, 1); render(); refresh(); }));
    $$(".chip", bk).forEach((c) => (c.onclick = () => { if (locked) return; const b = bank.find((x) => x.k === +c.dataset.k); if (!picked.includes(b)) picked.push(b); render(); refresh(); }));
  }
  const refresh = questionFlow(api, q, {
    ready: () => picked.length === q.items.length,
    grade: () => picked.every((p, n) => p.k === n),
    reveal: (ok, showAnswer) => {
      if (showAnswer) { picked = q.items.map((t, k) => bank.find((b) => b.k === k)); render(); }
      $$(".chip", ans).forEach((c, n) => c.classList.add(picked[n].k === n ? "correct" : "wrong"));
      if (ok || showAnswer) locked = true;
    },
    reset: () => { picked = []; render(); }
  });
  render();
  refresh();
};

// ───────────────────────── Code step ─────────────────────────
Steps.code = (s, api) => {
  api.wide(true);
  let fails = 0, hintN = 0, passed = false;
  api.body.innerHTML = `
    <div class="code-step">
      <div class="code-left">
        <div class="step-kicker">Code</div>
        <h1 class="step-title">${inline(s.title)}</h1>
        <div class="task-card">
          <div class="prose">${para(s.task)}</div>
          <ul class="check-list"></ul>
          <div class="hint-box"></div>
          <div class="task-tools">
            <button class="btn btn-ghost btn-sm" data-a="hint">${ic("lightbulb")} Hint</button>
            <button class="btn btn-ghost btn-sm hidden" data-a="sol">${ic("eye")} Show solution</button>
          </div>
        </div>
      </div>
      <div class="code-right"></div>
    </div>`;
  const checks = $(".check-list", api.body), hints = $(".hint-box", api.body);
  const solBtn = $('[data-a="sol"]', api.body), hintBtn = $('[data-a="hint"]', api.body);
  const ed = makeEditor($(".code-right", api.body), {
    code: s.starter,
    onRun: (r, code, err) => {
      if (!r) { api.foot({ state: "bad", title: "Can't reach the compiler", text: "Check your connection, then press Run again.", actions: [{ label: "Continue", disabled: true }] }); return; }
      const ev = Rust.evaluate(s.check, code, r);
      checks.innerHTML = checkItems(ev.items);
      if (ev.pass) {
        if (!passed) { passed = true; api.record(fails === 0, s); api.award(10, $(".foot-actions")); }
        api.foot({ state: "ok", title: pick(["It works!", "Great code!", "Compiled and correct!"]), text: fails === 0 ? "First try. Your program does exactly what the task asks." : "You read the feedback and fixed it. That is how real Rust developers work.", actions: [{ label: "Continue", kind: "ok", onClick: api.next }] });
      } else {
        fails++;
        if (fails >= 2) solBtn.classList.remove("hidden");
        const compileFail = !r.success;
        api.foot({
          state: "bad",
          title: compileFail ? "The compiler found a problem" : "Almost there",
          text: compileFail ? "Read the error in the output panel. Look at the line number it shows." : "Your code runs, but some checks did not pass. See the list on the left.",
          actions: [{ label: "Continue", disabled: true }]
        });
      }
    }
  });
  ed.resetBtn.onclick = () => ed.setCode(s.starter);
  hintBtn.onclick = () => {
    if (hintN < s.hints.length) {
      hints.appendChild(el(`<div class="hint"><b>Hint ${hintN + 1}:</b> ${inline(s.hints[hintN])}</div>`));
      hintN++;
    }
    if (hintN >= s.hints.length) { hintBtn.disabled = true; solBtn.classList.remove("hidden"); }
  };
  solBtn.onclick = () => { ed.setCode(s.solution); toast("Solution loaded. Read it, then press Run."); };
  api.cleanup(() => api.wide(false));
  api.foot({ text: "Write your code, then press Run. <kbd>⌘</kbd> <kbd>↵</kbd>", actions: [{ label: "Continue", primary: true, disabled: true }] });
};

// ───────────────────────── Player ─────────────────────────
// Runs a list of steps (a lesson, a quiz, or a review session).
function Player(root, { steps, mode = "lesson", kicker, onClose, onFinish }) {
  let idx = 0, keyHandler = null, cleanups = [];
  const startTime = Date.now();
  const results = []; // {ok, step}
  let xpEarned = 0;
  root.innerHTML = `
    <div class="player">
      <div class="player-top">
        <button class="close-btn" title="Close">${ic("x", "bold")}</button>
        <div class="progress"><i style="width:0%"></i></div>
        <span class="step-count"></span>
      </div>
      <div class="player-body"></div>
      <div class="player-foot"><div class="foot-inner"><div class="foot-feedback"></div><div class="foot-actions"></div></div></div>
    </div>`;
  const body = $(".player-body", root), foot = $(".player-foot", root);
  $(".close-btn", root).onclick = () => { cleanup(); onClose(); };

  function setFoot({ state = "", title = "", text = "", actions = [] }) {
    foot.className = "player-foot " + state;
    const icon = state === "ok" ? ic("check", "bold") : state === "bad" ? ic("x", "bold") : "";
    $(".foot-feedback", root).innerHTML = state
      ? `<div class="fb-icon">${icon}</div><div><div class="fb-title">${esc(title)}</div>${text ? `<div class="fb-text">${inline(text)}</div>` : ""}</div>`
      : text ? `<div class="fb-text" style="color:var(--muted)">${text}</div>` : "";
    const wrap = $(".foot-actions", root);
    wrap.innerHTML = "";
    actions.forEach((a) => {
      const b = el(`<button class="btn btn-lg ${a.kind ? "btn-" + a.kind : a.primary ? "btn-primary" : "btn-ghost"}" ${a.disabled ? "disabled" : ""}>${a.icon ? ic(a.icon, "bold") : ""}${esc(a.label)}</button>`);
      if (a.onClick) b.onclick = a.onClick;
      b.dataset.primary = a.primary || a.kind ? "1" : "";
      wrap.appendChild(b);
    });
  }
  function cleanup() { cleanups.forEach((f) => f()); cleanups = []; keyHandler = null; Voice.stop(); }

  const api = {
    body,
    mode,
    foot: setFoot,
    next: () => go(idx + 1),
    record: (ok, step) => results.push({ ok, step }),
    award: (n, anchor) => { xpEarned += n; Store.addXP(n, anchor); },
    onKey: (fn) => (keyHandler = fn),
    cleanup: (fn) => cleanups.push(fn),
    wide: (on) => body.classList.toggle("wide", on)
  };

  function go(n) {
    cleanup();
    idx = n;
    if (idx >= steps.length) return finish();
    $(".progress > i", root).style.width = (idx / steps.length) * 100 + "%";
    $(".step-count", root).textContent = `${idx + 1}/${steps.length}`;
    body.classList.remove("step-enter");
    void body.offsetWidth;
    body.classList.add("step-enter");
    body.innerHTML = "";
    const s = steps[idx];
    (Steps[s.type] || Steps.read)(s, api);
    window.scrollTo({ top: 0 });
  }
  function finish() {
    $(".progress > i", root).style.width = "100%";
    const secs = Math.round((Date.now() - startTime) / 1000);
    onFinish({ results, secs, xpEarned, api, body, root, setFoot });
  }

  const onKeyDown = (e) => {
    if (!document.body.contains(root.firstElementChild)) return document.removeEventListener("keydown", onKeyDown);
    const tag = (e.target.tagName || "").toLowerCase();
    const inEditor = e.target.closest && e.target.closest(".CodeMirror");
    if (inEditor) return;
    if (e.key === "Enter" && !e.metaKey && !e.ctrlKey) {
      if (tag === "button" && !e.target.closest(".foot-actions")) return;
      const b = $(".foot-actions .btn[data-primary='1']:not(:disabled)", root);
      if (b) { e.preventDefault(); b.click(); }
      return;
    }
    if (tag === "input" || tag === "textarea") return;
    if (keyHandler && keyHandler(e)) e.preventDefault();
  };
  document.addEventListener("keydown", onKeyDown);
  go(0);
  return { destroy: () => { cleanup(); document.removeEventListener("keydown", onKeyDown); } };
}

// Pass/fail checklist rows for code checks.
function checkItems(items) {
  return items.map((i) => `<li class="${i.pass ? "pass" : "fail"}">${ic(i.pass ? "check-circle" : "x-circle", "fill")}<span>${i.label}</span></li>`).join("");
}

function fmtTime(s) { const m = Math.floor(s / 60); return m ? `${m}:${String(s % 60).padStart(2, "0")}` : `${s}s`; }
