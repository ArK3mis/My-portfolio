/* Interactive terminal. Edit ME to put your real info in. */
const ME = {
  name: 'Kenzo Elijah Buan',
  title: 'Developer & designer',
  location: 'Philippines',
  skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Vite', 'TypeScript'],          // add yours
  projects: [['Baryalytics', 'Business management dashboard for Philippine retail (React · Vite · TypeScript)']],
  contact: { email: 'you@example.com', github: 'WIP', linkedin: 'WIP' },
};

(() => {
  const out = document.getElementById('out'), input = document.getElementById('cmd'), term = document.getElementById('term');
  if (!out || !input) return;
  const hist = []; let hi = 0;
  const print = (t = '', cls = '') => { const d = document.createElement('div'); d.className = 'ln ' + cls; d.textContent = t; out.append(d); out.scrollTop = out.scrollHeight; };

  const cmds = {
    help: () => ['Commands:', '  about      who I am', '  skills     what I work with', '  projects   things I built', '  contact    how to reach me',
      '  buan       what my name means', '  experience, education, certifications, achievements, resume  (WIP)', '  theme      switch dark / light mode', '  clear      clean the screen', '  date, echo <text>, ls'],
    about: () => [`${ME.name} — ${ME.title}`, `Based in the ${ME.location}.`, 'Full bio: WIP'],
    whoami: () => ['a curious visitor ✦'],
    ls: () => ['about  skills  projects  contact  buan'],
    skills: () => [ME.skills.join('  ·  ')],
    projects: () => ME.projects.map(([n, d], i) => `${i + 1}. ${n} — ${d}`).concat('more: WIP'),
    contact: () => [`email     ${ME.contact.email}`, `github    ${ME.contact.github}`, `linkedin  ${ME.contact.linkedin}`],
    buan: () => ['"Buan" sounds like "buwan", the Tagalog word for moon (and month).', 'Hence the space theme ✦'],
    date: () => [new Date().toString()],
    echo: a => [a.join(' ')],
    theme: () => ['switched to ' + window.toggleTheme() + ' mode'],
    clear: () => { out.textContent = ''; return []; },
    sudo: a => a.join(' ') === 'hire kenzo' ? ['Permission granted. Now send an email ✦'] : ['nice try. you are not in the sudoers file. this incident will be reported.'],
  };
  ['experience', 'education', 'certifications', 'achievements', 'resume'].forEach(k => cmds[k] = () => [k + ': WIP']);

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const raw = input.value.trim(); input.value = ''; print('❯ ' + raw, 'cmd'); if (!raw) return;
      hist.push(raw); hi = hist.length;
      const [c, ...a] = raw.split(/\s+/), k = c.toLowerCase();
      if (Object.hasOwn(cmds, k)) cmds[k](a).forEach(l => print(l)); else print(`command not found: ${c} — try 'help'`, 'err');
    } else if (e.key === 'ArrowUp' && hist.length) { hi = Math.max(0, hi - 1); input.value = hist[hi]; e.preventDefault(); }
    else if (e.key === 'ArrowDown') { hi = Math.min(hist.length, hi + 1); input.value = hist[hi] || ''; e.preventDefault(); }
    else if (e.key === 'Tab') { const m = Object.keys(cmds).filter(k => k.startsWith(input.value.toLowerCase())); if (m.length === 1) input.value = m[0]; e.preventDefault(); }
  });
  term.addEventListener('click', () => input.focus());
  print("Welcome. Type 'help' to see what I can do.");
})();
