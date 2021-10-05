const express = require("express")
const router = express.Router()

const { placeOrder, getAllOrders, getAllOrderByUser, updatestatus } = require("../controllers/orderController")
const { verifyToken } = require("../middlewares/auth")
const expressValidator = require("../middlewares/expressValidator")
const { placeOrderValidator, updatestatusValidator } = require("../validators/orderValidator")

router.post("/placeOrder", verifyToken, placeOrderValidator, expressValidator, placeOrder)

router.get("/getAllOrders", verifyToken, getAllOrders)

router.get("/getAllOrderByUser", verifyToken, getAllOrderByUser)

router.post("/updatestatus/:id", updatestatusValidator, expressValidator, updatestatus)

module.exports = router