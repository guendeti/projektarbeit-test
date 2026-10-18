import { addVisit, loadOwner } from './domain.ts';
import type { OwnerStore, Trace, Visit, VisitCommand } from './domain.ts';

export interface OwnerGateway extends OwnerStore {}
export interface BookVisitUseCase { execute(command: VisitCommand): Visit; }
export class BookVisitInteractor implements BookVisitUseCase {
  private owners: OwnerGateway;
  private today: string;
  private trace: Trace;
  constructor(owners: OwnerGateway, today: string, trace: Trace) {
    this.owners = owners; this.today = today; this.trace = trace;
  }
  execute(command: VisitCommand): Visit {
    this.trace('service', 'BookVisitInteractor führt den anwendungsspezifischen Use-Case aus.');
    this.trace('port', 'OwnerGateway ist der vom Use-Case benötigte Vertrag.');
    this.trace('persistence', 'Der eingesetzte Adapter lädt über den Gateway-Vertrag.');
    const owner = loadOwner(this.owners, command.ownerId);
    this.trace('domain', 'Entities prüfen die Regeln und ordnen den Visit dem Pet zu.');
    const visit = addVisit(owner, command, this.today);
    this.owners.save(owner);
    this.trace('database', 'Der äussere Adapter speichert das Ergebnis im Demo-Speicher.');
    return visit;
  }
}
export function bookClean(command: VisitCommand, gateway: OwnerGateway, today: string, trace: Trace) {
  trace('web', 'VisitController übersetzt die Eingabe in einen Command.');
  trace('input', 'Aufruf der Input Boundary BookVisitUseCase.');
  const useCase: BookVisitUseCase = new BookVisitInteractor(gateway, today, trace);
  return useCase.execute(command);
}
