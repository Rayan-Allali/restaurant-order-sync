import type { Application } from 'express'
import orderRouter from './routes/order.routes'
import { swaggerSpec } from './config/swagger';
import { OrderController } from './controllers/order.controller';

export default function SetRouters(app: Application) {
app.get('/api-docs.json', (_req, res) => {
  res.json(swaggerSpec);
});
app.use('/orders',orderRouter)
app.get('/sync-status', OrderController.getSyncStatus);
}