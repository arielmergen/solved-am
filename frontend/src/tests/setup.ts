import { PrismaClient } from '@prisma/client';

// Limpiar la base de datos después de todas las pruebas
afterAll(async () => {
  const prisma = new PrismaClient();
  await prisma.candidateHistory.deleteMany();
  await prisma.candidate.deleteMany();
  await prisma.$disconnect();
}); 