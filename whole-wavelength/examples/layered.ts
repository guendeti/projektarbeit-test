import { addVisit, loadOwner } from './domain.ts';
import type { Trace, VisitCommand } from './domain.ts';
import { MemoryOwnerStore } from './memory.ts';

// Classical layering: the application service directly knows the data-access class.
class BookVisitService {
  private repository: MemoryOwnerStore;
  constructor(repository: MemoryOwnerStore) { this.repository = repository; }
  book(command: VisitCommand, today: string, trace: Trace) {
    trace('service', 'BookVisitService koordiniert den Ablauf.');
    trace('persistence', 'OwnerRepository lädt den Owner mit seinen Pets.');
    const owner = loadOwner(this.repository, command.ownerId);
    trace('domain', 'Domäne prüft Pet, Datum und Beschreibung und fügt den Visit hinzu.');
    const visit = addVisit(owner, command, today);
    this.repository.save(owner);
    trace('database', 'OwnerRepository speichert den veränderten Owner im Demo-Speicher.');
    return visit;
  }
}
export function bookLayered(command: VisitCommand, store: MemoryOwnerStore, today: string, trace: Trace) {
  trace('web', 'VisitController übersetzt die Eingabe in einfache Werte.');
  return new BookVisitService(store).book(command, today, trace);
}
