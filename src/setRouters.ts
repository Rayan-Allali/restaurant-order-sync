import type { Application } from 'express'
import orderRouter from './routes/order.routes'
import { swaggerSpec } from './config/swagger';

export default function SetRouters(app: Application) {
app.get('/api-docs.json', (_req, res) => {
  res.json(swaggerSpec);
});
app.use('/orders',orderRouter)
}