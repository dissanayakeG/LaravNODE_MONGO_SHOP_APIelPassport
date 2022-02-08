const express = require("express");
const router = express.Router();

const AuthCheck = require("../middleware/auth-check")
const OrderController = require("../controllers/orders");

router.get("/", OrderController.getAllOrders);

router.post("/", AuthCheck, OrderController.addNewOrder);

router.get("/:orderId", OrderController.getOrderById);

router.delete("/:orderId",AuthCheck, OrderController.deleteOrder);

module.exports = router;
