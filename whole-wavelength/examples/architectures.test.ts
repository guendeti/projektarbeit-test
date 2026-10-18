import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MemoryOwnerStore } from './memory.ts';
import { MemoryOwnerGateway, MemoryOwnerAdapter, MemoryOwnerRepository } from './adapters.ts';
import { bookLayered } from './layered.ts';
import { bookClean } from './clean.ts';
import { bookHexagonal } from './hexagonal.ts';
import { bookOnion } from './onion.ts';
const variants = { layered: bookLayered, clean: bookClean, hexagonal: bookHexagonal, onion: bookOnion };
const stores: Record<string, typeof MemoryOwnerStore> = { layered: MemoryOwnerStore, clean: MemoryOwnerGateway, hexagonal: MemoryOwnerAdapter, onion: MemoryOwnerRepository };
const valid = { ownerId: 1, petId: 1, date: '2030-10-20', description: '  Vorsorge  ' };
for (const [name, book] of Object.entries(variants)) {
  test(`${name}: assigns and persists the visit to the selected pet`, () => {
    const store = new stores[name](); const trace: string[] = [];
    const visit = book(valid, store, '2030-10-18', id => trace.push(id));
    assert.deepEqual(visit, { date: '2030-10-20', description: 'Vorsorge' });
    const owner = store.findById(1)!;
    assert.deepEqual(owner.pets[0].visits, [visit]); assert.equal(owner.pets[1].visits.length, 0);
    assert.equal(trace[0], 'web'); assert.equal(trace.at(-1), 'database');
    assert.ok(!trace.includes('input') && !trace.includes('port'), 'Interfaces do not execute processing steps');
  });
  for (const [label, patch] of Object.entries({ today: { date: '2030-10-18' }, past: { date: '2030-10-17' }, impossible: { date: '2030-02-30' }, malformed: { date: 'garbage' }, empty: { description: '  ' }, long: { description: 'a'.repeat(256) }, missingOwner: { ownerId: 99 }, wrongPet: { petId: 99 } })) {
    test(`${name}: rejects ${label} without persisting partial changes`, () => {
      const store = new stores[name]();
      assert.throws(() => book({ ...valid, ...patch }, store, '2030-10-18', () => {}));
      assert.equal(store.findById(1)!.pets[0].visits.length, 0);
    });
  }
  test(`${name}: supports another pet and repeated visits`, () => {
    const store = new stores[name]();
    book({ ...valid, petId: 2 }, store, '2030-10-18', () => {});
    book({ ...valid, petId: 2 }, store, '2030-10-18', () => {});
    assert.equal(store.findById(1)!.pets[1].visits.length, 2);
    assert.equal(store.findById(1)!.pets[0].visits.length, 0);
  });
  test(`${name}: accepts the original model's 255-character boundary`, () => {
    const store = new stores[name]();
    const visit = book({ ...valid, description: 'a'.repeat(255) }, store, '2030-10-18', () => {});
    assert.equal(visit.description.length, 255);
    assert.equal(store.findById(1)!.pets[0].visits[0].description.length, 255);
  });
}
