// Enums from Prisma schema
export enum CandidateStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export enum ChangeType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE'
}

// Datos que el usuario proporciona al crear
export interface CandidateInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  cvPath?: string | null;
}

// Datos completos de un candidato en la base de datos
export interface CandidateData extends CandidateInput {
  id: number;
  status: CandidateStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Campos que se pueden actualizar
export type CandidateField = keyof Omit<CandidateData, 'id' | 'createdAt' | 'updatedAt'>;

// Datos para actualización (todos opcionales)
export interface CandidateUpdateData extends Partial<CandidateInput> {
  status?: CandidateStatus;
}

// Registro de cambios
export interface ChangeRecord {
  field: CandidateField;
  oldValue: string | null;
  newValue: string | null;
}

// Historial de cambios
export interface CandidateHistory {
  id: number;
  candidateId: number;
  changeType: ChangeType;
  changes: ChangeRecord[];
  createdAt: Date;
} 