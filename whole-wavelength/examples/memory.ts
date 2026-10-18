import type { Owner, OwnerStore } from './domain.ts';

export class MemoryOwnerStore implements OwnerStore {
  private data: Map<number, Owner>;
  constructor() {
    this.data = new Map([[1, { id: 1, name: 'Lea Keller', pets: [
      { id: 1, name: 'Milo', visits: [] }, { id: 2, name: 'Luna', visits: [] },
    ] }]]);
  }
  findById(id: number): Owner | undefined {
    const owner = this.data.get(id);
    return owner ? structuredClone(owner) : undefined;
  }
  save(owner: Owner): void { this.data.set(owner.id, structuredClone(owner)); }
}
