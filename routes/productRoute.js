const express = require("express")
const router = express.Router()

const upload = require("../middlewares/upload")

const {getAllProducts, getProductById, searchProducts, postProduct, editProduct, deleteProduct} = require("../controllers/productController")
const { verifyToken, isSupervisor } = require("../middlewares/auth")
const expressValidator = require("../middlewares/expressValidator")
const { addproductValidator } = require("../validators/productValidator")

router.get("/", getAllProducts)
router.get("/:proId", getProductById)
router.get("/search/pro", searchProducts)

router.post("/create", upload.single("image"), addproductValidator, expressValidator, verifyToken, isSupervisor, postProduct)

router.put("/update/:proId", upload.single("image"), verifyToken, isSupervisor, editProduct)

router.delete("/delete/:proId", verifyToken, isSupervisor, deleteProduct)

module.exports = router