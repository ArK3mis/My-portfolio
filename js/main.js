const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const wait = ms => new Promise(r => setTimeout(r, ms));
const EASE = 'cubic-bezier(.5,0,.2,1)', NAME = 'KENZO ELIJAH BUAN';
let addStar;
const STARS = false; // true brings the star field (and the cursor → star ending) back

/* ---- stars: twinkling, drifting right → left (cursors join them at the end) ---- */
(() => {
  if (!STARS) { $('#stars').style.display = 'none'; addStar = () => {}; return; }
  const cv = $('#stars'), x = cv.getContext('2d'); let W, H, S;
  const size = () => { W = cv.width = innerWidth; H = cv.height = innerHeight;
    S = Array.from({ length: W * H / 4500 | 0 }, () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.3 + .2, p: Math.random() * 6, s: Math.random() * .02 + .005, v: Math.random() * .15 + .02 })); };
  size(); addEventListener('resize', size);
  addStar = (px, py) => S.push({ x: px, y: py, r: 1.5, p: Math.random() * 6, s: .015, v: .05 });
  (function loop() { x.clearRect(0, 0, W, H);
    for (const s of S) { s.p += s.s; s.x -= s.v; if (s.x < 0) s.x = W;
      x.globalAlpha = .35 + .65 * Math.abs(Math.sin(s.p)); x.fillStyle = s.r > 1 ? '#bfe0ff' : '#fff';
      x.beginPath(); x.arc(s.x, s.y, s.r, 0, 7); x.fill(); }
    requestAnimationFrame(loop); })();
})();

/* ---- the scrolling name sign: 4 copies side by side ---- */
const track = $('.track');
for (let i = 0; i < 4; i++) {
  const s = document.createElement('div'); s.className = 'set';
  s.innerHTML = '<span class="name">' + [...NAME].map(c => c === ' ' ? '<i class="sp"></i>' : `<span class="ch" data-c="${c}">${c}</span>`).join('') + '</span><span class="dot">✦</span>';
  track.append(s);
}
const sets = $$('.set'), nameEl = sets[1].querySelector('.name');
const fit = () => { const r = document.documentElement.style; r.setProperty('--fs', '100px');
  r.setProperty('--fs', Math.min(100 * innerWidth * (innerWidth < 800 ? .9 : .62) / nameEl.getBoundingClientRect().width, innerHeight * .24) + 'px'); };

/* ---- headings (.bt) become letters a cursor can draw ---- */
$$('.bt').forEach(el => {
  const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), nodes = []; while (w.nextNode()) nodes.push(w.currentNode);
  nodes.forEach(n => { const f = document.createDocumentFragment();
    n.textContent.split(/(\s+)/).forEach(t => { if (!t) return;
      if (/^\s+$/.test(t)) f.append(' ');
      else { const wd = document.createElement('span'); wd.className = 'w'; wd.innerHTML = [...t].map(c => `<span class="ch" data-c="${c}">${c}</span>`).join(''); f.append(wd); } });
    n.replaceWith(f); });
});

/* ---- the swarm: 12 small cursors ---- */
const mv = (c, x, y, d = .7) => { c.style.transitionDuration = d + 's'; c.style.transform = `translate(${x}px,${y}px)`; };
const cols = ['#3b82f6', '#38bdf8', '#a5b4fc', '#60a5fa', '#22d3ee', '#818cf8', '#93c5fd', '#3b82f6', '#7dd3fc', '#6366f1', '#38bdf8', '#a5b4fc'];
const C = cols.map((col, i) => { const c = document.createElement('div'); c.className = 'cursor'; c.style.setProperty('--c', col);
  c.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24"><path d="M3 2l17 8-7 2-3 8z" fill="${col}" stroke="#fff" stroke-width="1.5"/></svg>`;
  mv(c, i % 2 ? innerWidth + 40 : -40, innerHeight * (.1 + .07 * i), 0); document.body.append(c); return c; });
const job = async (c, fn) => { c.busy = true; await fn(); c.busy = false; };
const click = c => { c.classList.remove('click'); c.offsetWidth; c.classList.add('click'); };

/* drag a corner/edge to "resize" an element into existence */
async function dragIn(c, el, d = 1.1) {
  const r = el.getBoundingClientRect(), edge = el.classList.contains('x');
  mv(c, r.left, edge ? r.top + r.height / 2 : r.top, .4); await wait(450); click(c);
  el.style.transition = `clip-path ${d}s ${EASE}`; el.classList.add('in');
  mv(c, r.right, edge ? r.top + r.height / 2 : r.bottom, d); await wait(d * 1000 + 100);
  el.style.clipPath = 'none';
}
/* trace each letter bottom → top while it fills in */
async function type(c, chs) {
  for (const ch of chs) { const r = ch.getBoundingClientRect();
    mv(c, r.left + r.width * .15, r.bottom - r.height * .1, .2); await wait(220);
    ch.classList.add('on'); mv(c, r.left + r.width * .85, r.top + r.height * .15, .5); await wait(520); }
}
/* sweep down the ASCII portrait, printing it line by line */
async function scan(c, el) {
  const r = el.getBoundingClientRect(), n = 8, T = 2.8;
  mv(c, r.left, r.top, .4); await wait(450); click(c);
  el.style.transition = `clip-path ${T}s linear`; el.classList.add('in');
  for (let i = 0; i <= n; i++) { mv(c, i % 2 ? r.left : r.right, r.top + r.height * i / n, T / n); await wait(T * 1000 / n); }
  el.style.clipPath = 'none';
}

/* idle cursors wander around; busy ones are working */
let finished = false;
setInterval(() => C.forEach(c => { if (!c.busy && !finished) mv(c, innerWidth * (.05 + Math.random() * .9), innerHeight * (.1 + Math.random() * .75), 2.2); }), 2600);

/* when everything is built: shrink into tiny stars */
function finish() {
  finished = true;
  C.forEach((c, i) => { const x = innerWidth * (.04 + Math.random() * .92), y = innerHeight * (.05 + Math.random() * .9);
    c.classList.add('tiny'); mv(c, x, y, 2 + Math.random());
    setTimeout(() => { c.remove(); addStar(x + 1, y + 1); }, 3300 + i * 150); });
}
let todo = $$('[data-build]').length;
const maybeFinish = () => { if (todo === 0 && !finished) finish(); };

/* sections below the fold: built only once the visitor scrolls to them */
async function buildSection(sec) {
  const L = $$('.ch').filter(ch => sec.contains(ch)), D = [...sec.querySelectorAll('.drag')], jobs = [];
  const k = 3, sz = Math.ceil(L.length / k);
  for (let i = 0; i < k; i++) { const part = L.slice(i * sz, (i + 1) * sz); if (part.length) jobs.push(job(C[i], () => type(C[i], part))); }
  D.forEach((el, i) => { const c = C[3 + i]; jobs.push(job(c, async () => { await wait(900); await dragIn(c, el, .9); })); });
  await Promise.all(jobs);
}

/* ---- hero build, runs on load ---- */
let chain = (async () => {
  await document.fonts.load('100px Anton'); fit(); await wait(400);
  const W = sets[1].getBoundingClientRect().left - sets[0].getBoundingClientRect().left;
  let p = (innerWidth - nameEl.getBoundingClientRect().width) / 2 - W;   // centre the name
  track.style.transform = `translate3d(${p}px,0,0)`;

  // 1) foundation: nav + status card
  await Promise.all([
    job(C[1], async () => { await wait(200); await dragIn(C[1], $('.nav'), 1.1); }),
    job(C[9], async () => { await wait(600); await dragIn(C[9], $('.card.r'), .8); })]);

  track.classList.add('wire'); await wait(700);                          // 2) letters + ASCII portrait
  const L = [...sets[1].querySelectorAll('.ch')], sz = Math.ceil(L.length / 4);
  await Promise.all([0, 1, 2, 3].map(i => job(C[3 + i], () => type(C[3 + i], L.slice(i * sz, (i + 1) * sz)))).concat(
    job(C[7], async () => { await wait(300); await scan(C[7], $('.resume')); }),
    job(C[0], async () => { await wait(1500); await dragIn(C[0], $('.quote'), 1.4); })));

  $$('.sign .ch').forEach(ch => ch.classList.add('on'));                  // 3) lights on, sign scrolls
  document.body.classList.add('lit');
  let t0 = performance.now();
  requestAnimationFrame(function tick(t) { p -= (t - t0) / 1000 * 110; t0 = t; if (p <= -2 * W) p += W;
    track.style.transform = `translate3d(${p}px,0,0)`; requestAnimationFrame(tick); });
})();

const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return; io.unobserve(e.target);
  chain = chain.then(() => buildSection(e.target)).then(() => { todo--; maybeFinish(); });
}), { threshold: .25 });
$$('[data-build]').forEach(s => io.observe(s));

/* ---- dark / light mode (remembered in the browser) ---- */
const root = document.documentElement, modeBtn = $('#mode');
function setTheme(t) { root.dataset.theme = t; modeBtn.textContent = t === 'light' ? '☾' : '☀'; try { localStorage.setItem('theme', t); } catch {} }
window.toggleTheme = () => { setTheme(root.dataset.theme === 'light' ? 'dark' : 'light'); return root.dataset.theme; };
let savedTheme = null; try { savedTheme = localStorage.getItem('theme'); } catch {}
setTheme(savedTheme || 'dark');
modeBtn.addEventListener('click', window.toggleTheme);
