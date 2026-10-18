import { architectures } from '../data/explorer';
import type { Architecture, Edge, GraphNode, View } from '../data/explorer';
import { url } from '../data/site';
import { todayISO } from '../../examples/domain.ts';
import type { Trace, VisitCommand } from '../../examples/domain.ts';
import { MemoryOwnerStore } from '../../examples/memory.ts';
import { MemoryOwnerGateway, MemoryOwnerAdapter, MemoryOwnerRepository } from '../../examples/adapters.ts';
import { bookLayered } from '../../examples/layered.ts';
import { bookClean } from '../../examples/clean.ts';
import { bookHexagonal } from '../../examples/hexagonal.ts';
import { bookOnion } from '../../examples/onion.ts';

let architecture: Architecture = 'layered';
let view: View = 'runtime';
let selected = 'service';
let generation = 0;
const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const graph = document.querySelector<SVGGElement>('#graph-content')!;
const escape = (text: string) => text.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);
const outerNodes: GraphNode[] = [
  { id: 'user', label: 'Benutzer', sub: 'VISIT ERFASSEN', x: 39, y: 172, description: 'Lea erfasst für Milo einen Visit. Der gleiche fachliche Wunsch ist Ausgangspunkt aller vier Varianten.', code: 'ownerId · petId · date · description' },
  { id: 'database', label: 'Datenbank', sub: 'DEMO-SPEICHER', x: 869, y: 172, description: 'Im Lab eine In-Memory-Datenhaltung. Sie zeigt Laden und Speichern ohne echten Server. Die Kernlogik ist für diesen technischen Austausch nicht zuständig.', code: 'new MemoryOwnerStore();' },
];
function nodeMarkup(node: GraphNode) {
  const outer = node.id === 'user' || node.id === 'database';
  const w = outer ? 73 : 136;
  const contract = node.kind === 'port';
  return `<g class="node ${node.kind || ''} ${selected === node.id ? 'selected' : ''}" data-node="${node.id}" role="button" tabindex="0" aria-label="${escape(node.label)}${contract ? ', Vertrag ohne eigene Ausführung' : ''}: Details anzeigen" aria-pressed="${selected === node.id}"><rect x="${node.x - w / 2}" y="${node.y - 29}" width="${w}" height="58" rx="7"/>${contract ? `<text x="${node.x}" y="${node.y - 37}" text-anchor="middle" class="node-sub">«interface» · Vertrag</text>` : ''}<text x="${node.x}" y="${node.y - 4}" text-anchor="middle" class="node-sub">${escape(node.sub)}</text><text x="${node.x}" y="${node.y + 14}" text-anchor="middle" style="font-size:${outer ? '10' : '13'}px">${escape(node.label)}</text></g>`;
}
function edgeMarkup(edge: Edge, nodes: GraphNode[]) {
  const from = nodes.find(n => n.id === edge.from)!;
  const to = nodes.find(n => n.id === edge.to)!;
  const dx = to.x - from.x, dy = to.y - from.y;
  const border = (node: GraphNode) => {
    const half = node.id === 'user' || node.id === 'database' ? 38 : 70;
    return Math.min(dx ? half / Math.abs(dx) : Infinity, dy ? 32 / Math.abs(dy) : Infinity);
  };
  const a = border(from), b = border(to);
  const x1 = from.x + dx * a, y1 = from.y + dy * a;
  const x2 = to.x - dx * b, y2 = to.y - dy * b;
  const marker = edge.kind === 'implementation' ? 'implements-arrow' : view === 'code' ? 'code-arrow' : 'runtime-arrow';
  return `<path d="M${x1} ${y1}L${x2} ${y2}" class="edge ${view === 'code' ? 'dependency' : ''} ${edge.kind || ''}" marker-end="url(#${marker})"/>${edge.label ? `<text x="${(x1 + x2) / 2}" y="${(y1 + y2) / 2 - 7}" text-anchor="middle" class="edge-label">${edge.label}</text>` : ''}`;
}
function selectNode(id: string) {
  selected = id;
  const node = [...architectures[architecture].nodes, ...outerNodes].find(n => n.id === id) || architectures[architecture].nodes[1];
  $('component-title').textContent = node.label;
  $('component-description').textContent = node.description;
  $('component-code').textContent = node.code;
  graph.querySelectorAll<SVGGElement>('[data-node]').forEach(el => { el.classList.toggle('selected', el.dataset.node === id); el.setAttribute('aria-pressed', String(el.dataset.node === id)); });
}
function render() {
  const model = architectures[architecture];
  const nodes = [...model.nodes, ...outerNodes];
  let boundary = '';
  if (architecture === 'hexagonal') boundary = '<path d="M310 32H565L659 173L565 337H310L220 173Z" class="boundary"/><text x="450" y="24" text-anchor="middle" class="boundary-label">APPLICATION CORE</text>';
  if (architecture === 'clean') boundary = '<rect x="224" y="35" width="441" height="302" rx="17" class="boundary"/><text x="450" y="24" text-anchor="middle" class="boundary-label">USE CASES & ENTITIES · INNERE GRENZE</text>';
  if (architecture === 'onion') boundary = '<rect x="231" y="38" width="439" height="287" rx="130" fill="#f0eddd" stroke="#bec6a7"/><rect x="270" y="67" width="362" height="234" rx="105" fill="#e9eedc" stroke="#b4c59e"/><ellipse cx="450" cy="243" rx="98" ry="53" fill="#dce8ca" stroke="#9bb789"/><text x="450" y="29" text-anchor="middle" class="boundary-label">UI / INFRASTRUCTURE → APPLICATION CORE → DOMAIN</text>';
  graph.innerHTML = `<defs><pattern id="lab-grid" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".7" fill="#c5d1bc"/></pattern><marker id="runtime-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 1L7 4L0 7" fill="none" stroke="#65825b"/></marker><marker id="code-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 1L7 4L0 7" fill="none" stroke="#a28742"/></marker><marker id="implements-arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0 1L8 5L0 9Z" fill="#f8faf4" stroke="#a28742"/></marker></defs><rect width="920" height="365" fill="url(#lab-grid)" opacity=".55"/>${boundary}${model[view].map(edge => edgeMarkup(edge, nodes)).join('')}${nodes.map(nodeMarkup).join('')}`;
  graph.querySelectorAll<SVGGElement>('[data-node]').forEach(node => {
    node.addEventListener('click', () => selectNode(node.dataset.node!));
    node.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectNode(node.dataset.node!); } });
  });
  $('canvas-title').textContent = model.title.toUpperCase();
  $('architecture-title').textContent = model.title;
  $('architecture-description').textContent = model.description;
  ($('architecture-lesson') as HTMLAnchorElement).href = url(`lernen/${model.lesson}/`);
  $('architecture-visual').setAttribute('aria-labelledby', `tab-${architecture}`);
  $('edge-legend').textContent = view === 'runtime' ? 'Pfeil = Aufruf zur Laufzeit' : 'Gestrichelt = Code-Abhängigkeit · Dreieck = implementiert';
  $('edge-legend').classList.toggle('code', view === 'code');
  document.querySelectorAll<HTMLButtonElement>('[data-architecture]').forEach(button => { const active = button.dataset.architecture === architecture; button.setAttribute('aria-selected', String(active)); button.tabIndex = active ? 0 : -1; });
  document.querySelectorAll<HTMLButtonElement>('[data-view]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.view === view)));
  selectNode(selected);
}
document.querySelectorAll<HTMLButtonElement>('[data-architecture]').forEach((button, index, buttons) => {
  button.addEventListener('click', () => {
    generation++;
    architecture = button.dataset.architecture as Architecture; selected = 'service';
    $('trace-log').replaceChildren(); $('run-empty').hidden = false; $('simulation-status').hidden = true;
    $('run-visit').removeAttribute('disabled');
    const address = new URL(location.href); address.searchParams.set('architecture', architecture); history.replaceState(null, '', address);
    render();
  });
  button.addEventListener('keydown', event => {
    let target: number | undefined;
    if (event.key === 'ArrowRight') target = (index + 1) % buttons.length;
    if (event.key === 'ArrowLeft') target = (index + buttons.length - 1) % buttons.length;
    if (event.key === 'Home') target = 0;
    if (event.key === 'End') target = buttons.length - 1;
    if (target !== undefined) { event.preventDefault(); buttons[target].click(); buttons[target].focus(); }
  });
});
document.querySelectorAll<HTMLButtonElement>('[data-view]').forEach(button => button.addEventListener('click', () => { view = button.dataset.view as View; render(); }));
const chosen = new URL(location.href).searchParams.get('architecture');
if (chosen && Object.hasOwn(architectures, chosen)) architecture = chosen as Architecture;
render();
const form = $('visit-form') as HTMLFormElement;
const date = form.elements.namedItem('date') as HTMLInputElement;
const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
const tomorrowISO = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
date.value = tomorrowISO;
form.addEventListener('submit', async event => {
  event.preventDefault(); const run = ++generation;
  const button = $('run-visit') as HTMLButtonElement; button.disabled = true;
  const status = $('simulation-status'); status.hidden = true; status.classList.remove('error');
  $('trace-log').replaceChildren(); $('run-empty').hidden = true;
  const values = new FormData(form);
  const command: VisitCommand = { ownerId: 1, petId: Number(values.get('petId')), date: String(values.get('date')), description: String(values.get('description')) };
  const stores = { layered: MemoryOwnerStore, clean: MemoryOwnerGateway, hexagonal: MemoryOwnerAdapter, onion: MemoryOwnerRepository };
  const store = new stores[architecture]();
  const steps: { component: string; message: string }[] = [];
  const trace: Trace = (component, message) => steps.push({ component, message });
  let error: string | undefined;
  try {
    const actions = { layered: bookLayered, clean: bookClean, hexagonal: bookHexagonal, onion: bookOnion };
    actions[architecture](command, store, todayISO(), trace);
  } catch (reason) { error = reason instanceof Error ? reason.message : 'Die Eingabe konnte nicht verarbeitet werden.'; }
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  for (const step of steps) {
    if (run !== generation) return;
    selectNode(step.component);
    const item = document.createElement('li'); item.textContent = step.message; $('trace-log').append(item);
    if (!reduced) await new Promise(resolve => setTimeout(resolve, 380));
  }
  if (run !== generation) return;
  const stored = store.findById(1)?.pets.find(pet => pet.id === command.petId);
  status.textContent = error ? `Visit nicht erfasst: ${error}` : `✓ Visit für ${stored?.name} am ${command.date.split('-').reverse().join('.')} erfasst. ${stored?.visits.length} Visit im Demo-Speicher.`;
  status.classList.toggle('error', Boolean(error)); status.hidden = false; button.disabled = false;
});
