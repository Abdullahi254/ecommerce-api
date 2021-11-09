const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv")
const cors = require("cors")

const userRoute = require('./routes/user')
const authRoute = require('./routes/auth')
const productRoute = require('./routes/product')
const cartRoute = require('./routes/cart')
const orderRoute = require('./routes/order')
const paymentRoute = require('./routes/payment')
dotenv.config()

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("DB connected successfully!")
    }).catch(er => {
        console.log(er)
    })


app.use(express.json())
app.use(cors())
app.use("/api/uploads",express.static("uploads"))
app.use("/api/auth",authRoute)
app.use("/api/users",userRoute)
app.use("/api/products",productRoute)
app.use("/api/carts",cartRoute)
app.use("/api/orders",orderRoute)
app.use("/api/payment",paymentRoute)


app.listen(process.env.PORT || 5000, () => {
    console.log("Server running at port 5000")
})