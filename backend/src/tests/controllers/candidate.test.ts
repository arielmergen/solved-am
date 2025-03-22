import { TestHelper, TestResponse } from '../fixtures/test.helper';
import { prisma } from '../../index';
import path from 'path';
import fs from 'fs';
import { CandidateStatus } from '../../types/candidate.types';
import request from 'supertest';
import { app } from '../../index';

describe('Candidate Controller Tests', () => {
  const testHelper = new TestHelper();
  const TEST_FILES_DIR = path.join(__dirname, '../test-files');
  const TEST_FILE_PATH = path.join(TEST_FILES_DIR, 'test.pdf');

  beforeAll(() => {
    if (!fs.existsSync(TEST_FILES_DIR)) {
      fs.mkdirSync(TEST_FILES_DIR, { recursive: true });
    }
    fs.writeFileSync(TEST_FILE_PATH, 'test content');
  });

  beforeEach(async () => {
    await testHelper.cleanup();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    try {
      if (fs.existsSync(TEST_FILE_PATH)) {
        fs.unlinkSync(TEST_FILE_PATH);
      }
      if (fs.existsSync(TEST_FILES_DIR)) {
        fs.rmSync(TEST_FILES_DIR, { recursive: true, force: true });
      }
    } catch (error) {
      console.error('Error cleaning up test files:', error);
    }
  });

  describe('Basic CRUD Operations', () => {
    it('should create a new candidate', async () => {
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: `test.${Date.now()}.${Math.random()}@example.com`,
        phone: '+1234567890',
        status: CandidateStatus.DRAFT,
      };
      const res = await testHelper
        .post('/api/candidates')
        .send(candidateData)
        .expect(201);

      expect(res.body).toHaveProperty('id');
      expect(res.body.firstName).toBe(candidateData.firstName);
      expect(res.body.status).toBe(CandidateStatus.DRAFT);
    });

    it('should get a candidate by id', async () => {
      const candidate = await testHelper.createTestCandidate();
      const res = await testHelper
        .get(`/api/candidates/${candidate.id}`)
        .expect(200);

      expect(res.body.id).toBe(candidate.id);
    });

    it('should update a candidate', async () => {
      const candidate = await testHelper.createTestCandidate();
      const updateData = { firstName: 'Jane' };

      const res = await testHelper
        .put(`/api/candidates/${candidate.id}`)
        .send(updateData)
        .expect(200);

      expect(res.body.firstName).toBe(updateData.firstName);
    });

    it('should delete a candidate', async () => {
      const candidate = await testHelper.createTestCandidate();
      await testHelper.delete(`/api/candidates/${candidate.id}`).expect(204);
    });
  });

  describe('File Operations', () => {
    it('should handle CV upload', async () => {
      const candidate = await testHelper.createTestCandidate();
      const res = await testHelper
        .uploadFile(`/api/candidates/${candidate.id}/cv`, 'cv', TEST_FILE_PATH)
        .expect(200);

      expect(res.body.candidate.cvPath).toBeTruthy();
    });
  });

  describe('Error Handling', () => {
    it('should handle duplicate email', async () => {
      const candidate = await testHelper.createTestCandidate();
      await testHelper
        .post('/api/candidates')
        .send({
          ...candidate,
          id: undefined,
        })
        .expect(400)
        .expect((res: TestResponse) => {
          expect(res.body.error).toBe('Email already exists');
        });
    });

    it('should handle not found', async () => {
      await testHelper.get('/api/candidates/999').expect(404);
    });

    it('should handle invalid data', async () => {
      await testHelper
        .post('/api/candidates')
        .send({
          email: 'invalid-email'
        })
        .expect(400)
        .expect((res: TestResponse) => {
          expect(res.body.error).toBe('First name, last name and email are required');
        });
    });
  });

  describe('Validation Tests', () => {
    it('should reject null or undefined required fields', async () => {
      const invalidData = {
        firstName: null,
        lastName: undefined,
        email: 'test@example.com',
        phone: '+1234567890'
      };
      
      const response = await testHelper
        .post('/api/candidates')
        .send(invalidData)
        .expect(400);
      
      expect(response.body.error).toBe('First name, last name and email are required');
    });

    it('should reject empty string fields', async () => {
      const invalidData = {
        firstName: '',
        lastName: '',
        email: 'test@example.com',
        phone: '+1234567890'
      };
      
      const response = await testHelper
        .post('/api/candidates')
        .send(invalidData)
        .expect(400);
      
      expect(response.body.error).toBe('First name, last name and email are required');
    });

    it('should validate email format', async () => {
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email-format',
        phone: '+1234567890',
        status: CandidateStatus.DRAFT
      };
      
      const response = await testHelper
        .post('/api/candidates')
        .send(invalidData)
        .expect(400);
      
      expect(response.body.error).toBe('Invalid email format');
    });

    it('should validate phone format', async () => {
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'valid@email.com',
        phone: 'invalid-phone',
        status: CandidateStatus.DRAFT
      };
      
      const response = await testHelper
        .post('/api/candidates')
        .send(invalidData)
        .expect(400);
      
      expect(response.body.error).toBe('Invalid phone format');
    });
  });

  describe('Status Management', () => {
    it('should update candidate status', async () => {
      const candidate = await testHelper.createTestCandidate();
      const updateData = { status: CandidateStatus.ACTIVE };
      
      const res = await testHelper
        .put(`/api/candidates/${candidate.id}`)
        .send(updateData)
        .expect(200);
      
      expect(res.body.status).toBe(CandidateStatus.ACTIVE);
    });

    it('should validate invalid status transition', async () => {
      const candidate = await testHelper.createTestCandidate({ status: CandidateStatus.INACTIVE });
      const updateData = { status: CandidateStatus.ACTIVE };
      
      const response = await testHelper
        .put(`/api/candidates/${candidate.id}`)
        .send(updateData)
        .expect(400);
      
      expect(response.body.error).toBe(`Invalid status transition from ${CandidateStatus.INACTIVE} to ${CandidateStatus.ACTIVE}`);
    });

    it('should track history of changes', async () => {
      const candidate = await testHelper.createTestCandidate();
      const updateData = {
        firstName: 'Jane',
        status: CandidateStatus.ACTIVE
      };
      
      const res = await testHelper
        .put(`/api/candidates/${candidate.id}`)
        .send(updateData)
        .expect(200);
      
      expect(res.body.history).toBeTruthy();
      expect(res.body.history).toHaveLength(1);
      
      const historyEntry = res.body.history[0];
      expect(historyEntry.candidateId).toBe(candidate.id);
      expect(historyEntry.changeType).toBe('UPDATE');
      
      const changes = JSON.parse(historyEntry.changes);
      expect(changes).toHaveLength(2);
      
      const firstNameChange = changes.find((c: any) => c.field === 'firstName');
      expect(firstNameChange).toBeTruthy();
      expect(firstNameChange.newValue).toBe('Jane');
      
      const statusChange = changes.find((c: any) => c.field === 'status');
      expect(statusChange).toBeTruthy();
      expect(statusChange.newValue).toBe(CandidateStatus.ACTIVE);
    });

    it('should track status changes in history', async () => {
      const candidate = await testHelper.createTestCandidate({ status: CandidateStatus.DRAFT });
      
      const res1 = await testHelper
        .put(`/api/candidates/${candidate.id}`)
        .send({ status: CandidateStatus.ACTIVE });

      expect(res1.status).toBe(200);
      const changes1 = JSON.parse(res1.body.history[0].changes);
      expect(changes1).toContainEqual({
        field: 'status',
        oldValue: CandidateStatus.DRAFT,
        newValue: CandidateStatus.ACTIVE
      });

      const res2 = await testHelper
        .put(`/api/candidates/${candidate.id}`)
        .send({ status: CandidateStatus.INACTIVE });

      expect(res2.status).toBe(200);
      const changes2 = JSON.parse(res2.body.history[0].changes);
      expect(changes2).toContainEqual({
        field: 'status',
        oldValue: CandidateStatus.ACTIVE,
        newValue: CandidateStatus.INACTIVE
      });
    });

    it('should maintain chronological order in history', async () => {
      const candidate = await testHelper.createTestCandidate({ 
        status: CandidateStatus.DRAFT,
        firstName: 'John',
        lastName: 'Doe'
      });
      
      // Primera actualización: cambio de nombre
      const res1 = await testHelper
        .put(`/api/candidates/${candidate.id}`)
        .send({ firstName: 'Jane' });

      expect(res1.status).toBe(200);
      const changes1 = JSON.parse(res1.body.history[0].changes);
      expect(changes1).toContainEqual({
        field: 'firstName',
        oldValue: 'John',
        newValue: 'Jane'
      });

      // Esperamos un momento para asegurar diferentes timestamps
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Segunda actualización: cambio de estado
      const res2 = await testHelper
        .put(`/api/candidates/${candidate.id}`)
        .send({ status: CandidateStatus.ACTIVE });

      expect(res2.status).toBe(200);
      const changes2 = JSON.parse(res2.body.history[0].changes);
      expect(changes2).toContainEqual({
        field: 'status',
        oldValue: CandidateStatus.DRAFT,
        newValue: CandidateStatus.ACTIVE
      });

      // Obtener el historial completo
      const historyRes = await testHelper
        .get(`/api/candidates/${candidate.id}`)
        .expect(200);

      const history = historyRes.body.history;
      expect(history).toHaveLength(2);
      
      // Verificar orden cronológico (el más reciente primero)
      const firstChangeArray = JSON.parse(history[0].changes);
      const secondChangeArray = JSON.parse(history[1].changes);
      
      // El cambio más reciente (status) debería estar primero
      expect(firstChangeArray[0].field).toBe('firstName');
      expect(secondChangeArray[0].field).toBe('status');
      
      // Verificar timestamps
      const timestamp1 = new Date(history[0].createdAt).getTime();
      const timestamp2 = new Date(history[1].createdAt).getTime();
      expect(timestamp1).toBeLessThan(timestamp2);
    });
  });

  describe('Extended File Operations', () => {
    it('should handle invalid file type for CV', async () => {
      const candidate = await testHelper.createTestCandidate();
      const invalidFilePath = path.join(TEST_FILES_DIR, 'test.txt');
      fs.writeFileSync(invalidFilePath, 'invalid content');

      const response = await testHelper
        .uploadFile(`/api/candidates/${candidate.id}/cv`, 'cv', invalidFilePath)
        .expect(400);
      
      expect(response.body.error).toBe('Invalid file type. Only PDF and DOC/DOCX files are allowed');

      fs.unlinkSync(invalidFilePath);
    });

    it('should handle missing file in upload request', async () => {
      const candidate = await testHelper.createTestCandidate();
      
      await testHelper
        .post(`/api/candidates/${candidate.id}/cv`)
        .expect(400)
        .expect((res: TestResponse) => {
          expect(res.body.error).toContain('No file uploaded');
        });
    });
  });

  describe('Extended Update Operations', () => {
    it('should update multiple fields at once', async () => {
      const candidate = await testHelper.createTestCandidate();
      const updateData = {
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+9876543210'
      };
      
      const res = await testHelper
        .put(`/api/candidates/${candidate.id}`)
        .send(updateData)
        .expect(200);
      
      expect(res.body.firstName).toBe(updateData.firstName);
      expect(res.body.lastName).toBe(updateData.lastName);
      expect(res.body.phone).toBe(updateData.phone);
    });
  });

  describe('CV Upload Tests', () => {
    it('should handle file size exceeding limit', async () => {
      const largeBuffer = Buffer.alloc(6 * 1024 * 1024); // 6MB
      const res = await request(app)
        .post('/api/candidates/1/cv')
        .attach('cv', largeBuffer, 'test.pdf');
      
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('File too large');
    });

    it('should handle missing file in request', async () => {
      const res = await request(app)
        .post('/api/candidates/1/cv')
        .send({});
      
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('No file uploaded');
    });

    it('should handle non-existent candidate for CV upload', async () => {
      const buffer = Buffer.from('test file content');
      const res = await request(app)
        .post('/api/candidates/999999/cv')
        .attach('cv', buffer, 'test.pdf');
      
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Candidate not found');
    });
  });

  describe('Field Validation Tests', () => {
    it('should reject fields exceeding maximum length', async () => {
      const longString = 'a'.repeat(256);
      const res = await request(app)
        .put('/api/candidates/1')
        .send({
          firstName: longString
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('must be less than 255 characters');
    });

    it('should reject empty or whitespace-only fields', async () => {
      const res = await request(app)
        .post('/api/candidates')
        .send({
          firstName: '   ',
          lastName: 'Test',
          email: 'test@example.com',
          phone: '1234567890'
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('firstName');
    });
  });

  describe('Status Transition Tests', () => {
    it('should reject invalid transition from INACTIVE to ACTIVE', async () => {
      const candidate = await testHelper.createTestCandidate({ status: CandidateStatus.INACTIVE });
      
      const res = await request(app)
        .put(`/api/candidates/${candidate.id}`)
        .send({ status: CandidateStatus.ACTIVE });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe(`Invalid status transition from ${CandidateStatus.INACTIVE} to ${CandidateStatus.ACTIVE}`);
    });

    it('should allow valid transition from DRAFT to ACTIVE', async () => {
      const candidate = await testHelper.createTestCandidate({ 
        status: CandidateStatus.DRAFT,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '1234567890'
      });
      
      const res = await request(app)
        .put(`/api/candidates/${candidate.id}`)
        .send({ status: CandidateStatus.ACTIVE });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe(CandidateStatus.ACTIVE);
    });

    it('should allow valid transition from ACTIVE to INACTIVE', async () => {
      const candidate = await testHelper.createTestCandidate({ status: CandidateStatus.ACTIVE });
      
      const res = await request(app)
        .put(`/api/candidates/${candidate.id}`)
        .send({ status: CandidateStatus.INACTIVE });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe(CandidateStatus.INACTIVE);
    });

    it('should track status changes in history', async () => {
      const candidate = await testHelper.createTestCandidate({ status: CandidateStatus.DRAFT });
      
      const res1 = await testHelper
        .put(`/api/candidates/${candidate.id}`)
        .send({ status: CandidateStatus.ACTIVE });

      expect(res1.status).toBe(200);
      const changes1 = JSON.parse(res1.body.history[0].changes);
      expect(changes1).toContainEqual({
        field: 'status',
        oldValue: CandidateStatus.DRAFT,
        newValue: CandidateStatus.ACTIVE
      });

      const res2 = await testHelper
        .put(`/api/candidates/${candidate.id}`)
        .send({ status: CandidateStatus.INACTIVE });

      expect(res2.status).toBe(200);
      const changes2 = JSON.parse(res2.body.history[0].changes);
      expect(changes2).toContainEqual({
        field: 'status',
        oldValue: CandidateStatus.ACTIVE,
        newValue: CandidateStatus.INACTIVE
      });
    });
  });
});
