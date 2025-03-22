import { prisma } from '../index';
import { ChangeRecord, ChangeType } from '../types/candidate.types';

export class HistoryService {
  async trackChanges(candidateId: number, changes: ChangeRecord[]) {
    try {
      // Validar formato de cambios
      if (!Array.isArray(changes) || !changes.every(change => 
        change.field && 
        'oldValue' in change && 
        'newValue' in change
      )) {
        throw new Error('Invalid changes format');
      }

      // Verificar si el candidato existe
      const candidate = await prisma.candidate.findUnique({
        where: { id: candidateId }
      });

      if (!candidate) {
        throw new Error('Candidate not found');
      }

      // Si no hay cambios, no hacer nada
      if (changes.length === 0) {
        return;
      }

      try {
        // Crear el registro de historia
        await prisma.candidateHistory.create({
          data: {
            candidateId,
            changes: JSON.stringify(changes),
            changeType: ChangeType.UPDATE
          }
        });
      } catch (error) {
        throw new Error('Failed to track changes');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to track changes');
    }
  }
} 