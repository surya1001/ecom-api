const express = require("express")
const morgan = require("morgan")
const dotenv = require("dotenv")
const cors = require("cors")
const db = require("./models")
require("./middlewares/expressValidator")

const app = express()
dotenv.config()
app.use(express.json())
app.use(morgan("dev"))
app.use(cors())

app.use("/api/user", require("./routes/userRoute"))
app.use("/api/category", require("./routes/categoryRoute"))
app.use("/api/product", require("./routes/productRoute"))
app.use("/api/order", require("./routes/orderRoute"))

const port = process.env.PORT || 8000
app.listen(port, async () => {
  console.log("Server running on port", port)
  await db.sequelize.authenticate()
  .then(() => console.log("DATABASE CONNECTED"))
  .catch(err => console.log(err))
})