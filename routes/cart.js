const router = require("express").Router()
const Cart = require("../models/Cart")
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken')

//create
router.post("/", verifyToken, async (req, res) => {
    const newCart = new Cart({
        userId:req.user.id,
        ...req.body, 
    })
    try {
        const savedCart = await newCart.save()
        res.status(200).json(savedCart)
    } catch (er) {
        res.status(500).json(er)
    }
})

//update
router.put("/:id/:cartId", verifyTokenAndAuthorization, async (req, res) => {

    try {
        const updatedCart = await Cart.findByIdAndUpdate(req.params.cartId, {
            $set: req.body
        }, { new: true })
        res.status(201).json(updatedCart)

    } catch (er) {
        res.status(500).json(er)
    }
})

//delete
router.delete("/:id/:cartId", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cartId)
        if (cart) {
            await Cart.findByIdAndDelete(req.params.cartId)
            res.status(200).json("Cart has been deleted...")
        }
        else {
            res.status(400).json("Cart not found!")
        }

    } catch (er) {
        res.status(500).json(er)
    }
})

//get user cart
router.get("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const cart = await Cart.findOne({
            userId: req.params.id
        })
        res.status(200).json(cart)
    } catch (er) {
        res.status(500).json(er)
    }
})

//get all carts
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const carts = await Cart.find()
        res.status(200).json(carts)
    } catch (er) {
        res.status(500).json(er)
    }

})


module.exports = router