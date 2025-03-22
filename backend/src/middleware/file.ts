import multer from 'multer';
import path from 'path';
import { Request, Response, NextFunction } from 'express';

const storage = multer.diskStorage({
  destination: './uploads/cvs',
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF and DOC/DOCX files are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
}).single('cv');

export const uploadCV = (req: Request, res: Response, next: NextFunction) => {
  upload(req, res, (err: any) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
      }
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}; 