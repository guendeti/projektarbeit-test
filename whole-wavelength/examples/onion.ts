import { addVisit, loadOwner } from './domain.ts';
import type { OwnerStore, Trace, VisitCommand } from './domain.ts';

export interface OwnerRepository extends OwnerStore {}
export class BookVisitApplicationService {
  private owners: OwnerRepository;
  constructor(owners: OwnerRepository) { this.owners = owners; }
  book(command: VisitCommand, today: string, trace: Trace) {
    trace('service', 'Application Service koordiniert den fachlichen Ablauf.');
    trace('port', 'OwnerRepository liegt als Vertrag im Application Core.');
    trace('persistence', 'Die äussere Infrastruktur liefert den Owner.');
    const owner = loadOwner(this.owners, command.ownerId);
    trace('domain', 'Das Domain Model prüft Regeln und erhält den neuen Visit.');
    const visit = addVisit(owner, command, today);
    this.owners.save(owner);
    trace('database', 'Die Infrastruktur speichert über den inneren Vertrag.');
    return visit;
  }
}
export function bookOnion(command: VisitCommand, repository: OwnerRepository, today: string, trace: Trace) {
  trace('web', 'Die äussere UI übersetzt die Eingabe.');
  return new BookVisitApplicationService(repository).book(command, today, trace);
}
