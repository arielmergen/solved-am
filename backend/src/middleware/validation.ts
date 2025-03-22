import { Request, Response, NextFunction } from 'express';

export const validateCandidate = (req: Request, res: Response, next: NextFunction) => {
  // Para creación, requerir campos obligatorios
  if (req.method === 'POST') {
    const { firstName, lastName, email, phone } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        error: 'First name, last name and email are required'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email format'
      });
    }

    if (phone) {
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({
          error: 'Invalid phone format'
        });
      }
    }
  }

  // Para actualización, validar solo los campos proporcionados
  if (req.method === 'PUT') {
    const { email, phone } = req.body;
    
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error: 'Invalid email format'
        });
      }
    }

    if (phone) {
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({
          error: 'Invalid phone format'
        });
      }
    }
  }

  next();
}; 