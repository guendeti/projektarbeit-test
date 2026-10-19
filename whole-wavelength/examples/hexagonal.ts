import { addVisit, loadOwner } from './domain.ts';
import type { OwnerStore, Trace, Visit, VisitCommand } from './domain.ts';

export interface OwnerRepositoryPort extends OwnerStore {}
export interface BookVisitInputPort { book(command: VisitCommand): Visit; }
export class BookVisitService implements BookVisitInputPort {
  private owners: OwnerRepositoryPort;
  private today: string;
  private trace: Trace;
  constructor(owners: OwnerRepositoryPort, today: string, trace: Trace) {
    this.owners = owners; this.today = today; this.trace = trace;
  }
  book(command: VisitCommand) {
    this.trace('service', 'BookVisitService implementiert den Input Port.');
    this.trace('service', 'OwnerRepositoryPort beschreibt den Persistenzbedarf des Kerns.');
    this.trace('persistence', 'Der In-Memory-Adapter beantwortet den Ladeaufruf.');
    const owner = loadOwner(this.owners, command.ownerId);
    this.trace('domain', 'Der Domain-Kern prüft die Eingabe und fügt den Visit hinzu.');
    const visit = addVisit(owner, command, this.today);
    this.owners.save(owner);
    this.trace('database', 'Der Driven Adapter persistiert den Owner im Demo-Speicher.');
    return visit;
  }
}
export function bookHexagonal(command: VisitCommand, owners: OwnerRepositoryPort, today: string, trace: Trace) {
  trace('web', 'Driving Adapter übersetzt die Formulareingabe.');
  trace('web', 'Der Adapter ruft den Input Port BookVisitInputPort auf.');
  const input: BookVisitInputPort = new BookVisitService(owners, today, trace);
  return input.book(command);
}
