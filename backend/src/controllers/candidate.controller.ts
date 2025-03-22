import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { validateCandidate } from '../middleware/validation';
import { handleFileUpload } from '../utils/fileHandler';
import { HistoryService } from '../services/history.service';
import { 
  CandidateInput,
  CandidateData,
  CandidateUpdateData,
  ChangeRecord,
  CandidateField,
  CandidateStatus,
  ChangeType
} from '../types/candidate.types';

const prisma = new PrismaClient();
const historyService = new HistoryService();
const MAX_FIELD_LENGTH = 255;

// Función helper para validar status
const isValidStatus = (status: unknown): status is CandidateStatus => {
  return typeof status === 'string' && Object.values(CandidateStatus).includes(status as CandidateStatus);
};

// Función helper para validar campos requeridos
const getRequiredFieldsErrors = (candidate: {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
}): string[] => {
  const missingFields: string[] = [];
  if (!candidate.firstName?.trim()) missingFields.push('firstName');
  if (!candidate.lastName?.trim()) missingFields.push('lastName');
  if (!candidate.email?.trim()) missingFields.push('email');
  if (!candidate.phone?.trim()) missingFields.push('phone');
  return missingFields;
};

// Función helper para crear un registro de cambio de status
const createStatusChangeRecord = (oldStatus: string, newStatus: CandidateStatus): ChangeRecord => ({
  field: 'status',
  oldValue: oldStatus,
  newValue: newStatus
});

const validateFieldLength = (field: string, value: string | null): string | null => {
  if (value && value.length > MAX_FIELD_LENGTH) {
    return `${field} must be less than ${MAX_FIELD_LENGTH} characters`;
  }
  return null;
};

const validateUpdateFields = (data: any): { isValid: boolean; errors: string[] } => {
  const validFields = [
    'firstName',
    'lastName',
    'email',
    'phone',
    'address',
    'status',
    'cvPath'
  ];

  const errors: string[] = [];
  let hasValidFields = false;

  for (const field in data) {
    if (!validFields.includes(field)) {
      errors.push(`Invalid field: ${field}`);
    } else {
      hasValidFields = true;
      if (typeof data[field] === 'string') {
        const error = validateFieldLength(field, data[field]);
        if (error) errors.push(error);
      }
    }
  }

  return {
    isValid: hasValidFields && errors.length === 0,
    errors
  };
};

// Función helper para validar transiciones de estado
const isValidStatusTransition = (currentStatus: CandidateStatus, newStatus: CandidateStatus): boolean => {
  const allowedTransitions: Record<CandidateStatus, CandidateStatus[]> = {
    [CandidateStatus.DRAFT]: [CandidateStatus.ACTIVE],
    [CandidateStatus.ACTIVE]: [CandidateStatus.INACTIVE],
    [CandidateStatus.INACTIVE]: [CandidateStatus.DRAFT]
  };

  return allowedTransitions[currentStatus]?.includes(newStatus) || false;
};

export const createCandidate = async (req: Request, res: Response): Promise<Response> => {
  try {
    const input: CandidateInput = req.body;
    
    // Validar campos requeridos
    const missingFields = getRequiredFieldsErrors(input);
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      });
    }

    // Validar longitudes máximas
    const lengthErrors: string[] = [];
    const fieldsToValidate = ['firstName', 'lastName', 'email', 'phone', 'address'] as const;
    
    for (const field of fieldsToValidate) {
      const value = input[field];
      if (value !== undefined) {
        const error = validateFieldLength(field, value);
        if (error) lengthErrors.push(error);
      }
    }

    if (lengthErrors.length > 0) {
      return res.status(400).json({ error: lengthErrors.join(', ') });
    }

    const candidate = await prisma.candidate.create({
      data: input
    });

    return res.status(201).json(candidate);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return res.status(400).json({ error: 'Email already exists' });
      }
    }
    console.error('Error creating candidate:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCandidates = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    console.log('Attempting to fetch candidates...');
    const candidates = await prisma.candidate.findMany({
      // No incluimos relaciones que no existen
      include: {
        history: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });
    console.log('Candidates fetched successfully:', candidates.length);
    return res.json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return res.status(500).json({ error: 'Error fetching candidates' });
  }
};

export const getCandidate = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const { id } = req.params;
    const candidate = await prisma.candidate.findUnique({
      where: { id: Number(id) },
      include: {
        history: true
      }
    });
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    return res.json(candidate);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching candidate' });
  }
};

export const updateCandidate = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = parseInt(req.params.id);
    const updates = req.body;

    // Validar campos de actualización
    const validation = validateUpdateFields(updates);
    if (!validation.isValid) {
      return res.status(400).json({ 
        error: validation.errors.length > 0 
          ? validation.errors.join(', ') 
          : 'No valid fields to update' 
      });
    }

    const existingCandidate = await prisma.candidate.findUnique({
      where: { id }
    });

    if (!existingCandidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    // Validar transición de estado si se está actualizando el status
    if (updates.status && !isValidStatusTransition(existingCandidate.status as CandidateStatus, updates.status as CandidateStatus)) {
      return res.status(400).json({ 
        error: `Invalid status transition from ${existingCandidate.status} to ${updates.status}` 
      });
    }

    const candidate = await prisma.candidate.update({
      where: { id },
      data: updates,
      include: {
        history: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      }
    });

    // Registrar cambios en el historial
    const changes: ChangeRecord[] = [];
    const validFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'status', 'cvPath'] as const;
    
    for (const key of validFields) {
      if (key in updates && existingCandidate[key] !== updates[key]) {
        changes.push({
          field: key,
          oldValue: existingCandidate[key],
          newValue: updates[key] as string | null
        });
      }
    }

    if (changes.length > 0) {
      await historyService.trackChanges(id, changes);
    }

    // Obtener el historial actualizado
    const updatedCandidate = await prisma.candidate.findUnique({
      where: { id },
      include: {
        history: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      }
    });

    return res.json(updatedCandidate);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Candidate not found' });
      }
    }
    console.error('Error updating candidate:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteCandidate = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = parseInt(req.params.id);
    
    const existingCandidate = await prisma.candidate.findUnique({
      where: { id }
    });

    if (!existingCandidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    await prisma.candidate.delete({
      where: { id }
    });

    return res.status(204).send();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Candidate not found' });
      }
    }
    console.error('Error deleting candidate:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const uploadCV = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const candidate = await prisma.candidate.findUnique({
      where: { id }
    });

    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    const updatedCandidate = await prisma.candidate.update({
      where: { id },
      data: { cvPath: req.file.path }
    });

    return res.json({ candidate: updatedCandidate });
  } catch (error) {
    console.error('Error uploading CV:', error);
    return res.status(500).json({ error: 'Error uploading CV' });
  }
};

export const saveDraft = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const candidate = await prisma.candidate.findUnique({
      where: { id }
    });

    if (!candidate) {
      res.status(404).json({ error: 'Candidate not found' });
      return;
    }

    const updatedCandidate = await prisma.candidate.update({
      where: { id },
      data: {
        ...req.body,
        status: CandidateStatus.DRAFT
      }
    });

    await historyService.trackChanges(id, [
      createStatusChangeRecord(candidate.status, CandidateStatus.DRAFT)
    ]);

    res.json(updatedCandidate);
  } catch (error) {
    res.status(500).json({ error: 'Error saving draft' });
  }
};

export const publishCandidate = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const candidate = await prisma.candidate.findUnique({
      where: { id }
    });

    if (!candidate) {
      res.status(404).json({ error: 'Candidate not found' });
      return;
    }

    const missingFields = getRequiredFieldsErrors(candidate);
    if (missingFields.length > 0) {
      res.status(400).json({
        error: `Missing required fields for publication: ${missingFields.join(', ')}`
      });
      return;
    }

    const updatedCandidate = await prisma.candidate.update({
      where: { id },
      data: { status: CandidateStatus.ACTIVE }
    });

    await historyService.trackChanges(id, [
      createStatusChangeRecord(candidate.status, CandidateStatus.ACTIVE)
    ]);

    res.json(updatedCandidate);
  } catch (error) {
    console.error('Error publishing candidate:', error);
    res.status(500).json({ error: 'Error publishing candidate' });
  }
}; 