const dotenv = require("dotenv")
dotenv.config()
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const router = require("express").Router()
const Product = require('../models/Product')

const YOUR_DOMAIN = 'http://localhost:3000/checkout';

router.post('/create-checkout-session', async (req, res) => {
    // const products = await Product.find({})
    // const items = await req.body.items
    // const filteredLineItems = products.filter((product, index) => product.id ===items[index].id)
    // const lineItems = filteredLineItems.map(product => {
    //     return {
    //         price: product.price,
    //         quantity: req.body.items.quantity
    //     }
    // })
    try {
        const session = await stripe.checkout.sessions.create({
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'T-shirt',
                    },
                    unit_amount: 2010,
                },
                quantity: 1,
            }],
            payment_method_types: [
                'card',
            ],
            mode: 'payment',
            success_url: `${YOUR_DOMAIN}?success=true`,
            cancel_url: `${YOUR_DOMAIN}?canceled=true`,
        });
        res.status(200).json({url:session.url})
    } catch (er) {
        res.status(500).json({ error: er.message })
    }


});

module.exports = router