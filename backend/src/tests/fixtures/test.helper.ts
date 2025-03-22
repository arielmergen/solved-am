import request, { Response, SuperTest, Test } from 'supertest';
import { Express } from 'express';
import { app, prisma } from '../../index';
import { Prisma } from '@prisma/client';
import { CandidateStatus } from '../../types/candidate.types';
import path from 'path';

export type TestResponse = Response & {
  body: any;
};

export class TestHelper {
  private app: Express;

  constructor() {
    this.app = app;
  }

  /**
   * Obtiene una nueva instancia de supertest
   */
  private request(): SuperTest<Test> {
    return request(this.app) as unknown as SuperTest<Test>;
  }

  /**
   * Realiza una petición POST
   * @param url URL del endpoint
   */
  post(url: string): Test {
    return this.request().post(url);
  }

  /**
   * Realiza una petición GET
   * @param url URL del endpoint
   */
  get(url: string): Test {
    return this.request().get(url);
  }

  /**
   * Realiza una petición PUT
   * @param url URL del endpoint
   */
  put(url: string): Test {
    return this.request().put(url);
  }

  /**
   * Realiza una petición DELETE
   * @param url URL del endpoint
   */
  delete(url: string): Test {
    return this.request().delete(url);
  }

  /**
   * Sube un archivo
   * @param url URL del endpoint
   * @param fieldName Nombre del campo del archivo
   * @param filePath Ruta al archivo
   */
  uploadFile(url: string, fieldName: string, filePath: string): Test {
    return this.request()
      .post(url)
      .attach(fieldName, filePath);
  }

  /**
   * Crea un candidato de prueba
   * @param overrides Datos opcionales para sobrescribir los valores por defecto
   */
  async createTestCandidate(overrides: Partial<Prisma.CandidateCreateInput> = {}) {
    const defaultData = {
      firstName: 'John',
      lastName: 'Doe',
      email: `test.${Date.now()}.${Math.random()}@example.com`,
      phone: '+1234567890',
      status: CandidateStatus.DRAFT
    };

    try {
      return await prisma.candidate.create({
        data: { ...defaultData, ...overrides }
      });
    } catch (error) {
      console.error('Failed to create test candidate:', error);
      throw error;
    }
  }

  /**
   * Limpia los datos de prueba
   */
  async cleanup() {
    try {
      await prisma.$transaction([
        prisma.candidateHistory.deleteMany(),
        prisma.candidate.deleteMany()
      ]);
    } catch (error) {
      console.error('Cleanup failed:', error);
      throw error;
    }
  }
} 