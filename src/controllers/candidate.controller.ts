import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { trackChanges } from '../services/history.service';
import { CandidateInput, CandidateUpdateData, ChangeType } from '../types/candidate.types';

// ... existing code ...

// En el método create
await trackChanges(candidate.id, ChangeType.CREATE, []);

// ... existing code ...

// En el método update
const trackingResult = await trackChanges(id, ChangeType.UPDATE, changes);

// ... existing code ...

// En el método delete
await trackChanges(id, ChangeType.DELETE, []);

// ... existing code ...

// En otros métodos que usan 'UPDATE'
await trackChanges(Number(id), ChangeType.UPDATE, [{
  // ... resto del código ...
}]);

// ... existing code ...

await trackChanges(id, ChangeType.UPDATE, [{
  // ... resto del código ...
}]); 