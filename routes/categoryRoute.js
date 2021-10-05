const express = require("express")
const router = express.Router()

const {getCategory, getCategoryById, postCategory, editCategory, deleteCategory} = require("../controllers/categoryController")
const { verifyToken, isAdmin } = require("../middlewares/auth")
const expressValidator = require("../middlewares/expressValidator")
const { categoryValidator } = require("../validators/categoryValidator")

router.get("/", getCategory)
router.get("/:catId", getCategoryById)

router.post("/create", categoryValidator, expressValidator, verifyToken, isAdmin, postCategory)

router.put("/:catId", categoryValidator, expressValidator, verifyToken, isAdmin, editCategory)

router.delete("/:catId", verifyToken, isAdmin, deleteCategory)

module.exports = router