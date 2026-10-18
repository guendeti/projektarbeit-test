// Shared domain: no browser, storage, HTTP or framework imports.
export type VisitCommand = { ownerId: number; petId: number; date: string; description: string };
export type Visit = { date: string; description: string };
export type Pet = { id: number; name: string; visits: Visit[] };
export type Owner = { id: number; name: string; pets: Pet[] };
export interface OwnerStore { findById(id: number): Owner | undefined; save(owner: Owner): void; }
export type Trace = (component: string, message: string) => void;

export function todayISO(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}
export function addVisit(owner: Owner, command: VisitCommand, today: string): Visit {
  const pet = owner.pets.find(candidate => candidate.id === command.petId);
  if (!pet) throw new Error('Dieses Pet gehört nicht zum ausgewählten Owner.');
  const parsed = new Date(`${command.date}T12:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(command.date) || Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== command.date || command.date <= today) {
    throw new Error('Das Besuchsdatum muss ein gültiger Tag in der Zukunft sein.');
  }
  if (!command.description.trim()) throw new Error('Bitte gib eine Beschreibung an.');
  if (command.description.trim().length > 240) throw new Error('Die Beschreibung darf höchstens 240 Zeichen enthalten.');
  const visit = { date: command.date, description: command.description.trim() };
  pet.visits.push(visit);
  return visit;
}
export function loadOwner(store: OwnerStore, id: number): Owner {
  const owner = store.findById(id);
  if (!owner) throw new Error('Der Owner wurde nicht gefunden.');
  return owner;
}
