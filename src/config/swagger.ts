
import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.3',

    info: {
      title: 'Restaurant Order Sync API',
      version: '1.0.0',
      description: `
Restaurant Order Synchronization API.

### Authentication and Authorization

Authentication and authorization are not implemented in this assignment.
      `,
    },

    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local development server',
      },
    ],

    tags: [
      {
        name: 'Orders',
        description: 'Restaurant order management',
      },
    ],

    components: {
      schemas: {
        OrderItem: {
          type: 'object',
          required: ['name', 'qte'],
          properties: {
            name: {
              type: 'string',
              example: 'Margherita Pizza',
            },
            qte: {
              type: 'integer',
              minimum: 1,
              example: 2,
            }
          },
        },

        Order: {
          type: 'object',
          required: [
            'id',
            'items',
            'totalAmount',
            'status',
            'createdAt',
            'updatedAt',
          ],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            items: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/OrderItem',
              },
            },
            totalAmount: {
              type: 'number',
              example: 2400,
            },
            status: {
              type: 'string',
              enum: ['new', 'preparing', 'ready', 'served'],
            },
            createdAt: {
              type: 'integer',
              format: 'int64',
            },
            updatedAt: {
              type: 'integer',
              format: 'int64',
            },
          },
        },
      },
    },
  },

  apis: ['./src/routes/**/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
