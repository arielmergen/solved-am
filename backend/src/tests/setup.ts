import { PrismaClient } from '@prisma/client';
import { app } from '../index';

const prisma = new PrismaClient();

beforeAll(async () => {
  // Limpiar la base de datos antes de los tests
  await prisma.candidateHistory.deleteMany();
  await prisma.education.deleteMany();
  await prisma.workExperience.deleteMany();
  await prisma.candidate.deleteMany();

  // Silenciar console.error durante los tests
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(async () => {
  await prisma.$disconnect();

  // Restaurar console.error
  jest.restoreAllMocks();
}); 