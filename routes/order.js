const router = require("express").Router()
const Order = require("../models/Order")
const { verifyTokenAndAdmin, verifyTokenAndAuthorization, verifyToken} = require('./verifyToken')

//create
router.post("/", verifyToken, async (req, res) => {
    const newOrder = new Order({
        userId:req.user.id,
        ...req.body
    })
    try {
        const savedOrder = await newOrder.save()
        res.status(200).json(savedOrder)
    } catch (er) {
        res.status(500).json(er)
    }
})

//update
router.put("/:orderId", verifyTokenAndAdmin, async (req, res) => {

    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.orderId, {
            $set: req.body
        }, { new: true })
        res.status(201).json(updatedOrder)

    } catch (er) {
        res.status(500).json(er)
    }
})

//delete
router.delete("/:orderId", verifyTokenAndAdmin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId)
        if (order) {
            await Order.findByIdAndDelete(req.params.orderId)
            res.status(200).json("Order has been deleted...")
        }
        else {
            res.status(400).json("Order not found!")
        }

    } catch (er) {
        res.status(500).json(er)
    }
})

//get specific order
router.get("/find/:id/:orderId", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const order = await Order.findOne({
            userId: req.params.id,
            _id:req.params.orderId
        })
        res.status(200).json(order)
    } catch (er) {
        res.status(500).json(er)
    }
})

//get all orders of a user
router.get("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const order = await Order.find({
            userId: req.params.id,
        })
        res.status(200).json(order)
    } catch (er) {
        res.status(500).json(er)
    }
})


//get all orders
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const orders = await Order.find()
        res.status(200).json(orders)
    } catch (er) {
        res.status(500).json(er)
    }

})

//stats
router.get("/income",verifyTokenAndAdmin,async(req,res)=>{
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth()-1))
    const previousMonth = new Date( new Date().setMonth(lastMonth.getMonth()-1))

    try{
        const income = await Order.aggregate([
            {
                $match:{createdAt:{$gte:previousMonth}}
            },
            {
                $project:{
                    month:{$month:"$createdAt"},
                    sales:"$amount"
                }
            },
            {
                $group:{
                    _id:"$month",
                    total:{$sum:"$sales"}
                }
            }
        ])
        res.status(200).json(income)
    }catch(er){
        res.status(500).json(er)
    }
})

module.exports = router