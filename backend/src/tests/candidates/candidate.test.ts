import request from 'supertest';
import { app, prisma } from '../../index';
import path from 'path';
import fs from 'fs';

describe('Candidate Controller', () => {
  const testCandidate = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@test.com',
    phone: '1234567890'
  };

  beforeEach(async () => {
    // Limpiar la base de datos antes de cada test
    await prisma.candidateHistory.deleteMany();
    await prisma.education.deleteMany();
    await prisma.workExperience.deleteMany();
    await prisma.candidate.deleteMany();
  });

  describe('POST /api/candidates', () => {
    it('should create a new candidate', async () => {
      const res = await request(app)
        .post('/api/candidates')
        .send(testCandidate);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.firstName).toBe(testCandidate.firstName);
      expect(res.body.status).toBe('DRAFT');
    });
  });

  // ... resto del código de prueba ...
}); 