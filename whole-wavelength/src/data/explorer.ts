export type Architecture = 'layered' | 'clean' | 'hexagonal' | 'onion';
export type View = 'runtime' | 'code';
export type GraphNode = { id: string; label: string; sub: string; x: number; y: number; kind?: string; description: string; code: string };
export type Edge = { from: string; to: string; kind?: 'implementation'; label?: string };
export const architectures: Record<Architecture, { title: string; description: string; lesson: string; nodes: GraphNode[]; runtime: Edge[]; code: Edge[] }> = {
  layered: {
    title: 'Layered Architecture', lesson: 'layered-architecture',
    description: 'In unserer klassischen Layered-Variante ruft der Controller den Application Service auf, der die Datenzugriffsklasse kennt. Die Domäne enthält das fachliche Verhalten. Auch Layered kann Repository-Interfaces und Dependency Inversion verwenden; das ist hier bewusst nicht unsere Vergleichsvariante.',
    nodes: [
      { id: 'web', label: 'VisitController', sub: 'PRESENTATION', x: 170, y: 135, description: 'Nimmt die HTTP-Eingabe entgegen und delegiert die fachliche Verarbeitung an den Service.', code: 'service.bookVisit(command);' },
      { id: 'service', label: 'BookVisitService', sub: 'APPLICATION', x: 380, y: 135, kind: 'core', description: 'Koordiniert den Use-Case. In unserer klassischen Layered-Variante kennt er die Datenzugriffsschicht direkt.', code: 'const owner = repository.findById(id);\naddVisit(owner, command, today);\nrepository.save(owner);' },
      { id: 'persistence', label: 'OwnerRepository', sub: 'DATA ACCESS', x: 610, y: 135, description: 'Lädt und speichert Owner-Daten. Die konkrete Repository-Struktur gehört zur Datenschicht.', code: 'repository.findById(ownerId);\nrepository.save(owner);' },
      { id: 'domain', label: 'Owner · Pet · Visit', sub: 'DOMAIN MODEL', x: 380, y: 270, kind: 'core', description: 'Ordnet den Visit einem vorhandenen Pet zu und prüft die fachlichen Regeln.', code: 'addVisit(owner, command, today);' },
    ],
    runtime: [{ from: 'user', to: 'web' }, { from: 'web', to: 'service' }, { from: 'service', to: 'persistence' }, { from: 'persistence', to: 'database' }, { from: 'service', to: 'domain' }],
    code: [{ from: 'web', to: 'service' }, { from: 'service', to: 'persistence' }, { from: 'service', to: 'domain' }],
  },
  clean: {
    title: 'Clean Architecture', lesson: 'clean-architecture',
    description: 'Input Boundary und Gateway liegen als Verträge innen. Zur Laufzeit ruft der Controller den Interactor über die Input Boundary auf; der Interactor erreicht den Adapter über das Gateway. Die Interfaces führen selbst nichts aus. Im Code implementiert der äussere Adapter den inneren Vertrag.',
    nodes: [
      { id: 'web', label: 'VisitController', sub: 'INTERFACE ADAPTER', x: 150, y: 172, description: 'Übersetzt HTTP in einen einfachen Command und kennt nur die Input Boundary.', code: 'useCase.execute(command);' },
      { id: 'input', label: 'BookVisitUseCase', sub: 'INPUT BOUNDARY', x: 315, y: 80, kind: 'port', description: 'Der innere Eingangsvertrag. Der Controller verwendet ihn, der Interactor implementiert ihn.', code: 'interface BookVisitUseCase {\n  execute(command): Visit;\n}' },
      { id: 'service', label: 'BookVisitInteractor', sub: 'USE CASE', x: 430, y: 172, kind: 'core', description: 'Führt den Use-Case aus. Kennt Entities und OwnerGateway, aber weder JPA noch Spring MVC.', code: 'class BookVisitInteractor\n  implements BookVisitUseCase' },
      { id: 'port', label: 'OwnerGateway', sub: 'INNERER VERTRAG', x: 580, y: 80, kind: 'port', description: 'Definiert den Persistenzbedarf aus Sicht des Use-Cases. Es ist keine konkrete Datenbankklasse.', code: 'interface OwnerGateway {\n  findById(id): Owner;\n  save(owner): void;\n}' },
      { id: 'persistence', label: 'MemoryOwnerGateway', sub: 'INTERFACE ADAPTER', x: 715, y: 172, description: 'Implementiert OwnerGateway. Im Beispiel verwenden wir In-Memory statt einer echten JPA-Datenbank.', code: 'class MemoryOwnerGateway\n  implements OwnerGateway' },
      { id: 'domain', label: 'Owner · Pet · Visit', sub: 'ENTITIES', x: 430, y: 294, kind: 'core', description: 'Fachliche Regeln bleiben unabhängig von Web und Persistenz.', code: 'addVisit(owner, command, today);' },
    ],
    runtime: [{ from: 'user', to: 'web' }, { from: 'web', to: 'service', label: 'via Eingangsvertrag' }, { from: 'service', to: 'persistence', label: 'via Persistenzvertrag' }, { from: 'persistence', to: 'database' }, { from: 'service', to: 'domain' }],
    code: [{ from: 'web', to: 'input' }, { from: 'service', to: 'input', kind: 'implementation', label: 'implementiert' }, { from: 'service', to: 'port' }, { from: 'persistence', to: 'port', kind: 'implementation', label: 'implementiert' }, { from: 'service', to: 'domain' }],
  },
  hexagonal: {
    title: 'Hexagonal Architecture', lesson: 'hexagonal-architecture',
    description: 'Der Webadapter ruft den Service über den Input Port auf. Der Service erreicht den Driven Adapter über den Output Port. Ports sind Verträge der Anwendung, keine zusätzlichen ausführenden Komponenten. Im Code hängen die Adapter von diesen inneren Verträgen ab.',
    nodes: [
      { id: 'web', label: 'VisitWebAdapter', sub: 'DRIVING ADAPTER', x: 150, y: 172, description: 'Übersetzt die Formulardaten für den Input Port. Ein Testadapter könnte denselben Port verwenden.', code: 'inputPort.book(command);' },
      { id: 'input', label: 'BookVisitInputPort', sub: 'INPUT PORT / VERTRAG', x: 315, y: 80, kind: 'port', description: 'Die angebotene Fähigkeit: einen Visit erfassen. Der Port beschreibt keinen HTTP-Endpunkt.', code: 'interface BookVisitInputPort {\n  book(command): Visit;\n}' },
      { id: 'service', label: 'BookVisitService', sub: 'APPLICATION CORE', x: 430, y: 172, kind: 'core', description: 'Implementiert den Eingangsport und verwendet den Ausgangsport. Kennt keine konkrete Speichertechnologie.', code: 'class BookVisitService\n  implements BookVisitInputPort' },
      { id: 'port', label: 'OwnerRepositoryPort', sub: 'OUTPUT PORT', x: 580, y: 80, kind: 'port', description: 'Der Kern sagt, was er braucht: Owner laden und speichern. Der Vertrag gehört nach innen.', code: 'interface OwnerRepositoryPort {\n  findById(id): Owner;\n  save(owner): void;\n}' },
      { id: 'persistence', label: 'MemoryOwnerAdapter', sub: 'DRIVEN ADAPTER', x: 715, y: 172, description: 'Technische Umsetzung des Output Ports. Ein JPA-Adapter könnte ihn ebenfalls implementieren.', code: 'class MemoryOwnerAdapter\n  implements OwnerRepositoryPort' },
      { id: 'domain', label: 'Owner · Pet · Visit', sub: 'DOMAIN MODEL', x: 430, y: 294, kind: 'core', description: 'Enthält die gemeinsame Fachlichkeit. Sie bleibt von den Adaptern unabhängig.', code: 'addVisit(owner, command, today);' },
    ],
    runtime: [{ from: 'user', to: 'web' }, { from: 'web', to: 'service', label: 'via Eingangsvertrag' }, { from: 'service', to: 'persistence', label: 'via Persistenzvertrag' }, { from: 'persistence', to: 'database' }, { from: 'service', to: 'domain' }],
    code: [{ from: 'web', to: 'input' }, { from: 'service', to: 'input', kind: 'implementation', label: 'implementiert' }, { from: 'service', to: 'port' }, { from: 'persistence', to: 'port', kind: 'implementation', label: 'implementiert' }, { from: 'service', to: 'domain' }],
  },
  onion: {
    title: 'Onion Architecture', lesson: 'onion-architecture',
    description: 'Das Domain Model liegt im Zentrum. Der Application Service und sein Repository-Vertrag liegen im Application Core. Die äussere UI und der Persistenzadapter hängen von diesen inneren Bereichen ab.',
    nodes: [
      { id: 'web', label: 'VisitController', sub: 'ÄUSSERE UI', x: 150, y: 172, description: 'Der Controller gehört zur äusseren UI und ruft die Anwendung auf.', code: 'applicationService.book(command);' },
      { id: 'service', label: 'BookVisitService', sub: 'APPLICATION CORE', x: 355, y: 105, kind: 'core', description: 'Koordiniert den Ablauf um das Domain Model herum und verwendet einen inneren Repository-Vertrag.', code: 'const owner = owners.findById(id);\naddVisit(owner, command, today);' },
      { id: 'port', label: 'OwnerRepository', sub: 'VERTRAG IM CORE', x: 580, y: 105, kind: 'port', description: 'Das Repository-Interface liegt innen. Die äussere Infrastruktur implementiert es.', code: 'interface OwnerRepository {\n  findById(id): Owner;\n  save(owner): void;\n}' },
      { id: 'persistence', label: 'MemoryOwnerRepository', sub: 'INFRASTRUCTURE', x: 715, y: 205, description: 'Äussere Implementierung des inneren Repository-Vertrags. Die Datenbank bleibt ein technisches Detail.', code: 'class MemoryOwnerRepository\n  implements OwnerRepository' },
      { id: 'domain', label: 'Owner · Pet · Visit', sub: 'DOMAIN MODEL · ZENTRUM', x: 450, y: 245, kind: 'core', description: 'Der fachliche Mittelpunkt. Hier werden Regeln geprüft und der Visit dem Pet zugeordnet.', code: 'addVisit(owner, command, today);' },
    ],
    runtime: [{ from: 'user', to: 'web' }, { from: 'web', to: 'service' }, { from: 'service', to: 'persistence', label: 'via Repository-Vertrag' }, { from: 'persistence', to: 'database' }, { from: 'service', to: 'domain' }],
    code: [{ from: 'web', to: 'service' }, { from: 'service', to: 'port' }, { from: 'persistence', to: 'port', kind: 'implementation', label: 'implementiert' }, { from: 'service', to: 'domain' }],
  },
};
