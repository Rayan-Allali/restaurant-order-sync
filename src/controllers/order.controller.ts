import type { Request, Response } from "express";
import { OrderService } from "../service/order/order.service";
import { ErrorResponse, SuccessResponse } from "../utils/response";
import { HttpCodes } from "../config/Errors";
import type { OrderI, OrderStatus } from "../types/order.type";
import { OrderSyncWorker } from "../service/orderSyncWorker/orderSyncWorker";

export class OrderController {
  static async getOrders(_req: Request, res: Response) {
    try {
      const orders = await OrderService.getAllOrders();
      SuccessResponse(
        res,
        HttpCodes.OK.code,
        orders,
        "Orders fetched successfully",
      );
    } catch (error) {
      ErrorResponse(
        res,
        HttpCodes.InternalServerError.code,
        "Error fetching orders",
        error,
      );
    }
  }

  static async getOrderById(req: Request, res: Response) {
    const id = req.params.id as string;
    try {
      const order = await OrderService.getOrderById(id);
      if (order) {
        SuccessResponse(
          res,
          HttpCodes.OK.code,
          order,
          "Order fetched successfully",
        );
      } else {
        ErrorResponse(res, HttpCodes.NotFound.code, "Order not found", null);
      }
    } catch (error) {
      ErrorResponse(
        res,
        HttpCodes.InternalServerError.code,
        "Error fetching order",
        error,
      );
    }
  }

  static async createOrder(req: Request, res: Response) {
    const orderData: OrderI = req.body;
    try {
      const newOrder = await OrderService.createOrder(orderData);
      SuccessResponse(
        res,
        HttpCodes.Created.code,
        newOrder,
        "Order created successfully",
      );
    } catch (error) {
      ErrorResponse(
        res,
        HttpCodes.InternalServerError.code,
        "Error creating order",
        error,
      );
    }
  }
  static async updateOrder(req: Request, res: Response) {
    const id = req.params.id as string;
    const updateData: Partial<OrderI> = req.body;
    try {
      const updatedOrder = await OrderService.updateOrder(id, updateData);
      if (updatedOrder) {
        SuccessResponse(
          res,
          HttpCodes.OK.code,
          updatedOrder,
          "Order updated successfully",
        );
        return;
      }
      ErrorResponse(res, HttpCodes.NotFound.code, "Order not found", null);
    } catch (error) {
      ErrorResponse(
        res,
        HttpCodes.InternalServerError.code,
        "Error updating order",
        error,
      );
    }
  }
  static async updateOrderStatus(req: Request, res: Response) {
    const id = req.params.id as string;
    const { status } = req.body as { status: OrderStatus };

    try {
      const updatedOrder = await OrderService.updateOrderStatus(id, status);
      if (updatedOrder) {
        SuccessResponse(
          res,
          HttpCodes.OK.code,
          updatedOrder,
          "Order status updated successfully",
        );
        return;
      }
      ErrorResponse(res, HttpCodes.NotFound.code, "Order not found", null);
    } catch (error) {
      ErrorResponse(
        res,
        HttpCodes.InternalServerError.code,
        "Error updating order status",
        error,
      );
    }
  }
  static async getSyncStatus(_req: Request, res: Response) {
  const workerStatus = OrderSyncWorker.getStatus();
  const syncStats = await OrderService.getSyncStats();

  const status = workerStatus.isRunning
    ? 'syncing'
    : syncStats.pendingOrders > 0
      ? 'degraded'
      : 'healthy';

  return res.status(200).json({
    status,
    ...workerStatus,
    ...syncStats,
  });
}
}
