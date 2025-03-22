import axios from 'axios';
import { Candidate, CandidateFormData } from '../types/candidate.types';

// Usar la variable de entorno o el valor por defecto
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

console.log('API URL:', API_URL); // Para depuración

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const candidateService = {
  // Obtener todos los candidatos
  getAllCandidates: async (): Promise<Candidate[]> => {
    const response = await api.get('/api/candidates');
    return response.data;
  },

  // Obtener un candidato por ID
  getCandidate: async (id: number): Promise<Candidate> => {
    const response = await api.get(`/api/candidates/${id}`);
    return response.data;
  },

  // Crear un nuevo candidato
  createCandidate: async (candidateData: CandidateFormData): Promise<Candidate> => {
    const response = await api.post('/api/candidates', candidateData);
    return response.data;
  },

  // Actualizar un candidato
  updateCandidate: async (id: number, candidateData: Partial<CandidateFormData>): Promise<Candidate> => {
    const response = await api.put(`/api/candidates/${id}`, candidateData);
    return response.data;
  },

  // Eliminar un candidato
  deleteCandidate: async (id: number): Promise<void> => {
    await api.delete(`/api/candidates/${id}`);
  },

  // Publicar un candidato (cambiar estado a ACTIVE)
  publishCandidate: async (id: number): Promise<Candidate> => {
    const response = await api.post(`/api/candidates/${id}/publish`);
    return response.data;
  },

  // Subir CV
  uploadCV: async (id: number, file: File): Promise<Candidate> => {
    const formData = new FormData();
    formData.append('cv', file);
    
    const response = await api.post(`/api/candidates/${id}/cv`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  }
};

export default api; 