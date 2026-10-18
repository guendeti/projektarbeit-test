// Outer adapters explicitly implement the contracts owned by the inner examples.
// The demo stores the same domain-shaped objects, so no persistence mapping is needed.
import { MemoryOwnerStore } from './memory.ts';
import type { OwnerGateway } from './clean.ts';
import type { OwnerRepositoryPort } from './hexagonal.ts';
import type { OwnerRepository } from './onion.ts';

export class MemoryOwnerGateway extends MemoryOwnerStore implements OwnerGateway {}
export class MemoryOwnerAdapter extends MemoryOwnerStore implements OwnerRepositoryPort {}
export class MemoryOwnerRepository extends MemoryOwnerStore implements OwnerRepository {}
