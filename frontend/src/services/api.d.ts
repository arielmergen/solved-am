import { Candidate } from '../types/candidate.types';

declare const api: {
  candidates: {
    getAll: () => Promise<Candidate[]>;
    getById: (id: number) => Promise<Candidate>;
    create: (candidate: Omit<Candidate, 'id'>) => Promise<Candidate>;
    update: (id: number, candidate: Candidate) => Promise<Candidate>;
    delete: (id: number) => Promise<void>;
  };
};

export default api; 