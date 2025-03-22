import axios from 'axios';
import { Candidate } from '../types/candidate.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://backend:3010';

const api = {
  candidates: {
    getAll: async (): Promise<Candidate[]> => {
      const response = await axios.get(`${API_URL}/api/candidates`);
      return response.data;
    },

    getById: async (id: number): Promise<Candidate> => {
      const response = await axios.get(`${API_URL}/api/candidates/${id}`);
      return response.data;
    },

    create: async (candidate: Omit<Candidate, 'id'>): Promise<Candidate> => {
      const response = await axios.post(`${API_URL}/api/candidates`, candidate);
      return response.data;
    },

    update: async (id: number, candidate: Candidate): Promise<Candidate> => {
      const response = await axios.put(`${API_URL}/api/candidates/${id}`, candidate);
      return response.data;
    },

    delete: async (id: number): Promise<void> => {
      await axios.delete(`${API_URL}/api/candidates/${id}`);
    }
  }
};

export default api; 