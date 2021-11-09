const router = require("express").Router()
const Product = require("../models/Product")
const { verifyTokenAndAdmin } = require('./verifyToken')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({ storage: storage })

//create
router.post("/", verifyTokenAndAdmin, upload.array('images', 5), async (req, res) => {
    const fileNames = req.files.map((file,index)=>(
        {
            color:req.body.color[index],
            image:file.filename
        }
    ))
    const newProduct = new Product({
        ...req.body,
        img: fileNames
    })
    try {
        const savedProduct = await newProduct.save()
        res.status(200).json(savedProduct)
    } catch (er) {
        if (er.code === 11000) {
            res.status(400).json("product already exists!")
        }
        else if (er.errors.price) {
            res.status(400).json(er.errors.price.message)
        }
        else if (er.errors.color) {
            res.status(400).json(er.errors.color.message)
        }
        else if (er.errors.size) {
            res.status(400).json(er.errors.size.message)
        }
        else if (er.errors.img) {
            res.status(400).json(er.errors.img.message)
        }
        else if (er.errors.desc) {
            res.status(400).json(er.errors.desc.message)
        }
        else if (er.errors.title) {
            res.status(400).json(er.errors.title.message)
        }
        else {
            res.status(500).json(er)
        }
    }
})

//update
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {

    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })
        res.status(201).json(updatedProduct)

    } catch (er) {
        res.status(500).json(er)
    }
})

//delete
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json("Product has been deleted...")
    } catch (er) {
        res.status(500).json(er)
    }
})

//get product
router.get("/find/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        res.status(200).json(product)
    } catch (er) {
        res.status(500).json(er)
    }
})

//get all products
router.get("/", async (req, res) => {
    const qNew = req.query.new
    const qCategory = req.query.cat

    try {
        let products
        if (qNew) {
            products = await Product.find().sort({ _id: -1 }).limit(5)
        }
        else if (qCategory) {
            products = await Product.find({
                categories: {
                    $in: [qCategory]
                }
            })
        }
        else {
            products = await Product.find()
        }
        res.status(200).json(products)
    } catch (er) {
        res.status(500).json(er)
    }
})


module.exports = router