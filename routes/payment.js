const express = require("express");
const paymentCtrl = require("../controller/payment");

// Middleware for JWT authentication
const jwtAuth = require("../middleware/jwtAuth");

// Create a router object from Express
const router = express.Router();

// Get, post công việc, yêu cầu xác thực JWT
router.post("/createpaymentsession", paymentCtrl.craeteSesion);
router.post("/createOrder", paymentCtrl.createOrder);
router.post("/verifypayment", jwtAuth, paymentCtrl.verifyPayment);

module.exports = router;
