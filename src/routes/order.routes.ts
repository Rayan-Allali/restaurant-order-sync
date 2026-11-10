import { Router } from 'express'
import { OrderController } from '../controllers/order.controller'


import { validatorMiddleware } from '../middlewares/validator.middleware'
import { CreateOrderValidator,GetOrderValidator, UpdateOrderStatusValidator } from '../service/order/order.validator'

const orderRouter = Router()
/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Retrieve all orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *   post:
 *     summary: Create a new order
 *     description: >
 *       Creates an order in the local SQLite database.
 *       Cloud synchronization happens asynchronously in the background.
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   $ref: '#/components/schemas/OrderItem'
 *           example:
 *             items:
 *               - name: Margherita Pizza
 *                 qte: 2
 *               - name: Coca Cola
 *                 qte: 1
 *             totalAmount: 2550
 *             status: new
 *     responses:
 *       201:
 *         description: Order created successfully and stored locally
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid order data
 *       500:
 *         description: Internal server error
 */
orderRouter.route('/').get(OrderController.getOrders)
.post(CreateOrderValidator, validatorMiddleware, OrderController.createOrder)

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Retrieve an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *       404:
 *         description: Order not found
 *
 *   put:
 *     summary: Update an order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Order not found
 */

orderRouter.route('/:id').get(GetOrderValidator, validatorMiddleware,OrderController.getOrderById)
.put(UpdateOrderStatusValidator, validatorMiddleware, OrderController.updateOrder)

/**
 * @swagger
 * /orders/status/{id}:
 *   put:
 *     summary: Update order status
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [new, preparing, ready, served]
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Order not found
 */
orderRouter.put('/status/:id',UpdateOrderStatusValidator, validatorMiddleware, OrderController.updateOrderStatus)

export default orderRouter
