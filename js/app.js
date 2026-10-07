/* Forge app: routing and pages. */

const app = $("#app");
let current = null; // active Player (for cleanup)

// ───────────────────────── Progress model ─────────────────────────
const P = {
  lessonDone: (m, i) => !!Store.data.lessons[`${m}:${i}`]?.done,
  quizPassed: (m) => !!Store.data.quiz[m]?.passed,
  projectDone: (m) => !!Store.data.project[m]?.done,
  nodes(mod) {
    const n = mod.lessons.map((l, i) => ({ kind: "lesson", i, title: l.title, sub: `${l.minutes} min`, done: P.lessonDone(mod.id, i), href: `#/m/${mod.id}/l/${i}`, icon: String(i + 1) }));
    n.push({ kind: "quiz", title: "Module Quiz", sub: `Score ${mod.quiz.passPct}% to master`, done: P.quizPassed(mod.id), href: `#/m/${mod.id}/quiz`, icon: "trophy" });
    n.push({ kind: "project", title: mod.project.title, sub: "Mini project", done: P.projectDone(mod.id), href: `#/m/${mod.id}/project`, icon: "hammer" });
    return n;
  },
  mastery(mod) {
    const n = P.nodes(mod);
    return Math.round((n.filter((x) => x.done).length / n.length) * 100);
  },
  nextNode(mod) { return P.nodes(mod).find((x) => !x.done) || null; },
  skill(mod, skill) {
    const ls = mod.lessons.map((l, i) => [l, i]).filter(([l]) => l.skill === skill);
    if (!ls.length) return 0;
    return Math.round((ls.filter(([, i]) => P.lessonDone(mod.id, i)).length / ls.length) * 100);
  }
};

// ───────────────────────── Router ─────────────────────────
function route() {
  if (current) { current.destroy(); current = null; }
  Voice.stop();
  const parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  document.body.classList.remove("focus-mode");
  if (parts[0] === "m" && MODULES[parts[1]]) {
    const mod = MODULES[parts[1]];
    if (parts[2] === "l") return lessonPage(mod, +parts[3]);
    if (parts[2] === "quiz") return quizPage(mod);
    if (parts[2] === "project") return projectPage(mod);
    return modulePage(mod);
  }
  if (parts[0] === "review") return reviewPage();
  homePage();
}
window.addEventListener("hashchange", route);

// ───────────────────────── Home ─────────────────────────
function ring(pct, size = 76) {
  const r = 32, c = 2 * Math.PI * r;
  return `<svg class="ring" viewBox="0 0 76 76" width="${size}" height="${size}"><circle class="track" cx="38" cy="38" r="${r}"/><circle class="fill" cx="38" cy="38" r="${r}" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - pct / 100)}"/></svg>`;
}

function homePage() {
  const m1 = MODULES.m01;
  const next = P.nextNode(m1);
  const started = Object.keys(Store.data.lessons).length > 0;
  const mastery = P.mastery(m1);
  const reviewN = Store.data.review.length;
  let moduleNo = 0;

  app.innerHTML = `
  <div class="home">
    <div>
      <section class="hero">
        <div class="hero-eyebrow">${started ? "Welcome back" : "Rust · Beginner to Expert"}</div>
        <h1>${started ? (next ? `Up next: ${esc(next.title)}` : "Module 1 mastered!") : "Learn Rust by building,<br>one clear step at a time."}</h1>
        <p>${started ? `Module 1 · First Steps — ${mastery}% mastered.` : "Short lessons in plain English. Animated explainers. Real code that runs on the real compiler. Quizzes that prove you understand. Projects that make it stick."}</p>
        <div class="hero-actions">
          <a class="btn btn-primary btn-lg" href="${next ? next.href : "#/m/m01"}">${started ? "Continue" : "Start Module 1"} ${ic("arrow-right", "bold")}</a>
          <a class="btn btn-ghost btn-lg" href="#/m/m01">View module</a>
        </div>
        <div class="hero-art">${logo("rust")}</div>
      </section>

      ${COURSE.clusters.map((c, ci) => `
        <section class="cluster">
          <div class="cluster-head"><span class="cluster-num">CLUSTER ${ci + 1}</span><h2>${esc(c.title)}</h2></div>
          <p class="cluster-blurb">${esc(c.blurb)}</p>
          <div class="module-list">
            ${c.modules.map((m) => {
              moduleNo++;
              const ready = m.ready && MODULES[m.id];
              const pct = ready ? P.mastery(MODULES[m.id]) : 0;
              const tag = ready ? `<a class="module-card ready ${pct < 100 ? "current" : ""}" href="#/m/${m.id}">` : `<div class="module-card locked">`;
              return `${tag}
                <div class="module-icon">${ic(m.icon)}</div>
                <div><h3>Module ${moduleNo} · ${esc(m.title)}</h3><p>${esc(m.blurb)}</p></div>
                <div class="module-meta">${ready ? (pct === 100 ? `<span class="pill ok">${ic("seal-check", "fill")} Mastered</span>` : `<span class="pill accent">${pct}% mastered</span>`) : `<span class="pill">${ic("lock-simple", "bold")} Coming soon</span>`}</div>
              ${ready ? "</a>" : "</div>"}`;
            }).join("")}
            <div class="project-card">
              <div class="module-icon">${ic("hammer")}</div>
              <div><h3>${esc(c.project.title)}</h3><p>${esc(c.project.blurb)}</p></div>
              <div class="module-meta"><span class="pill">${ic("lock-simple", "bold")} Project</span></div>
            </div>
          </div>
        </section>`).join("")}
    </div>

    <aside class="rail">
      <div class="panel">
        <h4>Module 1 mastery</h4>
        <div class="ring-wrap">${ring(mastery)}<div><div class="ring-label">${mastery}%</div><div class="ring-sub">${P.nodes(m1).filter((n) => n.done).length} of ${P.nodes(m1).length} parts done</div></div></div>
        ${m1.skills.map((s) => `<div class="skill-row"><span>${esc(s)}</span><div class="bar"><i style="width:${P.skill(m1, s)}%"></i></div><span>${P.skill(m1, s)}%</span></div>`).join("")}
      </div>
      ${reviewN ? `
      <a class="panel" href="#/review" style="display:block;border-color:var(--warn)">
        <h4 style="color:var(--warn)">${ic("arrows-clockwise", "bold")} Review</h4>
        <b>${reviewN} question${reviewN > 1 ? "s" : ""} to review</b>
        <p style="margin:4px 0 0;color:var(--muted);font-size:14px">You missed these in a quiz. Get each one right to clear it.</p>
      </a>` : ""}
      <div class="panel">
        <h4>How you learn here</h4>
        <ul class="method-list">
          <li>${ic("film-strip")}<span><b>Explainers.</b> Animated, narrated walk-throughs of the big ideas.</span></li>
          <li>${ic("eye")}<span><b>Step-through visuals.</b> Watch memory change line by line.</span></li>
          <li>${ic("gear-six")}<span><b>Real compiler.</b> Your code runs on the official Rust Playground.</span></li>
          <li>${ic("check-square")}<span><b>Quizzes.</b> Every lesson checks you. Every module has a mastery quiz.</span></li>
          <li>${ic("hammer")}<span><b>Projects.</b> Build real things as you go.</span></li>
        </ul>
      </div>
    </aside>
  </div>`;
}

// ───────────────────────── Module page ─────────────────────────
function modulePage(mod) {
  const nodes = P.nodes(mod);
  const next = P.nextNode(mod);
  const mastery = P.mastery(mod);
  const q = Store.data.quiz[mod.id];
  app.innerHTML = `
  <div class="module-page">
    <div>
      <a class="back-link" href="#/">${ic("arrow-left", "bold")} All modules</a>
      <div class="module-banner">
        <div><small>Cluster 1 · Module 1</small><h1>${esc(mod.title)}</h1></div>
        ${next ? `<a class="btn" href="${next.href}">${mastery ? "Continue" : "Start"} ${ic("arrow-right", "bold")}</a>` : `<span class="pill ok" style="background:rgba(255,255,255,.2);color:#fff">${ic("seal-check", "fill")} Mastered</span>`}
      </div>
      <div class="path">
        ${nodes.map((n) => {
          const isNext = next && n.href === next.href;
          const cls = n.done ? "done" : isNext ? "available" : "";
          return `<div class="path-node">
            ${isNext ? `<div class="start-bubble">${mastery ? "Next" : "Start"}</div>` : ""}
            <a href="${n.href}"><button class="node-btn ${cls} ${n.kind !== "lesson" ? "special" : ""}" tabindex="-1">${n.done ? ic("check", "bold") : n.kind === "lesson" ? `<span class="node-num">${n.icon}</span>` : ic(n.icon, "fill")}</button></a>
            <div class="node-label">${esc(n.title)}<small>${esc(n.sub)}</small></div>
          </div>`;
        }).join("")}
      </div>
    </div>
    <aside class="rail">
      <div class="panel">
        <h4>Goal</h4>
        <p style="margin:0 0 14px;color:var(--text-2)">${esc(mod.goal)}</p>
        <div class="ring-wrap">${ring(mastery, 64)}<div><div class="ring-label">${mastery}%</div><div class="ring-sub">mastered${q ? ` · best quiz ${q.best}%` : ""}</div></div></div>
      </div>
      <div class="panel">
        <h4>Lessons</h4>
        <ul class="lesson-list">
          ${nodes.map((n) => `<li><a href="${n.href}"><span class="chk ${n.done ? "done" : ""}">${n.done ? ic("check", "bold") : ""}</span>${esc(n.title)}<span class="meta">${esc(n.kind === "lesson" ? n.sub : n.kind === "quiz" ? "Quiz" : "Project")}</span></a></li>`).join("")}
        </ul>
      </div>
      <div class="panel">
        <h4>You will build</h4>
        <b class="with-ic">${ic("hammer")} ${esc(mod.project.title)}</b>
        <p style="margin:4px 0 0;color:var(--muted);font-size:14px">${esc(mod.project.tagline)}</p>
      </div>
    </aside>
  </div>`;
}

// ───────────────────────── Lesson ─────────────────────────
function lessonPage(mod, i) {
  const lesson = mod.lessons[i];
  if (!lesson) return (location.hash = `#/m/${mod.id}`);
  document.body.classList.add("focus-mode");
  current = Player(app, {
    steps: lesson.steps,
    mode: "lesson",
    onClose: () => (location.hash = `#/m/${mod.id}`),
    onFinish: ({ results, secs, xpEarned, body, setFoot, api }) => {
      const key = `${mod.id}:${i}`;
      const firstTime = !Store.data.lessons[key]?.done;
      const correct = results.filter((r) => r.ok).length;
      const acc = results.length ? Math.round((correct / results.length) * 100) : 100;
      let bonus = 0;
      if (firstTime) { bonus = 20; Store.addXP(bonus); }
      const prev = Store.data.lessons[key] || {};
      Store.data.lessons[key] = { done: true, best: Math.max(prev.best || 0, acc) };
      Store.save();
      const nextHref = i + 1 < mod.lessons.length ? `#/m/${mod.id}/l/${i + 1}` : `#/m/${mod.id}/quiz`;
      const nextTitle = i + 1 < mod.lessons.length ? `Lesson ${i + 2}: ${mod.lessons[i + 1].title}` : "Module Quiz";
      api.wide(false);
      body.innerHTML = `
        <div class="complete">
          <div class="complete-badge">${ic(acc >= 90 ? "trophy" : acc >= 60 ? "star" : "barbell", "fill")}</div>
          <h1>Lesson complete!</h1>
          <p>${esc(lesson.title)} · ${acc >= 90 ? "Excellent understanding." : acc >= 60 ? "Good work. Practice makes it stick." : "You finished. Review the recap and try again later to lock it in."}</p>
          <div class="stat-tiles">
            <div class="tile xp"><div class="th">Total XP</div><div class="tv">${ic("lightning", "fill")} ${xpEarned + bonus}</div></div>
            <div class="tile acc"><div class="th">${acc >= 90 ? "Amazing" : "Accuracy"}</div><div class="tv">${ic("target", "fill")} ${acc}%</div></div>
            <div class="tile time"><div class="th">Time</div><div class="tv">${ic("timer", "fill")} ${fmtTime(secs)}</div></div>
          </div>
          <a class="next-card" href="${nextHref}">
            <div class="module-icon">${ic(i + 1 < mod.lessons.length ? "book-open" : "trophy")}</div>
            <div><small>Next up</small><b>${esc(nextTitle)}</b></div>
            <span style="margin-left:auto;color:var(--muted)">${ic("arrow-right", "bold")}</span>
          </a>
        </div>`;
      $(".step-count", app).textContent = "";
      if (acc >= 60) confetti();
      setFoot({ actions: [
        { label: "Review lesson", onClick: () => { current.destroy(); lessonPage(mod, i); } },
        { label: "Continue", primary: true, onClick: () => (location.hash = nextHref) }
      ] });
    }
  });
}

// ───────────────────────── Quiz ─────────────────────────
function quizPage(mod) {
  document.body.classList.add("focus-mode");
  const qs = shuffle(mod.quiz.questions);
  current = Player(app, {
    steps: qs,
    mode: "quiz",
    onClose: () => (location.hash = `#/m/${mod.id}`),
    onFinish: ({ results, secs, body, setFoot }) => {
      const correct = results.filter((r) => r.ok).length;
      const pct = Math.round((correct / qs.length) * 100);
      const passed = pct >= mod.quiz.passPct;
      const prev = Store.data.quiz[mod.id] || { best: 0, attempts: 0, passed: false };
      const firstPass = passed && !prev.passed;
      Store.data.quiz[mod.id] = { best: Math.max(prev.best, pct), attempts: prev.attempts + 1, passed: prev.passed || passed };
      // Review queue: add misses, clear hits.
      const rv = Store.data.review.filter((r) => !(r.m === mod.id && results.some((x) => x.step.id === r.q && x.ok)));
      results.filter((x) => !x.ok).forEach((x) => { if (!rv.some((r) => r.m === mod.id && r.q === x.step.id)) rv.push({ m: mod.id, q: x.step.id }); });
      Store.data.review = rv;
      Store.addXP(correct * 5 + (firstPass ? 50 : 0));
      const wrong = results.filter((r) => !r.ok);
      body.innerHTML = `
        <div class="complete">
          <div class="complete-badge ${passed ? "" : "muted"}">${ic(passed ? "trophy" : "books", "fill")}</div>
          <h1>${passed ? "Quiz passed!" : "Not yet. Keep going!"}</h1>
          <p>${passed ? `You scored ${pct}%. You need ${mod.quiz.passPct}% for mastery, and you did it.` : `You scored ${pct}%. You need ${mod.quiz.passPct}% for mastery. Review the answers below, then try again.`}</p>
          <div class="stat-tiles">
            <div class="tile xp"><div class="th">XP</div><div class="tv">${ic("lightning", "fill")} ${correct * 5 + (firstPass ? 50 : 0)}</div></div>
            <div class="tile acc"><div class="th">Score</div><div class="tv">${ic("target", "fill")} ${correct}/${qs.length}</div></div>
            <div class="tile time"><div class="th">Time</div><div class="tv">${ic("timer", "fill")} ${fmtTime(secs)}</div></div>
          </div>
          ${wrong.length ? `<h3 style="margin:0 0 12px">Learn from these</h3><div class="review-list">${wrong.map((w) => `<div class="review-item bad"><div class="q">${inline(w.step.prompt)}</div><div class="a">${inline(w.step.explain)}</div></div>`).join("")}</div><p style="color:var(--muted);font-size:14px;margin-top:-8px">These go to your Review list on the home page.</p>` : ""}
        </div>`;
      $(".step-count", app).textContent = "";
      if (passed) confetti(130);
      setFoot({ actions: passed
        ? [{ label: "Retake quiz", onClick: () => { current.destroy(); quizPage(mod); } }, { label: "Start the project", primary: true, onClick: () => (location.hash = `#/m/${mod.id}/project`) }]
        : [{ label: "Back to module", onClick: () => (location.hash = `#/m/${mod.id}`) }, { label: "Try again", primary: true, onClick: () => { current.destroy(); quizPage(mod); } }] });
    }
  });
}

// ───────────────────────── Review ─────────────────────────
function reviewPage() {
  const items = Store.data.review.map((r) => ({ r, q: MODULES[r.m]?.quiz.questions.find((x) => x.id === r.q) })).filter((x) => x.q);
  if (!items.length) { toast("Nothing to review. Nice!"); location.hash = "#/"; return; }
  document.body.classList.add("focus-mode");
  current = Player(app, {
    steps: items.map((x) => x.q),
    mode: "lesson",
    onClose: () => (location.hash = "#/"),
    onFinish: ({ results, body, setFoot }) => {
      const cleared = results.filter((x) => x.ok).map((x) => x.step.id);
      Store.data.review = Store.data.review.filter((r) => !cleared.includes(r.q));
      Store.save();
      body.innerHTML = `<div class="complete"><div class="complete-badge">${ic("brain", "fill")}</div><h1>Review done</h1><p>You cleared ${cleared.length} of ${results.length}. ${Store.data.review.length ? "The rest stay on your list for next time." : "Your review list is empty."}</p></div>`;
      setFoot({ actions: [{ label: "Home", primary: true, onClick: () => (location.hash = "#/") }] });
    }
  });
}

// ───────────────────────── Project ─────────────────────────
function projectPage(mod) {
  document.body.classList.add("focus-mode");
  const pr = mod.project;
  const st = (Store.data.project[mod.id] = Object.assign({ milestone: 0, done: false, code: pr.starter }, Store.data.project[mod.id] || {}));
  let open = Math.min(st.milestone, pr.milestones.length - 1);

  app.innerHTML = `
    <div class="project">
      <aside class="proj-side">
        <a class="back-link" href="#/m/${mod.id}">${ic("arrow-left", "bold")} ${esc(mod.title)}</a>
        <div class="step-kicker">Mini project</div>
        <h1>${esc(pr.title)}</h1>
        <p class="tagline">${esc(pr.tagline)}</p>
        <div class="prose" style="font-size:15px">${para(pr.brief)}</div>
        <div class="bar" style="margin-top:6px"><i class="proj-bar"></i></div>
        <ol class="milestones"></ol>
      </aside>
      <main class="proj-main"><div class="ed"></div><div class="proj-actions" style="margin-top:14px;display:flex;gap:10px;flex-wrap:wrap"></div></main>
    </div>`;
  const list = $(".milestones", app);
  const ed = makeEditor($(".ed", app), {
    code: st.code,
    runLabel: "Run & check",
    onRun: (r, code) => {
      st.code = code; Store.save();
      if (!r) return;
      const m = pr.milestones[st.milestone];
      if (!m || st.done) return;
      const ev = Rust.evaluate(m.check, code, r);
      lastEval = ev;
      if (ev.pass) {
        // Advance through every milestone this run already satisfies.
        let gained = 0;
        while (st.milestone < pr.milestones.length && Rust.evaluate(pr.milestones[st.milestone].check, code, r).pass) { st.milestone++; gained++; }
        Store.addXP(25 * gained, $('[data-act="run"]', app));
        if (st.milestone >= pr.milestones.length) {
          st.done = true;
          Store.addXP(100);
          confetti(160);
          toast("Project complete! +100 XP");
        } else toast(`Milestone ${st.milestone} done! On to the next one.`);
        open = Math.min(st.milestone, pr.milestones.length - 1);
        lastEval = null;
        Store.save();
      }
      renderMilestones();
    }
  });
  let lastEval = null;
  const shown = {};
  ed.cm.on("change", () => { st.code = ed.getCode(); clearTimeout(ed._t); ed._t = setTimeout(() => Store.save(), 400); });
  ed.resetBtn.onclick = () => { if (confirm("Reset your project code to the starter? Your current code will be lost.")) ed.setCode(pr.starter); };

  function renderMilestones() {
    $(".proj-bar", app).style.width = (Math.min(st.milestone, pr.milestones.length) / pr.milestones.length) * 100 + "%";
    list.innerHTML = pr.milestones.map((m, k) => {
      const done = k < st.milestone, cur = k === st.milestone && !st.done, locked = k > st.milestone;
      const isOpen = k === open;
      return `<li class="ms ${done ? "done" : ""} ${cur ? "current" : ""} ${locked ? "locked" : ""}">
        <button class="ms-head" data-k="${k}" ${locked ? "disabled" : ""}><span class="ms-num">${done ? ic("check", "bold") : k + 1}</span>${esc(m.title)}</button>
        ${isOpen ? `<div class="ms-body">
          <div class="prose">${para(m.task)}</div>
          ${cur && lastEval ? `<ul class="check-list">${checkItems(lastEval.items)}</ul>` : ""}
          ${cur ? `<div class="hint-box">${(m.hints || []).slice(0, shown[k] || 0).map((h, n) => `<div class="hint"><b>Hint ${n + 1}:</b> ${inline(h)}</div>`).join("")}</div>
          ${(shown[k] || 0) < (m.hints || []).length ? `<div class="task-tools"><button class="btn btn-ghost btn-sm" data-hint="${k}">${ic("lightbulb")} Hint</button></div>` : ""}` : ""}
        </div>` : ""}
      </li>`;
    }).join("");
    $$(".ms-head", list).forEach((b) => (b.onclick = () => { open = +b.dataset.k; renderMilestones(); }));
    $$("[data-hint]", list).forEach((b) => (b.onclick = () => { const k = +b.dataset.hint; shown[k] = (shown[k] || 0) + 1; renderMilestones(); }));
    const acts = $(".proj-actions", app);
    acts.innerHTML = st.done
      ? `<div class="callout tip" style="width:100%;margin:0"><span class="ci tip-ic">${ic("confetti")}</span><div><b>You built it.</b> Module 1 project complete. Compare your code with a reference solution, or keep improving yours.</div></div>
         <button class="btn btn-ghost" data-a="ref">See reference solution</button>
         <a class="btn btn-primary" href="#/m/${mod.id}">Back to module ${ic("arrow-right", "bold")}</a>`
      : `<span style="color:var(--muted);font-size:14px;align-self:center">Milestone ${st.milestone + 1} of ${pr.milestones.length}. Write code on the right, then press <b>Run & check</b>.</span>`;
    const ref = $('[data-a="ref"]', acts);
    if (ref) ref.onclick = () => {
      const box = el(`<div style="width:100%">${codeBlock(pr.solution)}</div>`);
      acts.appendChild(box); ref.remove();
    };
  }
  renderMilestones();
  current = { destroy: () => {} };
}

// ───────────────────────── Boot ─────────────────────────
Store.load();
if (Store.data.theme) document.documentElement.dataset.theme = Store.data.theme;
$("#themeBtn").onclick = () => {
  const now = document.documentElement.dataset.theme === "light" ? "dark" : "light";
  document.documentElement.dataset.theme = now;
  Store.data.theme = now;
  Store.save();
  setThemeIcon();
};
function setThemeIcon() {
  $("#themeBtn").innerHTML = ic(document.documentElement.dataset.theme === "light" ? "moon" : "sun", "bold");
}
setThemeIcon();
updateTopStats();
route();
