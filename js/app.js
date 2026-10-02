(() => {
  "use strict";

  /* =====================================================================
     Настройки методики
     ===================================================================== */
  const PASS = 0.7;                       // порог Quiz для зачёта урока (mastery learning)
  const DAILY_GOAL = 50;                  // дневная цель в XP (микрообучение)
  const XP = { correct: 5, lesson: 50, perfect: 20, review: 2, task: 15, shadow: 3, story: 10 };
  const MIN_WORDS = { a0: 15, a1: 30, a2: 50, b1: 80, b2: 120, c1: 180, c2: 250 };
  const STORE_KEY = "englishPath.v2";
  const LEGACY_KEY = "englishPath.v1";
  const DAY = 864e5;

  // Шаблон урока: 7 шагов, ≈ 25–30 минут, каждый шаг — самостоятельный микроблок
  const STEPS = [
    { key: "theory",   name: "Теория",             min: 4 },
    { key: "video",    name: "Видеоурок",          min: 6 },
    { key: "level",    name: "Видео по уровню",    min: 3 },
    { key: "words",    name: "Лексика",            min: 3 },
    { key: "practice", name: "Упражнения",         min: 5 },
    { key: "quiz",     name: "Quiz",               min: 3 },
    { key: "output",   name: "Speaking / Writing", min: 6 }
  ];
  const LEGACY_STEPS = { rules: "theory", input: "level" };

  const ACHIEVEMENTS = [
    { id: "first",   ico: "🎯", name: "Первый урок",          test: s => Object.keys(s.done).length >= 1 },
    { id: "module",  ico: "📦", name: "5 уроков",             test: s => Object.keys(s.done).length >= 5 },
    { id: "streak3", ico: "🔥", name: "3 дня подряд",         test: s => s.streak >= 3 },
    { id: "streak7", ico: "🏆", name: "Неделя без пропусков", test: s => s.streak >= 7 },
    { id: "words20", ico: "📚", name: "20 карточек в словаре", test: s => Object.keys(s.cards).length >= 20 },
    { id: "perfect", ico: "💯", name: "Quiz на 100%",         test: s => Object.values(s.done).some(v => v === 100) },
    { id: "writer",  ico: "✍️", name: "Первая работа",        test: s => s.tasks >= 1 },
    { id: "immerse", ico: "🎧", name: "Погружение",           test: s => Object.keys(s.stories).length >= 1 },
    { id: "xp500",   ico: "⭐", name: "500 XP",               test: s => s.xp >= 500 }
  ];

  const app = document.getElementById("app");

  /* =====================================================================
     Индексы курса
     ===================================================================== */
  const LESSONS = [];
  const byId = {};
  COURSE.forEach(level => level.modules.forEach(module => module.lessons.forEach(lesson => {
    const entry = { lesson, module, level, index: LESSONS.length };
    LESSONS.push(entry);
    byId[lesson.id] = entry;
  })));
  const levelById = Object.fromEntries(COURSE.map(l => [l.id, l]));
  const levelLessons = level => level.modules.flatMap(m => m.lessons);
  const firstIndexOf = levelId => byId[levelLessons(levelById[levelId])[0].id].index;

  /* =====================================================================
     Состояние (в рабочей версии — таблицы Supabase, см. docs/SPEC.md §1.3)
     ===================================================================== */
  const defaults = () => ({
    done: {}, free: false, unlockFrom: 0, xp: 0, streak: 0, lastDay: null,
    daily: { day: null, xp: 0 }, cards: {}, weak: {}, steps: {}, lessonXp: {}, ach: {},
    tasks: 0, placement: null, subs: [], stories: {}, drafts: {}
  });
  let state = defaults();
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY));
    if (saved) state = Object.assign(state, saved);
    else {
      const legacy = JSON.parse(localStorage.getItem(LEGACY_KEY));
      if (legacy && legacy.done) state.done = legacy.done;
    }
  } catch (e) {}
  const save = () => { try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {} };

  const today = () => new Date().toLocaleDateString("sv");
  const isDone = id => id in state.done;
  const isUnlocked = id => {
    if (state.free) return true;
    const i = byId[id].index;
    return i === 0 || i <= state.unlockFrom || isDone(LESSONS[i - 1].lesson.id);
  };
  const nextLesson = () => LESSONS.find(e => !isDone(e.lesson.id) && isUnlocked(e.lesson.id));
  const count = lessons => lessons.filter(l => isDone(l.id)).length;
  const dueCards = () => Object.entries(state.cards).filter(([, c]) => c.due <= Date.now());
  const stepsDone = id => STEPS.filter(s => state.steps[id] && state.steps[id][s.key]).length;
  const firstOpenStep = id => STEPS.find(s => !(state.steps[id] && state.steps[id][s.key])) || STEPS[0];
  const currentLevel = () => (nextLesson() || LESSONS[LESSONS.length - 1]).level;

  /* =====================================================================
     Утилиты
     ===================================================================== */
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const norm = s => String(s).toLowerCase().replace(/[’`]/g, "'").replace(/[.,!?;:"«»]/g, "").replace(/\s+/g, " ").trim();
  // для перевода и аудирования: I'm = I am, don't = do not …
  const expand = s => norm(s).replace(/\bwon't\b/g, "will not").replace(/\bcan't\b/g, "can not").replace(/\bcannot\b/g, "can not")
    .replace(/n't\b/g, " not").replace(/'m\b/g, " am").replace(/'re\b/g, " are").replace(/'s\b/g, " is")
    .replace(/'ve\b/g, " have").replace(/'ll\b/g, " will").replace(/'d\b/g, " would").replace(/\s+/g, " ");
  const words = s => norm(s).split(" ").filter(Boolean);
  const shuffle = arr => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const lvlStyle = level => `style="--lvl: var(--${level.id})"`;
  const pct = (a, b) => b ? Math.round(a / b * 100) : 0;
  const plural = (n, one, few, many) => {
    const m10 = n % 10, m100 = n % 100;
    return m10 === 1 && m100 !== 11 ? one : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? few : many;
  };
  const inDays = ts => {
    const d = Math.round((ts - Date.now()) / DAY);
    return d <= 0 ? "сегодня" : d === 1 ? "завтра" : `через ${d} ${plural(d, "день", "дня", "дней")}`;
  };
  const stripTags = html => { const d = document.createElement("div"); d.innerHTML = html; return d.textContent; };
  const fmtDate = ts => new Date(ts).toLocaleString("ru", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  function levenshtein(a, b) {
    const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 1; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[a.length][b.length];
  }
  // допускаем мелкие опечатки в длинных ответах (аудирование)
  const closeEnough = (answer, target) => {
    const a = expand(answer), t = expand(target);
    return a === t || levenshtein(a, t) <= Math.max(1, Math.floor(t.length * 0.06));
  };

  function toast(text) {
    const t = document.createElement("div");
    t.className = "toast"; t.textContent = text;
    document.getElementById("toasts").appendChild(t);
    setTimeout(() => t.remove(), 2700);
  }

  function speak(text, rate = 0.9, onend) {
    if (!("speechSynthesis" in window)) { toast("Озвучка не поддерживается браузером"); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.split(" / ")[0].trim());
    u.lang = "en-GB"; u.rate = rate;
    if (onend) u.onend = onend;
    speechSynthesis.speak(u);
  }

  /* Распознавание речи: shadowing и speaking (в рабочей версии — транскрибация через OpenAI) */
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  function listen(onResult, onEnd, continuous = false) {
    const r = new Recognition();
    r.lang = "en-US"; r.interimResults = true; r.continuous = continuous;
    r.onresult = e => onResult([...e.results].map(x => x[0].transcript).join(" "), e.results[e.results.length - 1].isFinal);
    r.onerror = e => { toast(e.error === "not-allowed" ? "Нет доступа к микрофону" : "Не удалось распознать речь"); };
    r.onend = onEnd;
    r.start();
    return r;
  }
  function similarity(target, said) {
    const t = words(target), s = new Set(words(said));
    return t.length ? Math.round(t.filter(w => s.has(w)).length / t.length * 100) : 0;
  }

  /* =====================================================================
     Геймификация
     ===================================================================== */
  let currentEntry = null;                // открытый урок (для прогресс-бара)
  function touchStreak() {
    const d = today();
    if (state.lastDay === d) return;
    const yesterday = new Date(Date.now() - DAY).toLocaleDateString("sv");
    state.streak = state.lastDay === yesterday ? state.streak + 1 : 1;
    state.lastDay = d;
  }
  function addXP(n, opts = {}) {
    if (n <= 0) return;
    touchStreak();
    if (state.daily.day !== today()) state.daily = { day: today(), xp: 0 };
    const before = state.daily.xp;
    state.xp += n; state.daily.xp += n;
    if (opts.lessonId) state.lessonXp[opts.lessonId] = (state.lessonXp[opts.lessonId] || 0) + n;
    if (!opts.silent) toast(`+${n} XP`);
    if (before < DAILY_GOAL && state.daily.xp >= DAILY_GOAL) setTimeout(() => toast("🎉 Дневная цель выполнена!"), 700);
    checkAchievements(); save(); updateTopbar(); refreshLessonProgress();
  }
  function checkAchievements() {
    ACHIEVEMENTS.forEach(a => {
      if (!state.ach[a.id] && a.test(state)) { state.ach[a.id] = today(); setTimeout(() => toast(`${a.ico} Достижение: ${a.name}`), 1200); }
    });
  }
  function updateTopbar() {
    document.getElementById("xpVal").textContent = state.xp;
    const alive = state.lastDay === today() || state.lastDay === new Date(Date.now() - DAY).toLocaleDateString("sv");
    document.getElementById("streakVal").textContent = alive ? state.streak : 0;
    const due = dueCards().length, badge = document.getElementById("dueBadge");
    badge.hidden = !due; badge.textContent = due;
    const reviewed = state.subs.filter(s => s.status === "reviewed" && !s.seen).length, wb = document.getElementById("worksBadge");
    wb.hidden = !reviewed; wb.textContent = reviewed;
  }
  function markStep(lessonId, key) {
    state.steps[lessonId] = state.steps[lessonId] || {};
    if (state.steps[lessonId][key]) return;
    state.steps[lessonId][key] = today();
    save(); refreshLessonProgress();
  }
  function refreshLessonProgress() {
    if (!currentEntry || !document.getElementById("lpBar")) return;
    const id = currentEntry.lesson.id, n = stepsDone(id);
    document.getElementById("lpBar").style.width = pct(n, STEPS.length) + "%";
    document.getElementById("lpText").textContent = `${n} из ${STEPS.length} шагов · ⭐ +${state.lessonXp[id] || 0} XP за урок`;
    document.querySelectorAll(".step[data-k]").forEach(el => {
      const ok = state.steps[id] && state.steps[id][el.dataset.k];
      el.classList.toggle("seen", !!ok);
      el.querySelector(".dot").textContent = ok ? "✓" : STEPS.findIndex(s => s.key === el.dataset.k) + 1;
    });
  }

  /* =====================================================================
     SRS: SM-2 для слов и правил (в рабочей версии — FSRS через ts-fsrs, SPEC §5.1)
     q: 1 = снова, 3 = трудно, 4 = хорошо, 5 = легко
     ===================================================================== */
  function sm2(card, q) {
    const c = Object.assign({}, card);
    if (q < 3) { c.reps = 0; c.interval = 0; c.lapses = (c.lapses || 0) + 1; }
    else {
      c.reps += 1;
      c.interval = c.reps === 1 ? 1 : c.reps === 2 ? 6 : Math.round(c.interval * c.ef);
      if (q === 5) c.interval = Math.max(c.interval, c.reps === 1 ? 4 : c.interval);
    }
    c.ef = Math.max(1.3, c.ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
    c.due = q < 3 ? Date.now() + 10 * 60e3 : Date.now() + c.interval * DAY;
    return c;
  }
  const previewInterval = (card, q) => { const c = sm2(card, q); return q < 3 ? "10 мин" : `${c.interval} дн.`; };
  const newCardBase = () => ({ ef: 2.5, interval: 0, reps: 0, lapses: 0, due: Date.now(), added: Date.now() });
  function addCard(en, ru, lessonId) {
    if (state.cards[en]) return false;
    state.cards[en] = Object.assign(newCardBase(), { type: "word", ru, lessonId });
    return true;
  }
  /* Карточка-правило: задание по теме урока на лицевой стороне, ответ и правило на обороте */
  function addRuleCard(lesson) {
    const key = "rule:" + lesson.id;
    if (state.cards[key]) return false;
    const ex = lesson.ex.find(e => e.t === "gap") || lesson.ex.find(e => e.t === "translate") || lesson.ex.find(e => e.t === "choice") || lesson.ex.find(e => e.t === "order");
    if (!ex) return false;
    let front, back;
    if (ex.t === "gap") { front = ex.q; back = ex.a[0]; }
    else if (ex.t === "translate") { front = `Переведите: «${ex.ru}»`; back = ex.a[0]; }
    else if (ex.t === "choice") { front = `${ex.q} (${ex.o.join(" / ")})`; back = ex.o[ex.a]; }
    else { front = `Составьте: ${shuffle(ex.s.split(" ")).join(" / ")}`; back = ex.s; }
    state.cards[key] = Object.assign(newCardBase(), { type: "rule", lessonId: lesson.id, title: lesson.title, front, back, rule: ex.explain || lessonTip(lesson) || lesson.goal });
    return true;
  }

  /* =====================================================================
     Роутер
     #/ · #/level/:id · #/lesson/:id/:step · #/dictionary · #/review · #/placement
     #/immersion · #/story/:id · #/works · #/teacher
     ===================================================================== */
  function route() {
    const [, view, id, step] = location.hash.split("/");
    const navMap = { level: "home", lesson: "home", review: "dictionary", story: "immersion", teacher: "works" };
    const active = navMap[view] || view || "home";
    document.querySelectorAll("[data-nav]").forEach(a => a.classList.toggle("active", a.dataset.nav === active));
    aiContext = null; currentEntry = null;
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    updateTopbar();
    if (view === "level" && levelById[id]) renderLevel(levelById[id]);
    else if (view === "lesson" && byId[id]) renderLesson(byId[id], LEGACY_STEPS[step] || step);
    else if (view === "dictionary") renderDictionary(id);
    else if (view === "review") renderReview();
    else if (view === "placement") renderPlacement();
    else if (view === "immersion") renderImmersion();
    else if (view === "story" && STORIES.find(s => s.id === id)) renderStory(STORIES.find(s => s.id === id));
    else if (view === "works") renderWorks();
    else if (view === "teacher") renderTeacher();
    else renderHome();
    updateAiContext();
    window.scrollTo(0, 0);
  }

  /* =====================================================================
     Личный кабинет
     ===================================================================== */
  function recommendation() {
    if (!state.placement && !Object.keys(state.done).length)
      return { title: "Определите свой уровень", text: "12 вопросов, 3 минуты. Курс откроется с подходящего вам уровня.", href: "#/placement", btn: "Пройти тест" };
    const weak = Object.entries(state.done).filter(([, s]) => s < 85).sort((a, b) => a[1] - b[1])[0]
      || Object.entries(state.weak).filter(([id]) => isDone(id)).sort((a, b) => b[1] - a[1])[0];
    if (weak && byId[weak[0]]) {
      const e = byId[weak[0]];
      return { title: "Укрепите слабое место", text: `«${e.lesson.title}» (${e.level.code}): ${state.done[e.lesson.id] ?? "–"}%. Повторите теорию и пройдите Quiz снова.`, href: `#/lesson/${e.lesson.id}/theory`, btn: "Повторить урок" };
    }
    const due = dueCards().length;
    if (due) return { title: "Карточки ждут повторения", text: `${due} ${plural(due, "карточка", "карточки", "карточек")} (слова и правила) к повторению сегодня. Около ${Math.max(1, Math.round(due / 6))} мин.`, href: "#/review", btn: "Повторить" };
    return { title: "Отличный темп!", text: "Слабых мест не найдено. Загляните в «Погружение»: текст или подкаст вашего уровня.", href: "#/immersion", btn: "Погружение" };
  }

  function renderHome() {
    const total = LESSONS.length, done = Object.keys(state.done).length;
    const next = nextLesson(), due = dueCards().length;
    const nWords = Object.values(state.cards).filter(c => c.type !== "rule").length, nRules = Object.keys(state.cards).length - nWords;
    const daily = state.daily.day === today() ? state.daily.xp : 0;
    const rec = recommendation(), cur = currentLevel();
    const pending = state.subs.filter(s => s.status === "pending").length, reviewed = state.subs.filter(s => s.status === "reviewed").length;
    const story = STORIES.find(s => s.level === cur.id) || STORIES.find(s => COURSE.findIndex(l => l.id === s.level) >= COURSE.indexOf(cur)) || STORIES[0];

    let html = `
      <h1 class="page-title">Личный кабинет</h1>
      <p class="muted" style="margin:0">Текущий уровень: <b>${cur.code} ${cur.name}</b>${state.placement ? ` · по входному тесту: ${state.placement.level.toUpperCase()}` : ""}</p>
      <div class="stat-grid">
        <div class="card stat"><b>⭐ ${state.xp}</b><span>очков опыта</span></div>
        <div class="card stat"><b>🔥 ${document.getElementById("streakVal").textContent}</b><span>${plural(state.streak, "день", "дня", "дней")} подряд</span></div>
        <div class="card stat"><b>${done}/${total}</b><span>уроков пройдено</span></div>
        <div class="card stat"><b>${nWords} + ${nRules}</b><span>слов и правил в SRS · ${due} к повторению</span></div>
      </div>
      <div class="dash-grid">
        <div class="card dash-card">
          <h3>Дневная цель: ${Math.min(daily, DAILY_GOAL)} / ${DAILY_GOAL} XP</h3>
          <p>Один шаг урока ≈ 3–6 минут. Достаточно 15 минут в день.</p>
          <div class="progress"><span style="width:${pct(Math.min(daily, DAILY_GOAL), DAILY_GOAL)}%; background: var(--ok)"></span></div>
        </div>
        <div class="card dash-card">
          <h3>${esc(rec.title)}</h3><p>${esc(rec.text)}</p>
          ${rec.btn ? `<a class="btn ghost" href="${rec.href}">${rec.btn}</a>` : ""}
        </div>
        <div class="card dash-card">
          ${next ? `<h3>Продолжить: ${next.level.code} · ${esc(next.module.title)}</h3>
            <p>«${esc(next.lesson.title)}» · шаг «${firstOpenStep(next.lesson.id).name}» · ${stepsDone(next.lesson.id)}/${STEPS.length}</p>
            <div class="progress" style="margin-bottom:12px"><span style="width:${pct(stepsDone(next.lesson.id), STEPS.length)}%"></span></div>
            <a class="btn" href="#/lesson/${next.lesson.id}/${firstOpenStep(next.lesson.id).key}">${done || stepsDone(next.lesson.id) ? "Продолжить" : "Начать"} →</a>`
          : `<h3>🎉 Курс пройден!</h3><p>Вы прошли путь от A0 до C2.</p>`}
        </div>
        <div class="card dash-card">
          <h3>Повторение (SRS): слова и правила</h3>
          <p>${due ? `Сегодня к повторению: ${due}.` : nWords + nRules ? "На сегодня всё повторено. Следующие карточки появятся позже." : "После сдачи Quiz слова и правило урока попадают сюда."}</p>
          <a class="btn ${due ? "" : "ghost"}" href="${due ? "#/review" : "#/dictionary"}">${due ? "Повторить" : "Открыть словарь"}</a>
        </div>
        <div class="card dash-card">
          <h3>🎧 Погружение: «${esc(story.title)}» (${story.level.toUpperCase()})</h3>
          <p>Текст с озвучкой и двойными субтитрами, ≈ ${story.minutes} мин. Плюс видео, подкасты и сериалы по уровню.</p>
          <a class="btn ghost" href="#/story/${story.id}">Слушать и читать</a>
        </div>
        <div class="card dash-card">
          <h3>📝 Мои работы</h3>
          <p>${state.subs.length ? `На проверке у преподавателя: ${pending} · проверено: ${reviewed} · всего работ: ${state.subs.length}` : "Здесь появятся ваши тексты и записи из шага Speaking / Writing."}</p>
          <a class="btn ghost" href="#/works">Открыть</a>
        </div>
      </div>

      <h2 class="section-title">Достижения</h2>
      <div class="achievements">${ACHIEVEMENTS.map(a => `<span class="ach ${state.ach[a.id] ? "" : "locked"}"><span class="ico">${a.ico}</span>${a.name}</span>`).join("")}</div>

      <h2 class="section-title">Путь A0 → C2</h2>
      <div class="path">`;
    html += COURSE.map(level => {
      const ls = levelLessons(level), d = count(ls);
      const locked = !isUnlocked(ls[0].id);
      return `<a class="card level-card ${locked ? "locked" : ""}" href="#/level/${level.id}" ${lvlStyle(level)}>
        <span class="badge">${level.code}</span>
        <div><h3>${level.name} <span class="muted" style="font-weight:400">— ${level.ru}</span></h3>
          <p>${esc(level.desc)}</p>
          <div class="progress"><span style="width:${pct(d, ls.length)}%"></span></div></div>
        <div class="meta">${locked ? "🔒 " : ""}${level.modules.length} units · ${d}/${ls.length} уроков</div>
      </a>`;
    }).join("") + `</div>`;
    app.innerHTML = html;
  }

  /* =====================================================================
     Уровень
     ===================================================================== */
  function renderLevel(level) {
    const next = nextLesson();
    let html = `<nav class="crumbs"><a href="#/">Кабинет</a> / <span>${level.code}</span></nav>
      <div class="level-head" ${lvlStyle(level)}><span class="badge">${level.code}</span>
        <div><h1>${level.name}</h1><span class="muted">${level.ru} · ${esc(level.desc)}</span></div></div>
      <div class="card" style="margin-bottom:18px"><b>После уровня ${level.code} вы сможете:</b>
        <ul class="goals">${level.goals.map(g => `<li>${esc(g)}</li>`).join("")}</ul></div>
      <div class="modules" ${lvlStyle(level)}>`;
    level.modules.forEach((module, mi) => {
      html += `<section class="card module"><h2>Unit ${mi + 1}. ${esc(module.title)}
        <small>${count(module.lessons)}/${module.lessons.length} пройдено</small></h2><ul class="lesson-list">`;
      module.lessons.forEach((lesson, li) => {
        const done = isDone(lesson.id), unlocked = isUnlocked(lesson.id), sd = stepsDone(lesson.id);
        const cls = done ? "done" : !unlocked ? "locked" : next && next.lesson.id === lesson.id ? "current" : "";
        html += `<li><a class="lesson-item ${cls}" href="#/lesson/${lesson.id}">
          <span class="num">${done ? "✓" : unlocked ? li + 1 : "🔒"}</span>
          <span class="title">Урок ${li + 1}. ${esc(lesson.title)}<small>${esc(lesson.goal)}</small></span>
          ${done ? `<span class="score">${state.done[lesson.id]}%</span>` : sd ? `<span class="muted small">${sd}/${STEPS.length}</span>` : ""}</a></li>`;
      });
      html += `</ul></section>`;
    });
    app.innerHTML = html + `</div>`;
  }

  /* =====================================================================
     Урок: 7 шагов
     ===================================================================== */
  function shadowLines(lesson) {
    if (lesson.shadowing) return lesson.shadowing;
    const box = document.createElement("div"); box.innerHTML = lesson.theory;
    const out = [];
    box.querySelectorAll(".ex").forEach(ex => ex.innerHTML.split(/<br\s*\/?>/i).forEach(part => {
      const t = stripTags(part).replace(/^[\s—-]+/, "").split(/ — | \(|→/)[0].trim();
      if (/[a-z]{2,}/i.test(t) && !/[а-яё]/i.test(t) && t.split(" ").length >= 2) out.push(t);
    }));
    return out.slice(0, 6);
  }
  function lessonTip(lesson) {
    const m = lesson.theory.match(/class="tip">([\s\S]*?)<\/p>/);
    return m ? stripTags(m[1]).trim() : "";
  }
  const explainOf = (lesson, item) => item.explain || lessonTip(lesson) || `Повторите теорию урока: ${lesson.goal}`;
  const taskOf = (lesson, level) => lesson.task || {
    speaking: `Расскажите вслух 4–6 предложений по теме «${lesson.title}». Используйте конструкцию урока и 3+ слова из лексики.`,
    writing: `Напишите короткий текст по теме «${lesson.title}». Используйте правило урока и минимум 3 слова из лексики.`,
    minWords: MIN_WORDS[level.id],
    target: lesson.vocab.slice(0, 5).map(v => v[0].split(" / ")[0])
  };

  /* Упражнения: из урока + автодобавление недостающих типов (выбор, вставка, аудирование, перевод, порядок слов) */
  // Английские предложения урока: примеры из теории + упражнения с подставленным правильным ответом
  function lessonSentences(lesson) {
    const out = shadowLines(lesson).slice();
    const clean = s => s.replace(/\s*\([^)]*[а-яё][^)]*\)/gi, "").replace(/\s+/g, " ").trim();
    lesson.ex.forEach(e => {
      if (e.t === "order") out.push(e.s);
      if (e.t === "choice" && e.q.includes("___")) out.push(clean(e.q.replace("___", e.o[e.a])));
      if (e.t === "gap" && e.q.includes("___")) out.push(clean(e.q.replace("___", e.a[0])));
    });
    const ok = s => !/[а-яё→=]/i.test(s) && !s.includes("___") && s.split(" ").length >= 3 && s.split(" ").length <= 12;
    return [...new Set(out.map(s => s.trim()).filter(ok))];
  }

  function buildPractice(lesson) {
    const items = lesson.ex.slice();
    const has = t => items.some(e => e.t === t);
    const lines = lessonSentences(lesson);
    const used = new Set(items.filter(e => e.t === "order").map(e => norm(e.s)));
    const take = () => { const l = lines.find(x => !used.has(norm(x))); if (l) used.add(norm(l)); return l; };
    const single = lesson.vocab.filter(v => !v[0].includes(" ") && !v[0].includes("…"));
    if (!has("choice") && lesson.vocab.length >= 3) {
      const v = lesson.vocab[0], o = shuffle([v[1], ...shuffle(lesson.vocab.slice(1)).slice(0, 2).map(x => x[1])]);
      items.push({ t: "choice", q: `Что значит «${v[0]}»?`, o, a: o.indexOf(v[1]), explain: `${v[0]} — ${v[1]}`, auto: true });
    }
    if (!has("gap")) {
      // 1) вопрос с выбором превращаем во вставку (ответ нужно вспомнить, а не узнать)
      const ch = lesson.ex.find(e => e.t === "choice" && e.q.includes("___") && !/[а-яё]/i.test(e.o[e.a]));
      if (ch) items.push({ t: "gap", q: ch.q, a: [ch.o[ch.a]], explain: ch.explain, auto: true });
      else for (const l of lines) {   // 2) пропускаем слово из лексики в предложении урока
        const w = single.find(v => new RegExp(`\\b${v[0]}\\b`, "i").test(l));
        if (w) { items.push({ t: "gap", q: l.replace(new RegExp(`\\b${w[0]}\\b`, "i"), "___") + ` (${w[1]})`, a: [w[0]], auto: true }); break; }
      }
    }
    if (!has("listen")) {
      const l = take();
      if (l) items.push({ t: "listen", s: l, auto: true });
      else if (lesson.vocab.length) {   // A0: диктант слов
        const ws = shuffle(single.length >= 3 ? single : lesson.vocab).slice(0, 3).map(v => v[0].split(" / ")[0]);
        items.push({ t: "listen", s: ws.join(", "), words: true, auto: true });
      }
    }
    if (!has("translate")) {
      const v = shuffle(single.length ? single : lesson.vocab)[0];
      if (v) items.push({ t: "translate", ru: v[1].split(" (")[0], a: v[0].split(" / "), explain: `${v[1]} — ${v[0]}`, auto: true });
    }
    if (!has("order")) {
      const l = take() || lines[0];
      if (l) items.push({ t: "order", s: l.replace(/[.!?]$/, ""), auto: true });
    }
    return items;
  }

  const quizOf = lesson => {
    if (lesson.quiz) return shuffle(lesson.quiz);
    const v = shuffle(lesson.vocab);
    const mk = (pairs, from, to, label) => pairs.map(p => {
      const wrong = shuffle(lesson.vocab.filter(x => x !== p)).slice(0, 2).map(x => x[to]);
      const o = shuffle([p[to], ...wrong]);
      return { q: label(p[from]), o, a: o.indexOf(p[to]), explain: `«${p[0]}» переводится как «${p[1]}».` };
    });
    const choice = lesson.ex.filter(e => e.t === "choice").slice(0, 2).map(e => ({ q: e.q, o: e.o, a: e.a, explain: explainOf(lesson, e) }));
    return shuffle([...mk(v.slice(0, 2), 0, 1, w => `Перевод: «${w}»`), ...mk(v.slice(2, 4), 1, 0, w => `Как по-английски: «${w}»?`), ...choice]);
  };

  function renderLesson(entry, stepKey) {
    const { lesson, module, level, index } = entry;
    aiContext = entry;
    if (!isUnlocked(lesson.id)) {
      app.innerHTML = `<nav class="crumbs"><a href="#/">Кабинет</a> / <a href="#/level/${level.id}">${level.code}</a></nav>
        <div class="card"><h2>🔒 Урок пока закрыт</h2><p>Пройдите Quiz предыдущего урока, сдайте входной тест или включите «Свободный режим» внизу страницы.</p>
        <a class="btn" href="#/lesson/${LESSONS[index - 1].lesson.id}">К предыдущему уроку</a></div>`;
      return;
    }
    currentEntry = entry;
    const si = Math.max(0, STEPS.findIndex(s => s.key === stepKey));
    const step = STEPS[si];
    const mi = level.modules.indexOf(module) + 1, li = module.lessons.indexOf(lesson) + 1;
    const totalMin = STEPS.reduce((s, x) => s + x.min, 0);
    const nextE = LESSONS[index + 1];

    app.innerHTML = `
      <nav class="crumbs"><a href="#/">Кабинет</a> / <a href="#/level/${level.id}">${level.code} ${level.name}</a> /
        <span>Unit ${mi}. ${esc(module.title)}</span></nav>
      <div class="lesson-head" ${lvlStyle(level)}>
        <h1>Урок ${li}. ${esc(lesson.title)} ${isDone(lesson.id) ? "✅" : ""}</h1>
        <div class="goal"><b>Цель:</b> ${esc(lesson.goal)} <span class="muted">· ≈ ${totalMin} мин</span></div>
        <div class="lesson-progress"><div class="progress"><span id="lpBar"></span></div><span id="lpText" class="muted small"></span></div>
      </div>
      <div class="steps">${STEPS.map((s, i) => `
        <a class="step ${i === si ? "active" : ""}" data-k="${s.key}" href="#/lesson/${lesson.id}/${s.key}"><span class="dot">${i + 1}</span>${s.name}</a>`).join("")}
      </div>
      <div class="card">
        <div class="step-meta"><h2>${si + 1}. ${step.name}</h2><span class="muted small">≈ ${step.min} мин</span></div>
        <div id="panel"></div>
        <div class="step-nav">
          ${si > 0 ? `<a class="btn ghost" href="#/lesson/${lesson.id}/${STEPS[si - 1].key}">← ${STEPS[si - 1].name}</a>` : "<span></span>"}
          ${si < STEPS.length - 1 ? `<a class="btn" href="#/lesson/${lesson.id}/${STEPS[si + 1].key}">${STEPS[si + 1].name} →</a>`
            : nextE && isUnlocked(nextE.lesson.id) ? `<a class="btn" href="#/lesson/${nextE.lesson.id}">Следующий урок →</a>` : ""}
        </div>
      </div>`;
    refreshLessonProgress();
    const panel = document.getElementById("panel");
    ({ theory: stepTheory, video: stepVideo, level: stepLevel, words: stepWords, practice: stepPractice, quiz: stepQuiz, output: stepOutput })[step.key](panel, entry);
  }

  function stepTheory(panel, { lesson }) {
    panel.innerHTML = `<div class="theory">${lesson.theory}</div>
      <p class="method-note">Объяснение на русском, примеры на английском. Если что-то непонятно, откройте 🤖 ИИ-тьютор: он объяснит проще и даст ещё примеры.</p>`;
    markStep(lesson.id, "theory");
  }

  function videoBlock(v, fallbackQuery, note) {
    if (v && v.id) return `<div class="video-wrap"><iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(v.id)}?rel=0&cc_load_policy=1"
      title="${esc(v.title)}" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>
      <p class="muted small">${esc(v.title)} · ${esc(v.channel)}</p>`;
    return `<div class="video-empty"><b>Видео для этого урока ещё не подобрано</b><br>${note}<br><br>
      <a class="btn ghost sm" target="_blank" rel="noopener" href="https://www.youtube.com/results?search_query=${encodeURIComponent(fallbackQuery)}">Найти на YouTube ↗</a></div>`;
  }

  function stepVideo(panel, { lesson, level }) {
    panel.innerHTML = videoBlock(lesson.video, `${lesson.title.replace(/[^\w\s/-]/g, " ")} English grammar ${level.code}`,
      "Методист добавляет поле <code>video: { id, title, channel }</code> в урок.") +
      `<p class="method-note">Видеоурок по теме закрепляет теорию в другом формате. На A0–B1 включайте английские субтитры, на B2+ смотрите без них.</p>`;
    markStep(lesson.id, "video");
  }

  /* Видео по уровню: введение к уровню, цели, что ученик сможет делать, где он сейчас */
  function stepLevel(panel, { lesson, level, module }) {
    const ls = levelLessons(level), d = count(ls);
    panel.innerHTML = `
      <div class="level-intro" ${lvlStyle(level)}>
        <div class="level-intro-head"><span class="badge">${level.code}</span>
          <div><b>${level.name} — ${level.ru}</b><div class="muted small">${esc(level.desc)}</div></div></div>
        ${videoBlock(level.intro, `English level ${level.code} CEFR`, "")}
        ${level.intro && level.intro.generic ? `<p class="muted small">Общее видео о шкале CEFR. Видео-введение к уровню ${level.code} записывает методист (поле <code>intro</code> уровня).</p>` : ""}
        <h3>Цели уровня ${level.code}: что вы сможете делать</h3>
        <ul class="goals">${level.goals.map(g => `<li>${esc(g)}</li>`).join("")}</ul>
        <h3>Где вы сейчас</h3>
        <div class="progress" style="margin:6px 0"><span style="width:${pct(d, ls.length)}%"></span></div>
        <p class="muted small">Пройдено ${d} из ${ls.length} уроков уровня. Этот урок помогает с целью: <b>${esc(lesson.goal)}</b></p>
        <ol class="unit-map">${level.modules.map(m => `<li class="${m === module ? "here" : ""}">${esc(m.title)} <span class="muted small">${count(m.lessons)}/${m.lessons.length}</span>${m === module ? " ← вы здесь" : ""}</li>`).join("")}</ol>
      </div>`;
    markStep(lesson.id, "level");
  }

  function stepWords(panel, { lesson }) {
    panel.innerHTML = `<div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:12px">
        <span class="muted small">Слово, транскрипция и 🔊 озвучка. Нажмите на карточку, чтобы увидеть перевод. «+» добавляет слово в словарь.</span>
        <button class="btn ghost sm" id="addAll">+ Все слова в словарь</button></div>
      <div class="flash-grid">${lesson.vocab.map(([en, ru]) => `
        <div class="flash"><div class="flash-inner">
          <div class="flash-face"><b>${esc(en)}</b>${IPA[en] ? `<span class="ipa">/${esc(IPA[en])}/</span>` : ""}
            <button class="speak" data-say="${esc(en)}" title="Произнести">🔊</button>
            <button class="add ${state.cards[en] ? "added" : ""}" data-add="${esc(en)}">${state.cards[en] ? "✓ в словаре" : "+"}</button></div>
          <div class="flash-face back"><span>${esc(ru)}</span>${IPA[en] ? `<span class="ipa">/${esc(IPA[en])}/</span>` : ""}</div>
        </div></div>`).join("")}</div>`;
    const ru = Object.fromEntries(lesson.vocab);
    panel.querySelectorAll(".flash").forEach(card => card.addEventListener("click", e => {
      const say = e.target.closest("[data-say]");
      if (say) { e.stopPropagation(); speak(say.dataset.say); return; }
      const add = e.target.closest("[data-add]");
      if (add) {
        e.stopPropagation();
        if (addCard(add.dataset.add, ru[add.dataset.add], lesson.id)) { add.classList.add("added"); add.textContent = "✓ в словаре"; checkAchievements(); save(); updateTopbar(); }
        return;
      }
      card.classList.toggle("flipped");
    }));
    panel.querySelector("#addAll").addEventListener("click", () => {
      const n = lesson.vocab.filter(([en, r]) => addCard(en, r, lesson.id)).length;
      checkAchievements(); save(); updateTopbar();
      toast(n ? `Добавлено слов: ${n}` : "Все слова уже в словаре");
      stepWords(panel, { lesson });
    });
    markStep(lesson.id, "words");
  }

  const TYPE_LABEL = { choice: "Выбор", gap: "Вставка", listen: "Аудирование", translate: "Перевод", order: "Порядок слов" };

  function stepPractice(panel, entry) {
    const { lesson } = entry;
    const items = buildPractice(lesson);
    const answers = items.map(() => null);
    let rewarded = false;

    panel.innerHTML = `<p class="muted small" style="margin-top:0">Закрепляющие упражнения: ${[...new Set(items.map(i => TYPE_LABEL[i.t]))].join(", ")}.
      Ошибки не влияют на зачёт, но система запоминает трудные темы.</p>` +
      items.map((ex, i) => {
        let title = esc(ex.q || ""), body = "";
        if (ex.t === "choice") body = `<div class="options">${ex.o.map((o, j) => `<button class="opt" data-i="${i}" data-j="${j}">${esc(o)}</button>`).join("")}</div>`;
        if (ex.t === "gap") body = `<input class="gap-input" data-i="${i}" placeholder="Впишите ответ" autocomplete="off" autocapitalize="off" spellcheck="false">`;
        if (ex.t === "order") {
          title = "Составьте предложение из слов";
          body = `<div class="order-target" data-i="${i}"></div>
            <div class="order-pool" data-i="${i}">${shuffle(ex.s.split(" ")).map(w => `<button class="chip">${esc(w)}</button>`).join("")}</div>`;
        }
        if (ex.t === "listen") {
          title = ex.words ? "Прослушайте и запишите слова через запятую" : "Прослушайте и запишите предложение";
          body = `<div class="listen-bar"><button class="btn ghost sm" data-play="${i}" data-rate="0.9">▶ Слушать</button>
            <button class="btn ghost sm" data-play="${i}" data-rate="0.6">🐢 Медленно</button></div>
            <input class="gap-input wide" data-i="${i}" placeholder="Что вы услышали?" autocomplete="off" autocapitalize="off" spellcheck="false">`;
        }
        if (ex.t === "translate") {
          title = `Переведите на английский: «${esc(ex.ru)}»`;
          body = `<input class="gap-input wide" data-i="${i}" placeholder="Перевод" autocomplete="off" autocapitalize="off" spellcheck="false">`;
        }
        return `<div class="exercise"><div class="q"><span class="n">${i + 1}.</span><span class="type-tag">${TYPE_LABEL[ex.t]}</span>${title}</div>${body}<div class="feedback" id="fb${i}"></div></div>`;
      }).join("") + `<div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap"><button class="btn" id="check">Проверить</button>
        <button class="btn ghost" id="again">Заново</button></div><div id="result"></div>`;

    panel.querySelectorAll(".opt").forEach(b => b.addEventListener("click", () => {
      const i = +b.dataset.i;
      panel.querySelectorAll(`.opt[data-i="${i}"]`).forEach(x => x.classList.remove("selected"));
      b.classList.add("selected"); answers[i] = +b.dataset.j;
    }));
    panel.querySelectorAll(".gap-input").forEach(inp => inp.addEventListener("input", () => { answers[+inp.dataset.i] = inp.value; }));
    panel.querySelectorAll("[data-play]").forEach(b => b.addEventListener("click", () => speak(items[+b.dataset.play].s, +b.dataset.rate)));
    panel.querySelectorAll(".order-pool, .order-target").forEach(box => box.addEventListener("click", e => {
      const chip = e.target.closest(".chip"); if (!chip) return;
      const i = box.dataset.i;
      panel.querySelector(box.classList.contains("order-pool") ? `.order-target[data-i="${i}"]` : `.order-pool[data-i="${i}"]`).appendChild(chip);
      answers[+i] = [...panel.querySelectorAll(`.order-target[data-i="${i}"] .chip`)].map(c => c.textContent).join(" ");
    }));
    panel.querySelector("#again").addEventListener("click", () => stepPractice(panel, entry));

    panel.querySelector("#check").addEventListener("click", () => {
      let right = 0;
      items.forEach((ex, i) => {
        let ok = false, correct = "";
        const a = answers[i];
        if (ex.t === "choice") {
          ok = a === ex.a; correct = ex.o[ex.a];
          panel.querySelectorAll(`.opt[data-i="${i}"]`).forEach(b => {
            b.classList.remove("correct", "wrong");
            if (+b.dataset.j === ex.a) b.classList.add("correct"); else if (+b.dataset.j === a) b.classList.add("wrong");
          });
        }
        if (ex.t === "gap") { ok = a != null && ex.a.some(x => norm(x) === norm(a)); correct = ex.a[0]; }
        if (ex.t === "translate") { ok = a != null && ex.a.some(x => expand(x) === expand(a)); correct = ex.a[0]; }
        if (ex.t === "listen") { ok = a != null && closeEnough(a, ex.s); correct = ex.s; }
        if (ex.t === "order") {
          ok = a != null && norm(a) === norm(ex.s); correct = ex.s;
          const t = panel.querySelector(`.order-target[data-i="${i}"]`);
          t.classList.toggle("correct", ok); t.classList.toggle("wrong", !ok);
        }
        const inp = panel.querySelector(`.gap-input[data-i="${i}"]`);
        if (inp) { inp.classList.toggle("correct", ok); inp.classList.toggle("wrong", !ok); }
        if (ok) right++;
        const fb = panel.querySelector(`#fb${i}`);
        fb.className = "feedback " + (ok ? "ok" : "bad");
        fb.innerHTML = ok ? (ex.t === "listen" ? `Верно! «${esc(ex.s)}»` : "Верно!")
          : `Правильный ответ: <b>${esc(correct)}</b><span class="explain">💡 ${esc(explainOf(lesson, ex))}</span>`;
      });
      const wrong = items.length - right;
      if (wrong) state.weak[lesson.id] = (state.weak[lesson.id] || 0) + wrong;
      if (!rewarded) { rewarded = true; addXP(right * XP.correct, { lessonId: lesson.id }); } else save();
      markStep(lesson.id, "practice");
      panel.querySelector("#result").innerHTML = `<div class="result ${wrong ? "fail" : "pass"}"><b>${right} из ${items.length}</b>
        <span>${wrong ? "Разберите объяснения ошибок и переходите к Quiz." : "Отлично! Переходите к Quiz."}</span></div>`;
    });
  }

  function stepQuiz(panel, entry) {
    const { lesson, index } = entry;
    const qs = quizOf(lesson);
    const log = [];
    let i = 0, right = 0;

    const draw = () => {
      if (i >= qs.length) return finish();
      const q = qs[i];
      panel.innerHTML = `<div class="quiz-top"><span class="muted small">${i + 1} / ${qs.length}</span>
          <div class="progress"><span style="width:${pct(i, qs.length)}%"></span></div><span class="muted small">✓ ${right}</span></div>
        <div class="quiz-q">${esc(q.q)}</div>
        <div class="quiz-opts">${q.o.map((o, j) => `<button class="opt" data-j="${j}">${esc(o)}</button>`).join("")}</div>
        <div id="qexp"></div><div id="qnext" style="margin-top:14px"></div>`;
      panel.querySelectorAll(".opt").forEach(b => b.addEventListener("click", () => {
        if (panel.querySelector(".opt.correct")) return;
        const j = +b.dataset.j, ok = j === q.a;
        panel.querySelectorAll(".opt")[q.a].classList.add("correct");
        if (!ok) b.classList.add("wrong");
        if (ok) right++;
        log.push({ q, chosen: j, ok });
        panel.querySelector("#qexp").innerHTML = ok ? `<p class="feedback ok">Верно!</p>`
          : `<div class="explain-box"><b>Почему «${esc(q.o[q.a])}»?</b> ${esc(q.explain || explainOf(lesson, q))}</div>`;
        panel.querySelector("#qnext").innerHTML = `<button class="btn">${i + 1 < qs.length ? "Дальше →" : "Результат"}</button>`;
        panel.querySelector("#qnext button").addEventListener("click", () => { i++; draw(); });
      }));
    };

    const finish = () => {
      const score = pct(right, qs.length), passed = score >= PASS * 100;
      const first = !isDone(lesson.id);
      if (passed) {
        state.done[lesson.id] = Math.max(score, state.done[lesson.id] || 0);
        // SRS: слова и правило пройденного урока попадают в повторение
        const added = lesson.vocab.filter(([en, ru]) => addCard(en, ru, lesson.id)).length;
        const rule = addRuleCard(lesson);
        markStep(lesson.id, "quiz");
        addXP((first ? XP.lesson : 10) + (score === 100 ? XP.perfect : 0), { lessonId: lesson.id });
        if (added || rule) toast(`📚 В повторение: ${added} слов${rule ? " + правило" : ""}`);
      } else {
        state.weak[lesson.id] = (state.weak[lesson.id] || 0) + (qs.length - right); save();
      }
      const mistakes = log.filter(x => !x.ok);
      const next = LESSONS[index + 1];
      panel.innerHTML = `<div class="result ${passed ? "pass" : "fail"}">
        <div><b>${right} из ${qs.length} (${score}%)</b><br>${passed
          ? `Урок засчитан!${next ? " Следующий урок открыт." : ""} Слова и правило добавлены в интервальное повторение.`
          : `Для зачёта нужно ${PASS * 100}%. Разберите ошибки ниже и попробуйте снова.`}</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          ${passed ? `<a class="btn" href="#/lesson/${lesson.id}/output">Speaking / Writing →</a>` : `<a class="btn ghost" href="#/lesson/${lesson.id}/theory">К теории</a>`}
          <button class="btn ghost" id="retry">Пройти заново</button></div></div>
        ${mistakes.length ? `<h3 style="margin-top:20px">Разбор ошибок</h3><ul class="mistakes">${mistakes.map((m, k) => `
          <li><div><b>${esc(m.q.q)}</b></div>
            <div>Ваш ответ: <span class="bad-text">${esc(m.q.o[m.chosen])}</span> · правильно: <span class="ok-text">${esc(m.q.o[m.q.a])}</span></div>
            <div class="explain">💡 ${esc(m.q.explain || explainOf(lesson, m.q))}</div>
            <button class="link-btn" data-ask="${k}">Спросить ИИ-тьютора подробнее</button></li>`).join("")}</ul>` : ""}`;
      panel.querySelector("#retry").addEventListener("click", () => stepQuiz(panel, entry));
      panel.querySelectorAll("[data-ask]").forEach(b => b.addEventListener("click", () => {
        const m = mistakes[+b.dataset.ask];
        openAi();
        aiAsk(`Почему в «${m.q.q}» правильно «${m.q.o[m.q.a]}», а не «${m.q.o[m.chosen]}»?`, m.q.explain || explainOf(lesson, m.q));
      }));
    };
    draw();
  }

  /* Демо-проверка текста. В рабочей версии — POST /api/ai/check (OpenAI, рубрика CEFR) */
  function analyzeText(text, task, minWords) {
    const w = words(text), sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
    const used = task.target.filter(t => w.includes(norm(t)) || norm(text).includes(norm(t)));
    const freq = {}; w.filter(x => x.length > 3).forEach(x => freq[x] = (freq[x] || 0) + 1);
    const repeats = Object.entries(freq).filter(([, n]) => n >= 3).map(([x]) => x);
    const tips = [];
    tips.push(w.length >= minWords ? `✅ Объём: ${w.length} слов (минимум ${minWords}).` : `⚠️ Объём: ${w.length} из ${minWords} слов. Добавьте подробностей.`);
    if (task.target.length) tips.push(used.length >= Math.min(3, task.target.length) ? `✅ Целевые слова: ${used.join(", ")}.` : `⚠️ Используйте больше целевых слов: ${task.target.filter(t => !used.includes(t)).join(", ")}.`);
    const lower = sentences.filter(s => /^[a-z]/.test(s));
    if (lower.length) tips.push(`⚠️ Предложение с маленькой буквы: «${lower[0].slice(0, 40)}…»`);
    if (/\bi\b/.test(text)) tips.push("⚠️ Местоимение «I» всегда пишется с большой буквы.");
    if (repeats.length) tips.push(`💡 Повторы: ${repeats.join(", ")}. Попробуйте синонимы.`);
    if (/[а-яё]/i.test(text)) tips.push("⚠️ В тексте есть русские слова: замените их английскими.");
    tips.push("🤖 В рабочей версии ИИ проверит грамматику, лексику и связность по критериям CEFR и предложит исправленный вариант.");
    return { tips, ok: w.length >= minWords };
  }

  /* Отправка работы: ИИ (мгновенно) или преподаватель (очередь проверки) */
  function submitWork(entry, kind, text, to, minWords) {
    const task = taskOf(entry.lesson, entry.level);
    const sub = { id: Date.now(), lessonId: entry.lesson.id, kind, text, to, date: Date.now(), status: to === "ai" ? "ai_checked" : "pending" };
    if (to === "ai") sub.ai = analyzeText(text, task, minWords).tips;
    state.subs.unshift(sub);
    markStep(entry.lesson.id, "output");
    const key = `${entry.lesson.id}:${kind}`;
    state.taskXp = state.taskXp || {};
    if (!state.taskXp[key] && words(text).length >= minWords) { state.taskXp[key] = 1; state.tasks++; addXP(XP.task, { lessonId: entry.lesson.id }); }
    else { state.tasks = Math.max(state.tasks, 1); checkAchievements(); save(); }
    return sub;
  }

  function stepOutput(panel, entry) {
    const { lesson, level } = entry;
    const task = taskOf(lesson, level);
    let mode = "writing";
    const draw = () => {
      const minW = mode === "writing" ? task.minWords : Math.ceil(task.minWords / 2);
      panel.innerHTML = `<div class="subtabs">
          <button data-m="writing" class="${mode === "writing" ? "on" : ""}">✍️ Writing</button>
          <button data-m="speaking" class="${mode === "speaking" ? "on" : ""}">🗣 Speaking</button>
          <button data-m="shadowing" class="${mode === "shadowing" ? "on" : ""}">🔁 Shadowing</button></div>` +
        (mode === "shadowing" ? shadowingHtml(lesson) : `
        <div class="task-box"><b>Задание:</b> ${esc(mode === "writing" ? task.writing : task.speaking)}</div>
        <div class="chips" style="margin-bottom:10px">${task.target.map(t => `<span class="tchip" data-t="${esc(t)}">${esc(t)}</span>`).join("")}</div>` +
        (mode === "writing"
          ? `<textarea class="writing" id="txt" placeholder="Пишите здесь на английском…">${esc(state.drafts[lesson.id] || "")}</textarea>
             <div class="writing-bar"><span class="muted small" id="wc"></span></div>`
          : Recognition
            ? `<button class="btn" id="rec">🎙 Начать запись</button><div class="transcript" id="tr"><span class="muted">Здесь появится расшифровка вашей речи.</span></div>`
            : `<p class="muted">Распознавание речи доступно в Chrome и Edge. В рабочей версии запись отправляется на транскрибацию через OpenAI.</p>`) +
        `<div class="send-bar"><span class="muted small">Отправить на проверку:</span>
           <button class="btn" data-send="ai" disabled>🤖 ИИ (сразу)</button>
           <button class="btn ghost" data-send="teacher" disabled>👩‍🏫 Преподавателю</button></div>
         <div id="sendResult"></div>`);

      panel.querySelectorAll("[data-m]").forEach(b => b.addEventListener("click", () => { mode = b.dataset.m; draw(); }));
      if (mode === "shadowing") return bindShadowing(panel, lesson);

      const markUsed = text => panel.querySelectorAll(".tchip").forEach(c => c.classList.toggle("used", words(text).includes(norm(c.dataset.t)) || norm(text).includes(norm(c.dataset.t))));
      const sendBtns = panel.querySelectorAll("[data-send]");
      let text = "";
      const setText = t => { text = t; sendBtns.forEach(b => b.disabled = !text.trim()); markUsed(text); };

      if (mode === "writing") {
        const ta = panel.querySelector("#txt"), wc = panel.querySelector("#wc");
        const upd = () => { setText(ta.value); wc.textContent = `${words(text).length} / ${minW} слов`; state.drafts[lesson.id] = text; save(); };
        ta.addEventListener("input", upd); upd();
      } else if (Recognition) {
        const btn = panel.querySelector("#rec"), tr = panel.querySelector("#tr");
        let rec = null;
        btn.addEventListener("click", () => {
          if (rec) { rec.stop(); return; }
          btn.classList.add("rec-on"); btn.textContent = "■ Остановить";
          let base = text ? text + " " : "";
          rec = listen((t, final) => { tr.textContent = base + t; if (final) { base = base + t + " "; } markUsed(tr.textContent); },
            () => { rec = null; btn.classList.remove("rec-on"); btn.textContent = "🎙 Продолжить запись"; setText(tr.textContent); }, true);
        });
      }
      sendBtns.forEach(b => b.addEventListener("click", () => {
        if (words(text).length < minW && !confirm(`В ответе ${words(text).length} слов из рекомендуемых ${minW}. Всё равно отправить?`)) return;
        const sub = submitWork(entry, mode, text, b.dataset.send, minW);
        panel.querySelector("#sendResult").innerHTML = sub.to === "ai"
          ? `<ul class="feedback-list">${sub.ai.map(t => `<li>${esc(t)}</li>`).join("")}</ul>`
          : `<div class="result pass"><span>👩‍🏫 Работа отправлена преподавателю. Отзыв появится в разделе <a href="#/works">«Мои работы»</a>.</span></div>`;
        if (sub.to === "teacher") toast("Отправлено преподавателю");
      }));
    };
    draw();
  }

  function shadowingHtml(lesson) {
    const lines = shadowLines(lesson);
    return `<p class="muted small" style="margin-top:0">Shadowing: прослушайте фразу и сразу повторите вслух, копируя ритм и интонацию.
      ${Recognition ? "Нажмите 🎙, и браузер сравнит вашу речь с образцом." : "Распознавание речи доступно в Chrome и Edge."}</p>
      <div class="seg" id="rate">${[0.6, 0.8, 1].map(r => `<button data-r="${r}" class="${r === 0.8 ? "on" : ""}">${r}×</button>`).join("")}</div>
      <ul class="shadow-list">${lines.length ? lines.map((l, i) => `
        <li class="shadow-line"><span class="txt">${esc(l)}</span>
          <button class="btn ghost sm" data-play="${i}">▶ Слушать</button>
          ${Recognition ? `<button class="btn ghost sm" data-rec="${i}">🎙 Повторить</button>` : ""}
          <span class="res" id="sr${i}"></span></li>`).join("") : `<li class="muted">Для урока пока нет фраз.</li>`}</ul>`;
  }
  function bindShadowing(panel, lesson) {
    const lines = shadowLines(lesson);
    let rate = 0.8;
    panel.querySelector("#rate").addEventListener("click", e => {
      const b = e.target.closest("[data-r]"); if (!b) return;
      rate = +b.dataset.r; panel.querySelectorAll("#rate button").forEach(x => x.classList.toggle("on", x === b));
    });
    panel.querySelectorAll("[data-play]").forEach(p => p.addEventListener("click", () => speak(lines[+p.dataset.play], rate)));
    panel.querySelectorAll("[data-rec]").forEach(r => r.addEventListener("click", () => {
      const i = +r.dataset.rec, out = panel.querySelector(`#sr${i}`);
      r.classList.add("rec-on"); r.textContent = "● Запись…";
      let heard = "";
      listen(t => { heard = t; out.textContent = `Вы сказали: ${t}`; }, () => {
        r.classList.remove("rec-on"); r.textContent = "🎙 Повторить";
        if (!heard) { out.textContent = "Ничего не услышал, попробуйте ещё раз."; return; }
        const s = similarity(lines[i], heard);
        out.className = "res" + (s >= 80 ? " good" : "");
        out.textContent = `Вы сказали: «${heard}» · совпадение ${s}% ${s >= 80 ? "👍" : "· послушайте ещё раз"}`;
        if (s >= 80) addXP(XP.shadow, { lessonId: lesson.id });
      });
    }));
  }

  /* =====================================================================
     Мои работы и кабинет преподавателя (демо)
     В рабочей версии: таблица submissions, роль teacher, очередь проверки (SPEC §1.3, §8)
     ===================================================================== */
  const STATUS = { ai_checked: ["🤖 Проверено ИИ", "ok"], pending: ["⏳ У преподавателя", "wait"], reviewed: ["👩‍🏫 Проверено преподавателем", "ok"] };
  function subCard(s, teacherView) {
    const e = byId[s.lessonId];
    const [label, cls] = STATUS[s.status];
    return `<div class="card sub">
      <div class="sub-head"><b>${s.kind === "writing" ? "✍️ Writing" : "🗣 Speaking"} · ${e.level.code} · ${esc(e.lesson.title)}</b>
        <span class="status ${cls}">${label}</span></div>
      <div class="muted small">${fmtDate(s.date)}</div>
      <blockquote>${esc(s.text)}</blockquote>
      ${s.ai ? `<ul class="feedback-list">${s.ai.map(t => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}
      ${s.teacher ? `<div class="teacher-fb"><b>Оценка преподавателя: ${s.teacher.score} / 5</b><p>${esc(s.teacher.comment)}</p></div>` : ""}
      ${teacherView && s.status === "pending" ? `<div class="review-form" data-id="${s.id}">
        <textarea class="writing" style="min-height:90px" placeholder="Комментарий ученику: что хорошо, что исправить…"></textarea>
        <div class="send-bar"><label class="small">Оценка: <select>${[5, 4, 3, 2, 1].map(n => `<option>${n}</option>`).join("")}</select></label>
        <button class="btn">Отправить отзыв</button></div></div>` : ""}
    </div>`;
  }
  function renderWorks() {
    state.subs.forEach(s => { if (s.status === "reviewed") s.seen = true; });
    save(); updateTopbar();
    app.innerHTML = `<h1 class="page-title">Мои работы</h1>
      <p class="muted" style="margin-top:0">Тексты и записи из шага Speaking / Writing. ИИ проверяет сразу, преподаватель — в течение 24–48 часов (в рабочей версии).</p>
      ${state.subs.length ? state.subs.map(s => subCard(s, false)).join("") : `<div class="card"><p class="muted">Пока нет работ. Выполните шаг «Speaking / Writing» в любом уроке.</p></div>`}
      <p class="muted small" style="margin-top:16px">Демо: <a href="#/teacher">кабинет преподавателя</a>, где можно проверить отправленные работы.</p>`;
  }
  function renderTeacher() {
    const pending = state.subs.filter(s => s.status === "pending");
    app.innerHTML = `<h1 class="page-title">Кабинет преподавателя <span class="pill">демо</span></h1>
      <p class="muted" style="margin-top:0">В рабочей версии доступен только пользователям с ролью «преподаватель». Работы распределяются по очереди.</p>
      ${pending.length ? pending.map(s => subCard(s, true)).join("") : `<div class="card"><p class="muted">Нет работ на проверку.</p></div>`}`;
    app.querySelectorAll(".review-form").forEach(f => f.querySelector("button").addEventListener("click", () => {
      const s = state.subs.find(x => x.id === +f.dataset.id);
      const comment = f.querySelector("textarea").value.trim();
      if (!comment) { toast("Добавьте комментарий"); return; }
      s.status = "reviewed"; s.seen = false;
      s.teacher = { score: +f.querySelector("select").value, comment, date: Date.now() };
      save(); toast("Отзыв отправлен ученику"); renderTeacher(); updateTopbar();
    }));
  }

  /* =====================================================================
     Погружение: тексты с озвучкой и двойными субтитрами, медиатека по уровням
     ===================================================================== */
  function renderImmersion() {
    const cur = currentLevel();
    const typeName = { video: "🎬 Видео", channel: "📺 YouTube-каналы", podcast: "🎧 Подкасты", series: "🍿 Сериалы с субтитрами" };
    app.innerHTML = `<h1 class="page-title">Погружение</h1>
      <p class="muted" style="margin-top:0">Как можно больше понятного английского чуть выше вашего уровня (${cur.code}). 15 минут в день к основному курсу.</p>
      <h2 class="section-title">📖 Тексты с озвучкой и субтитрами</h2>
      <div class="dash-grid">${STORIES.map(s => `
        <a class="card dash-card story-card" href="#/story/${s.id}" ${lvlStyle(levelById[s.level])}>
          <span class="badge sm">${s.level.toUpperCase()}</span>
          <h3>${esc(s.title)} ${state.stories[s.id] ? "✅" : ""}</h3>
          <p>${s.lines.length} предложений · ≈ ${s.minutes} мин · клик по слову — перевод и в словарь</p></a>`).join("")}</div>
      ${["video", "podcast", "series", "channel"].map(t => `
        <h2 class="section-title">${typeName[t]}</h2>
        <div class="media-grid">${MEDIA.filter(m => m.type === t).map(m => `
          <div class="card media">
            ${m.yt ? `<div class="video-wrap"><iframe src="https://www.youtube-nocookie.com/embed/${m.yt}?rel=0&cc_load_policy=1" title="${esc(m.title)}"
              allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>` : ""}
            <div class="media-head"><b>${esc(m.title)}</b><span class="lvl-tag">${m.levels}</span></div>
            <div class="muted small">${esc(m.source)}</div>
            <p class="small">${esc(m.note)}</p>
            ${m.url ? `<a class="btn ghost sm" href="${m.url}" target="_blank" rel="noopener">Открыть ↗</a>` : ""}
          </div>`).join("")}</div>`).join("")}
      <div class="card method-card"><b>Как смотреть сериалы с пользой</b>
        <ol><li>Первый просмотр с английскими субтитрами (на A2–B1 можно двойные EN + RU).</li>
          <li>Выпишите 5 фраз из серии в словарь: они уйдут в интервальное повторение.</li>
          <li>Повторите 2–3 реплики вслух за героем (shadowing).</li>
          <li>На B2+ пересматривайте любимые эпизоды без субтитров.</li></ol></div>`;
  }

  function renderStory(story) {
    const level = levelById[story.level];
    let mode = "both", rate = 0.85, playing = false;
    const gloss = Object.keys(story.glossary).sort((a, b) => b.length - a.length);
    const markup = sentence => {
      let html = esc(sentence); const slots = [];
      gloss.forEach(g => {
        const re = new RegExp(`\\b(${g.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})\\b`, "i");
        html = html.replace(re, m => { slots.push(`<button class="gloss" data-g="${esc(g)}">${m}</button>`); return `\u0000${slots.length - 1}\u0000`; });
      });
      return html.replace(/\u0000(\d+)\u0000/g, (_, k) => slots[+k]);
    };
    app.innerHTML = `<nav class="crumbs"><a href="#/immersion">Погружение</a> / <span>${esc(story.title)}</span></nav>
      <h1 class="page-title" style="margin-top:8px">${esc(story.title)} <span class="badge sm" ${lvlStyle(level)}>${level.code}</span></h1>
      <div class="story-controls">
        <button class="btn" id="playAll">▶ Слушать всё</button>
        <div class="seg" id="rate">${[0.7, 0.85, 1].map(r => `<button data-r="${r}" class="${r === rate ? "on" : ""}">${r}×</button>`).join("")}</div>
        <div class="seg" id="subs"><button data-s="both" class="on">EN + RU</button><button data-s="en">Только EN</button><button data-s="audio">Только аудио</button></div>
      </div>
      <div class="card story subs-both" id="story">${story.lines.map(([en, ru], i) => `
        <div class="story-line" data-i="${i}"><button class="icon-btn" data-play="${i}" title="Озвучить">▶</button>
          <div><div class="en">${markup(en)}</div><div class="ru">${esc(ru)}</div><div class="gloss-info"></div></div></div>`).join("")}</div>
      <p class="method-note">Выделенные слова кликабельны: перевод, транскрипция и добавление в словарь. Так в рабочей версии работают и субтитры к видео и сериалам.</p>
      <button class="btn ghost" id="finishStory">Я прочитал(а) и прослушал(а)</button>`;

    const box = app.querySelector("#story");
    const highlight = i => box.querySelectorAll(".story-line").forEach(l => l.classList.toggle("now", +l.dataset.i === i));
    const playFrom = i => {
      if (i >= story.lines.length || !playing) { playing = false; highlight(-1); app.querySelector("#playAll").textContent = "▶ Слушать всё"; return; }
      highlight(i); speak(story.lines[i][0], rate, () => playFrom(i + 1));
    };
    app.querySelector("#playAll").addEventListener("click", e => {
      playing = !playing;
      e.target.textContent = playing ? "■ Стоп" : "▶ Слушать всё";
      if (playing) playFrom(0); else { speechSynthesis.cancel(); highlight(-1); }
    });
    app.querySelector("#rate").addEventListener("click", e => {
      const b = e.target.closest("[data-r]"); if (!b) return;
      rate = +b.dataset.r; app.querySelectorAll("#rate button").forEach(x => x.classList.toggle("on", x === b));
    });
    app.querySelector("#subs").addEventListener("click", e => {
      const b = e.target.closest("[data-s]"); if (!b) return;
      mode = b.dataset.s; box.className = `card story subs-${mode}`;
      app.querySelectorAll("#subs button").forEach(x => x.classList.toggle("on", x === b));
    });
    box.addEventListener("click", e => {
      const p = e.target.closest("[data-play]");
      if (p) { playing = false; highlight(+p.dataset.play); speak(story.lines[+p.dataset.play][0], rate); return; }
      const g = e.target.closest(".gloss");
      if (g) {
        const key = g.dataset.g, ru = story.glossary[key];
        const info = g.closest(".story-line").querySelector(".gloss-info");
        info.innerHTML = `<b>${esc(key)}</b> ${IPA[key] ? `<span class="ipa">/${esc(IPA[key])}/</span>` : ""} — ${esc(ru)}
          <button class="icon-btn" data-say="${esc(key)}">🔊</button>
          <button class="btn ghost sm" data-addg="${esc(key)}">${state.cards[key] ? "✓ в словаре" : "+ в словарь"}</button>`;
        return;
      }
      const s = e.target.closest("[data-say]"); if (s) speak(s.dataset.say);
      const a = e.target.closest("[data-addg]");
      if (a && addCard(a.dataset.addg, story.glossary[a.dataset.addg], null)) { a.textContent = "✓ в словаре"; checkAchievements(); save(); updateTopbar(); }
    });
    app.querySelector("#finishStory").addEventListener("click", () => {
      if (state.stories[story.id]) { toast("Уже засчитано"); return; }
      state.stories[story.id] = today(); addXP(XP.story);
    });
  }

  /* =====================================================================
     Словарь и повторение (SRS): слова и правила
     ===================================================================== */
  function renderDictionary(tab = "words") {
    const all = Object.entries(state.cards).sort((a, b) => a[1].due - b[1].due);
    const list = all.filter(([, c]) => (tab === "rules") === (c.type === "rule"));
    const due = dueCards().length;
    const nRules = all.filter(([, c]) => c.type === "rule").length;
    app.innerHTML = `<h1 class="page-title">Мой словарь</h1>
      <p class="muted" style="margin-top:0">Интервальное повторение (SM-2) слов и грамматических правил: чем лучше вы помните, тем реже карточка появляется.</p>
      <div class="card" style="margin:16px 0;display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap">
        <div><b>${all.length - nRules}</b> слов · <b>${nRules}</b> правил · <b>${due}</b> к повторению сейчас</div>
        <a class="btn ${due ? "" : "ghost"}" href="#/review">${due ? "Начать повторение" : "Нечего повторять"}</a>
      </div>
      <div class="subtabs"><a href="#/dictionary/words" class="${tab !== "rules" ? "on" : ""}">Слова</a><a href="#/dictionary/rules" class="${tab === "rules" ? "on" : ""}">Правила</a></div>
      <div class="card">
        ${tab !== "rules" ? `<form class="add-word" id="addWord"><input id="nwEn" placeholder="Слово (English)" required><input id="nwRu" placeholder="Перевод" required>
          <button class="btn">Добавить</button></form>` : ""}
        ${list.length ? `<div class="dict-wrap"><table class="dict-table"><thead><tr><th>${tab === "rules" ? "Урок" : "Слово"}</th><th>${tab === "rules" ? "Задание" : "Перевод"}</th><th>Повтор</th><th>Интервал</th><th></th></tr></thead><tbody>
          ${list.map(([key, c]) => c.type === "rule"
            ? `<tr><td>📐 ${esc(c.title)}</td><td>${esc(c.front)}</td><td>${inDays(c.due)}</td><td>${c.interval} дн.</td><td><button class="icon-btn" data-del="${esc(key)}" title="Удалить">✕</button></td></tr>`
            : `<tr><td><button class="icon-btn" data-say="${esc(key)}">🔊</button> ${esc(key)} ${IPA[key] ? `<span class="ipa">/${esc(IPA[key])}/</span>` : ""}</td><td>${esc(c.ru)}</td>
              <td>${inDays(c.due)}</td><td>${c.interval} дн.</td><td><button class="icon-btn" data-del="${esc(key)}" title="Удалить">✕</button></td></tr>`).join("")}
          </tbody></table></div>`
        : `<p class="muted">${tab === "rules" ? "Правила появятся здесь после сдачи Quiz урока." : "Словарь пуст. Добавляйте слова на шаге «Лексика» или в «Погружении». После Quiz слова урока попадают сюда автоматически."}</p>`}
      </div>`;
    const form = app.querySelector("#addWord");
    if (form) form.addEventListener("submit", e => {
      e.preventDefault();
      const en = app.querySelector("#nwEn").value.trim(), ru = app.querySelector("#nwRu").value.trim();
      if (en && ru) { addCard(en, ru, null); checkAchievements(); save(); renderDictionary(tab); updateTopbar(); }
    });
    app.querySelectorAll("[data-say]").forEach(b => b.addEventListener("click", () => speak(b.dataset.say)));
    app.querySelectorAll("[data-del]").forEach(b => b.addEventListener("click", () => { delete state.cards[b.dataset.del]; save(); renderDictionary(tab); updateTopbar(); }));
  }

  function renderReview() {
    const queue = shuffle(dueCards().map(([k]) => k));   // слова и правила вперемешку (интерливинг)
    let done = 0;
    const draw = shown => {
      if (!queue.length) {
        app.innerHTML = `<h1 class="page-title">Повторение</h1><div class="card review-card"><div class="front">🎉</div>
          <p>${done ? `Повторено карточек: ${done}. Следующие появятся по расписанию.` : "Сейчас нечего повторять."}</p>
          <a class="btn" href="#/">В кабинет</a> <a class="btn ghost" href="#/dictionary">Словарь</a></div>`;
        updateTopbar(); return;
      }
      const key = queue[0], c = state.cards[key], rule = c.type === "rule";
      app.innerHTML = `<h1 class="page-title">Повторение</h1><p class="muted" style="margin-top:0">Осталось: ${queue.length}</p>
        <div class="card review-card">
          ${rule ? `<div class="muted small">📐 Правило · ${esc(c.title)}</div><div class="front rule">${esc(c.front)}</div>`
                 : `<div class="front">${esc(key)} <button class="icon-btn" id="say">🔊</button></div>${IPA[key] ? `<div class="ipa">/${esc(IPA[key])}/</div>` : ""}`}
          ${shown ? `<div class="back">${esc(rule ? c.back : c.ru)}</div>${rule ? `<p class="explain">💡 ${esc(c.rule)}</p>` : ""}
            <div class="grade">
              <button class="again" data-q="1">Снова<small>${previewInterval(c, 1)}</small></button>
              <button data-q="3">Трудно<small>${previewInterval(c, 3)}</small></button>
              <button data-q="4">Хорошо<small>${previewInterval(c, 4)}</small></button>
              <button class="easy" data-q="5">Легко<small>${previewInterval(c, 5)}</small></button></div>`
          : `<p class="muted">${rule ? "Вспомните ответ и правило." : "Вспомните перевод."}</p><button class="btn" id="show">Показать ответ</button>`}</div>`;
      const sayBtn = app.querySelector("#say"); if (sayBtn) sayBtn.addEventListener("click", () => speak(key));
      if (!shown) { app.querySelector("#show").addEventListener("click", () => draw(true)); return; }
      app.querySelectorAll("[data-q]").forEach(b => b.addEventListener("click", () => {
        const q = +b.dataset.q;
        state.cards[key] = sm2(c, q);
        queue.shift();
        if (q < 3) queue.push(key); else done++;
        addXP(XP.review, { silent: true });
        draw(false);
      }));
    };
    draw(false);
  }

  /* =====================================================================
     Входной тест
     ===================================================================== */
  function placementResult(answers) {
    const order = ["a1", "a2", "b1", "b2", "c1", "c2"];
    for (const lvl of order) {
      const qs = PLACEMENT.map((q, i) => ({ q, i })).filter(x => x.q.lvl === lvl);
      const ok = qs.filter(x => answers[x.i] === x.q.a).length;
      if (ok === qs.length) continue;
      if (ok > 0) return lvl;                                        // частично знает — начинаем с этого уровня
      return lvl === "a1" ? "a0" : order[order.indexOf(lvl) - 1];   // не знает — закрепляем предыдущий
    }
    return "c2";
  }
  function renderPlacement() {
    const answers = PLACEMENT.map(() => null);
    app.innerHTML = `<h1 class="page-title">Входной тест</h1>
      <p class="muted" style="margin-top:0">12 вопросов от A1 до C2. Если не знаете ответа, пропустите вопрос: так результат будет точнее.</p>
      <div class="card">${PLACEMENT.map((q, i) => `<div class="exercise"><div class="q"><span class="n">${i + 1}.</span>${esc(q.q)}</div>
        <div class="options">${q.o.map((o, j) => `<button class="opt" data-i="${i}" data-j="${j}">${esc(o)}</button>`).join("")}</div></div>`).join("")}
        <button class="btn" id="finish" style="margin-top:12px">Узнать уровень</button><div id="presult"></div></div>`;
    app.querySelectorAll(".opt").forEach(b => b.addEventListener("click", () => {
      const i = +b.dataset.i;
      app.querySelectorAll(`.opt[data-i="${i}"]`).forEach(x => x.classList.remove("selected"));
      b.classList.add("selected"); answers[i] = +b.dataset.j;
    }));
    app.querySelector("#finish").addEventListener("click", () => {
      const lvl = placementResult(answers), level = levelById[lvl];
      const right = PLACEMENT.filter((q, i) => answers[i] === q.a).length;
      app.querySelector("#presult").innerHTML = `<div class="result pass"><div><b>Рекомендуемый уровень: ${level.code} ${level.name}</b><br>
        Правильных ответов: ${right} из ${PLACEMENT.length}. Уроки до этого уровня останутся доступны для повторения.</div>
        <button class="btn" id="startLvl">Начать с ${level.code} →</button></div>`;
      app.querySelector("#startLvl").addEventListener("click", () => {
        state.placement = { level: lvl, score: right, date: today() };
        state.unlockFrom = Math.max(state.unlockFrom, firstIndexOf(lvl));
        save(); location.hash = `#/level/${lvl}`;
      });
    });
  }

  /* =====================================================================
     ИИ-тьютор (демо). В рабочей версии — POST /api/ai/tutor с контекстом урока (SPEC §8)
     ===================================================================== */
  let aiContext = null;
  const drawer = document.getElementById("aiDrawer"), log = document.getElementById("aiLog");
  function aiSay(text, who = "ai", extra = "") {
    const m = document.createElement("div");
    m.className = "msg " + who; m.textContent = text;
    if (extra) { const p = document.createElement("pre"); p.textContent = extra; m.appendChild(p); }
    log.appendChild(m); log.scrollTop = log.scrollHeight;
  }
  function openAi() {
    drawer.classList.add("open"); drawer.setAttribute("aria-hidden", "false");
    if (!log.children.length) aiSay("Привет! Я ИИ-тьютор. Объясняю правила, даю примеры, разбираю ошибки и подсказываю, что повторить. В этом прототипе ответы демонстрационные.");
  }
  // вопрос с заранее известным объяснением (разбор ошибки quiz)
  function aiAsk(question, explanation) {
    aiSay(question, "user");
    setTimeout(() => aiSay(`${explanation}\n\nВ рабочей версии я разберу именно ваш ответ, приведу ещё 2–3 примера и предложу похожее задание для закрепления.`), 350);
  }
  function updateAiContext() {
    const ctx = document.getElementById("aiContext"), quick = document.getElementById("aiQuick");
    ctx.textContent = aiContext ? `Контекст: ${aiContext.level.code} · ${aiContext.lesson.title}` : "Контекст: весь курс";
    const btns = aiContext ? ["Объясни правило проще", "Дай ещё примеры", "Какие типичные ошибки?", "Проверь моё предложение"] : ["Что повторить сегодня?", "Как учиться эффективнее?"];
    quick.innerHTML = btns.map(b => `<button>${b}</button>`).join("");
  }
  function aiAnswer(q) {
    aiSay(q, "user");
    const e = aiContext, lq = q.toLowerCase();
    const payload = JSON.stringify({ level: e ? e.level.code : null, lessonId: e ? e.lesson.id : null, goal: e ? e.lesson.goal : null,
      weakLessons: Object.keys(state.weak).slice(0, 3), message: q }, null, 2);
    setTimeout(() => {
      if (e && lq.includes("проще")) {
        const first = stripTags(e.lesson.theory).split(/(?<=[.!?])\s/)[0];
        aiSay(`Коротко: ${e.lesson.goal}\n\n${first}\n\nЗапомните один пример и стройте свои предложения по нему: «${shadowLines(e.lesson)[0] || e.lesson.vocab[0][0]}».`);
      } else if (e && lq.includes("пример")) {
        const lines = shuffle(shadowLines(e.lesson)).slice(0, 3);
        aiSay(lines.length ? "Примеры из урока:\n• " + lines.join("\n• ") + "\n\nВ рабочей версии ИИ сгенерирует новые примеры на ваших интересах." : "Для этого урока примеров пока нет.");
      } else if (e && lq.includes("ошибк")) {
        const tip = lessonTip(e.lesson);
        aiSay(tip ? `Главная ловушка урока: ${tip}` : "Типичные ошибки по этой теме добавит методист. В рабочей версии ИИ анализирует ваши ответы и называет ваши личные ошибки.");
      } else if (lq.includes("повторить")) {
        const r = recommendation(); aiSay(`${r.title}. ${r.text}`);
      } else if (lq.includes("эффективн")) {
        aiSay("Совет: 15 минут каждый день лучше, чем 2 часа раз в неделю. Начните с повторения карточек (SRS), затем один шаг урока, а вечером 10 минут погружения: текст, подкаст или серия с субтитрами.");
      } else {
        aiSay("В прототипе ИИ не подключён, поэтому свободные вопросы он не обрабатывает. В рабочей версии этот запрос уйдёт на сервер с контекстом урока:", "ai", `POST /api/ai/tutor\n${payload}`);
      }
    }, 350);
  }
  document.getElementById("aiOpen").addEventListener("click", openAi);
  document.getElementById("aiClose").addEventListener("click", () => { drawer.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); });
  document.getElementById("aiQuick").addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    if (b.textContent.startsWith("Проверь")) { const inp = document.getElementById("aiInput"); inp.value = "Проверь: "; inp.focus(); return; }
    aiAnswer(b.textContent);
  });
  document.getElementById("aiForm").addEventListener("submit", e => {
    e.preventDefault();
    const inp = document.getElementById("aiInput"), v = inp.value.trim(); if (!v) return;
    inp.value = "";
    if (/^проверь:/i.test(v)) {
      aiSay(v, "user");
      const r = analyzeText(v.replace(/^проверь:\s*/i, ""), { target: [] }, 1);
      setTimeout(() => aiSay(r.tips.filter(t => !t.startsWith("✅ Объём")).join("\n")), 300);
    } else aiAnswer(v);
  });

  /* =====================================================================
     Глобальные контролы
     ===================================================================== */
  const free = document.getElementById("freeMode");
  free.checked = !!state.free;
  free.addEventListener("change", () => { state.free = free.checked; save(); route(); });
  document.getElementById("resetProgress").addEventListener("click", () => {
    if (confirm("Сбросить весь прогресс, словарь, работы и достижения?")) { state = defaults(); save(); free.checked = false; route(); }
  });

  window.addEventListener("hashchange", route);
  route();
})();
