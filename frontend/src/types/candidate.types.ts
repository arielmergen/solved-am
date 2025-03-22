export interface Candidate {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  cvPath?: string;
  status?: 'DRAFT' | 'ACTIVE' | 'INACTIVE';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WorkExperience {
  id?: number;
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  description: string;
  candidateId?: number;
}

export interface Education {
  id?: number;
  title: string;
  institution: string;
  startDate?: Date;
  endDate?: Date;
  isComplete: boolean;
  candidateId?: number;
}
