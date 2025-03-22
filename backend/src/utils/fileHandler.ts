import { Request } from 'express';
import path from 'path';
import fs from 'fs';

export const handleFileUpload = (file: Express.Multer.File) => {
  const uploadDir = './uploads/cvs';
  
  // Asegurar que el directorio existe
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  return file.path;
}; 