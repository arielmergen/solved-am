import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import multer from 'multer';
import * as dotenv from 'dotenv';
import * as path from 'path';
import candidateRouter from './routes/candidate.routes';
import { errorHandler } from './middleware/error.middleware';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

dotenv.config();
export const app = express();
export const prisma = new PrismaClient();

// Configuración de CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Configurar directorio de uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Ruta raíz
app.get('/', (req, res) => {
  res.status(200).send('Hello World!');
});

// Rutas
app.use('/api/candidates', candidateRouter);

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware de manejo de errores
app.use(errorHandler);

// Validar formato de teléfono
const validatePhoneFormat = (phone: string): boolean => {
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  return phoneRegex.test(phone);
};

// Solo iniciar el servidor si no estamos en modo test
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
