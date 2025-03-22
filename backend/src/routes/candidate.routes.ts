import { Router } from 'express';
import {
  createCandidate,
  getCandidate,
  updateCandidate,
  deleteCandidate,
  getCandidates,
  uploadCV,
  publishCandidate
} from '../controllers/candidate.controller';
import { validateCandidate } from '../middleware/validation';
import { uploadCV as uploadCVMiddleware } from '../middleware/file';

const router = Router();

/**
 * @swagger
 * /candidates:
 *   post:
 *     summary: Crear un nuevo candidato
 *     tags: [Candidatos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Candidate'
 *     responses:
 *       201:
 *         description: Candidato creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Candidate'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/', validateCandidate, createCandidate);

/**
 * @swagger
 * /candidates:
 *   get:
 *     summary: Obtener todos los candidatos
 *     tags: [Candidatos]
 *     responses:
 *       200:
 *         description: Lista de candidatos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Candidate'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', getCandidates);

/**
 * @swagger
 * /candidates/{id}:
 *   get:
 *     summary: Obtener un candidato por ID
 *     tags: [Candidatos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del candidato
 *     responses:
 *       200:
 *         description: Detalles del candidato
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Candidate'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/:id', getCandidate);

/**
 * @swagger
 * /candidates/{id}:
 *   put:
 *     summary: Actualizar un candidato
 *     tags: [Candidatos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del candidato
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Candidate'
 *     responses:
 *       200:
 *         description: Candidato actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Candidate'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.put('/:id', validateCandidate, updateCandidate);

/**
 * @swagger
 * /candidates/{id}:
 *   delete:
 *     summary: Eliminar un candidato
 *     tags: [Candidatos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del candidato
 *     responses:
 *       200:
 *         description: Candidato eliminado exitosamente
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete('/:id', deleteCandidate);

/**
 * @swagger
 * /candidates/{id}/cv:
 *   post:
 *     summary: Subir CV para un candidato
 *     tags: [Candidatos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del candidato
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               cv:
 *                 type: string
 *                 format: binary
 *                 description: Archivo CV (PDF, DOC, DOCX)
 *     responses:
 *       200:
 *         description: CV subido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Candidate'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/:id/cv', uploadCVMiddleware, uploadCV);

/**
 * @swagger
 * /candidates/{id}/publish:
 *   post:
 *     summary: Publicar un candidato (cambiar estado a ACTIVE)
 *     tags: [Candidatos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del candidato
 *     responses:
 *       200:
 *         description: Candidato publicado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Candidate'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/:id/publish', publishCandidate);

export default router; 