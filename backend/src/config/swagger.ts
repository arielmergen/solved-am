import swaggerJSDoc from 'swagger-jsdoc';
import { version } from '../../package.json';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gestión de Candidatos',
      version,
      description: 'API para gestionar candidatos, su información personal, historial y documentos',
      contact: {
        name: 'Equipo de Desarrollo',
        email: 'desarrollo@example.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: '/api',
        description: 'Servidor de desarrollo'
      }
    ],
    components: {
      schemas: {
        Candidate: {
          type: 'object',
          required: ['firstName', 'lastName', 'email'],
          properties: {
            id: {
              type: 'integer',
              example: 1,
              description: 'ID único del candidato'
            },
            firstName: {
              type: 'string',
              description: 'Nombre del candidato'
            },
            lastName: {
              type: 'string',
              description: 'Apellido del candidato'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Correo electrónico del candidato'
            },
            phone: {
              type: 'string',
              example: "+1234567890",
              description: 'Número de teléfono del candidato'
            },
            address: {
              type: 'string',
              description: 'Dirección del candidato'
            },
            status: {
              type: 'string',
              enum: ['DRAFT', 'ACTIVE', 'INACTIVE'],
              description: 'Estado actual del candidato'
            },
            cvPath: {
              type: 'string',
              description: 'Ruta al CV del candidato'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación del registro'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de última actualización'
            }
          }
        },
        CandidateHistory: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único del registro histórico'
            },
            candidateId: {
              type: 'integer',
              description: 'ID del candidato relacionado'
            },
            changeType: {
              type: 'string',
              enum: ['CREATE', 'UPDATE', 'DELETE'],
              description: 'Tipo de cambio realizado'
            },
            changes: {
              type: 'string',
              description: 'Cambios realizados en formato JSON'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha del cambio'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Mensaje de error'
            }
          }
        }
      },
      responses: {
        BadRequest: {
          description: 'Solicitud inválida',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        NotFound: {
          description: 'Recurso no encontrado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        ServerError: {
          description: 'Error interno del servidor',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts']
};

export const swaggerSpec = swaggerJSDoc(options); 