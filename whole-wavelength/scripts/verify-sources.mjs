// Optional online check of selected factual anchors at the documented immutable commits.
import assert from 'node:assert/strict';
import { repositorySnapshots } from '../src/data/source-snapshots.ts';

async function read(id, file) {
  const snapshot = repositorySnapshots.find(item => item.id === id);
  assert.ok(snapshot, `Unknown reference ${id}`);
  const response = await fetch(`https://raw.githubusercontent.com/${snapshot.repo}/${snapshot.sha}/${file}`, { signal: AbortSignal.timeout(20000) });
  assert.ok(response.ok, `${id}/${file}: HTTP ${response.status}`);
  const content = await response.text();
  console.log(`HTTP ${response.status} ${snapshot.repo}@${snapshot.sha.slice(0, 12)}/${file}`);
  return content;
}

const controller = await read('petclinic', 'src/main/java/org/springframework/samples/petclinic/owner/VisitController.java');
assert.match(controller, /OwnerRepository owners/);
assert.match(controller, /isAfter\(LocalDate\.now\(\)\)/);
assert.match(controller, /owners\.save\(owner\)/);
const visit = await read('petclinic', 'src/main/java/org/springframework/samples/petclinic/owner/Visit.java');
assert.match(visit, /@Size\(max = 255\)/);
assert.match(visit, /@NotBlank/);
const schema = await read('petclinic', 'src/main/resources/db/h2/schema.sql');
const visitTable = schema.match(/CREATE TABLE visits\s*\(([\s\S]*?)\);/i)?.[1];
assert.ok(visitTable);
assert.match(visitTable, /pet_id/);
assert.doesNotMatch(visitTable, /vet_id/);
const modulith = await read('petclinic-modulith', 'README.md');
assert.match(modulith, /VisitBooked/);
assert.match(modulith, /VetRoster/);
assert.match(modulith, /assigns least-loaded vet/);
const microservices = await read('petclinic-microservices', 'README.md');
assert.match(microservices, /Customers/i);
assert.match(microservices, /Visits/i);
assert.match(microservices, /Vets/i);
const framework = await read('framework', 'readme.md');
assert.match(framework, /presentation.*service.*repository/i);
console.log('Selected factual anchors confirmed at all four pinned repository commits.');
