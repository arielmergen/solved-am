export enum CandidateStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export interface Candidate {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  status: CandidateStatus;
  cvPath?: string;
  createdAt?: string;
  updatedAt?: string;
  history?: CandidateHistory[];
}

export interface CandidateHistory {
  id: number;
  candidateId: number;
  changeType: 'CREATE' | 'UPDATE' | 'DELETE';
  changes: string;
  createdAt: string;
}

export interface CandidateFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

export interface HistoryChange {
  field: string;
  oldValue: any;
  newValue: any;
} 