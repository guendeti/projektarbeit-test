const menu = document.querySelector<HTMLButtonElement>('.menu-toggle');
menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  document.querySelector('.sidebar')?.classList.toggle('is-open', open);
});
document.addEventListener('keydown', event => { if (event.key === 'Escape') { menu?.setAttribute('aria-expanded', 'false'); document.querySelector('.sidebar')?.classList.remove('is-open'); } });
const dialog = document.querySelector<HTMLDialogElement>('#search-dialog');
const input = document.querySelector<HTMLInputElement>('#site-search');
// Explicitly close on the first Escape; search inputs may consume the native key.
dialog?.addEventListener('keydown', event => { if (event.key === 'Escape') { event.preventDefault(); dialog.close(); } });
document.querySelector('[data-open-search]')?.addEventListener('click', () => { dialog?.showModal(); input?.focus(); });
document.querySelector('[data-close-search]')?.addEventListener('click', () => dialog?.close());
dialog?.addEventListener('click', event => { if (event.target === dialog) { const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close(); } });
document.addEventListener('keydown', event => { if (event.key === '/' && !(event.target instanceof HTMLInputElement) && !(event.target instanceof HTMLTextAreaElement)) { event.preventDefault(); dialog?.showModal(); input?.focus(); } });
const aliases: Record<string, string> = { 'dependency inversion': 'clean hexagonal onion', 'ports': 'hexagonal', 'adapter': 'hexagonal clean', 'datenbank': 'layered', 'deployment': 'monolith microservices', 'schichten': 'layered onion' };
input?.addEventListener('input', () => {
  const query = input.value.toLocaleLowerCase('de').trim();
  let count = 0;
  document.querySelectorAll<HTMLElement>('[data-search-text]').forEach(item => {
    const text = item.dataset.searchText!.toLowerCase();
    const matches = text.includes(query) || (aliases[query]?.split(' ').some(term => text.includes(term)) ?? false);
    item.hidden = !matches; if (matches) count++;
  });
  document.querySelector<HTMLElement>('.empty-search')!.hidden = count > 0;
});
let read: string[] = [];
try { read = JSON.parse(localStorage.getItem('atelier-read') || '[]'); if (!Array.isArray(read)) read = []; read = [...new Set(read.filter(slug => typeof slug === 'string' && document.querySelector(`[data-read-dot="${CSS.escape(slug)}"]`)))]; } catch { read = []; }
const mark = document.querySelector<HTMLButtonElement>('[data-mark-read]');
function updateProgress() {
  document.querySelectorAll<HTMLElement>('[data-read-dot]').forEach(dot => dot.classList.toggle('done', read.includes(dot.dataset.readDot!)));
  const progress = document.querySelector<HTMLProgressElement>('[data-progress]');
  if (progress) progress.value = read.length;
  const label = document.querySelector('[data-progress-label]'); if (label) label.textContent = `${read.length} / 13`;
  if (mark) { const done = read.includes(mark.dataset.markRead!); mark.textContent = done ? '✓ Als gelesen markiert' : 'Kapitel als gelesen markieren'; mark.setAttribute('aria-pressed', String(done)); }
}
mark?.addEventListener('click', () => { const slug = mark.dataset.markRead!; read = read.includes(slug) ? read.filter(s => s !== slug) : [...read, slug]; try { localStorage.setItem('atelier-read', JSON.stringify(read)); } catch {} updateProgress(); });
updateProgress();
document.querySelectorAll<HTMLButtonElement>('[data-quiz-answer]').forEach(button => button.addEventListener('click', () => {
  const quiz = button.closest<HTMLElement>('[data-quiz]')!;
  const correct = button.dataset.quizAnswer === quiz.dataset.correct;
  quiz.querySelectorAll('button').forEach(b => { b.classList.remove('correct', 'incorrect'); b.setAttribute('aria-pressed', 'false'); });
  button.classList.add(correct ? 'correct' : 'incorrect'); button.setAttribute('aria-pressed', 'true');
  const feedback = quiz.querySelector<HTMLElement>('[data-quiz-feedback]')!;
  feedback.hidden = false; feedback.textContent = correct ? `Richtig! ${quiz.dataset.explanation}` : 'Noch nicht ganz. Überlege, welche Grenze oder Abhängigkeit sich tatsächlich verändert. Du kannst es erneut versuchen.';
}));
document.querySelectorAll('pre').forEach(pre => {
  pre.tabIndex = 0;
  if (!pre.querySelector('code')) return;
  const button = document.createElement('button'); button.className = 'copy-code'; button.textContent = 'Kopieren'; button.setAttribute('aria-label', 'Code kopieren');
  button.addEventListener('click', async () => { try { await navigator.clipboard.writeText(pre.querySelector('code')!.textContent || ''); button.textContent = 'Kopiert ✓'; } catch { button.textContent = 'Bitte manuell kopieren'; } });
  pre.append(button);
});
document.querySelectorAll<HTMLTableElement>('.prose table').forEach(table => {
  table.tabIndex = 0;
  table.setAttribute('aria-label', table.caption?.textContent || 'Vergleichstabelle, bei Bedarf seitlich scrollen');
});
