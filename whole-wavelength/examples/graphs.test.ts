import { test } from 'node:test';
import assert from 'node:assert/strict';
import { architectures } from '../src/data/explorer.ts';
for (const [name, model] of Object.entries(architectures)) {
  test(`${name}: diagram nodes and edges are consistent`, () => {
    const ids = ['user', 'database', ...model.nodes.map(node => node.id)];
    assert.equal(new Set(ids).size, ids.length);
    for (const view of [model.runtime, model.code]) for (const edge of view) {
      assert.ok(ids.includes(edge.from), `missing ${edge.from}`);
      assert.ok(ids.includes(edge.to), `missing ${edge.to}`);
      assert.notEqual(edge.from, edge.to);
    }
    for (const node of model.nodes) {
      assert.ok(node.description.length > 30); assert.ok(node.code.length > 0);
      assert.ok(node.x > 80 && node.x < 820 && node.y > 30 && node.y < 330);
    }
  });
  test(`${name}: separates runtime from source dependencies`, () => {
    if (name === 'layered') {
      assert.ok(model.code.some(edge => edge.from === 'service' && edge.to === 'persistence'));
    } else {
      assert.ok(model.runtime.some(edge => edge.from === 'port' && edge.to === 'persistence'));
      assert.ok(model.code.some(edge => edge.from === 'persistence' && edge.to === 'port' && edge.kind === 'implementation'));
      assert.ok(!model.code.some(edge => edge.from === 'port' && edge.to === 'persistence'));
    }
    assert.ok(!model.code.some(edge => edge.from === 'service' && edge.to === 'database'));
  });
}
