
import { body, param } from "express-validator";
import { ORDER_STATUSES } from "../../types/order.type";

export const GetOrderValidator = [
  param("id")
    .isUUID()
    .withMessage("Order ID must be a valid UUID"),
];

export const CreateOrderValidator = [
  body("id")
    .optional()
    .isUUID()
    .withMessage("Order ID must be a valid UUID"),

  body("items")
    .exists()
    .isArray({ min: 1 })
    .withMessage("items must be a non-empty array"),

  body("items.*.name")
    .exists({ checkFalsy: true })
    .isString()
    .withMessage("Item name is required"),

  body("items.*.quantity")
    .exists()
    .isInt({ min: 1 })
    .withMessage("Item quantity must be a positive integer"),

  body("items.*.unitPrice")
    .exists()
    .isInt({ min: 0 })
    .withMessage("Item unitPrice must be a non-negative integer"),

  body("totalAmount")
    .exists()
    .isInt({ min: 0 })
    .withMessage("totalAmount must be a non-negative integer"),
    body("status")
  .optional()
  .isIn(ORDER_STATUSES)
  .withMessage("Invalid order status"),
];

export const UpdateOrderStatusValidator = [
  param("id")
    .isUUID()
    .withMessage("Order ID must be a valid UUID"),

  body("status")
    .exists()
    .isIn(["new", "preparing", "ready", "served"])
    .withMessage("Invalid order status"),
];
