const Razorpay = require('razorpay');
const Order = require('../models/order')
const User = require('../models/user')
const userController = require('./user')
const { generateAccessToken } = require('./user'); // Import the function

const purchasepremium =async (req, res) => {
    try {
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        const amount = 2500;

        rzp.orders.create({amount, currency: "INR"}, async(err, order) => {
            if(err) {
                return res.status(500).json({ message: 'Failed to create order', err });
            }

            const newOrder = new Order({
                userId: req.user._id,
                orderid: order.id,
                status: 'PENDING'
            });

            await newOrder.save();
           
            return res.status(201).json({ order, key_id: rzp.key_id });
        })
    } catch(err){
        console.log(err);
        res.status(403).json({ message: 'Sometghing went wrong', error: err})
    }
}

 const updateTransactionStatus = async (req, res ) => {
    try {
        const userId = req.user._id;
        const { payment_id, order_id} = req.body;
        const order  = await Order.findOne( {orderid : order_id}) //2
        if (!order) {
            console.error("Order not found for order_id:", order_id);
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        order.paymentid = payment_id;
        order.status = 'SUCCESSFUL';


        Promise.all([order.save(),
            User.findByIdAndUpdate(userId, { ispremiumuser: true })
         ]) 

            // Generate a new JWT token
        const token = generateAccessToken(userId, undefined, true);  // Token with premium user status

        return res.status(202).json({
            success: true,
            message: "Transaction Successful",
            token: token,  // Ensure the token is being returned
        })
        }            
        catch (err) {
        console.log(err);
        res.status(403).json({ error: err, message: 'Sometghing went wrong' })
    }
}

module.exports = {
    purchasepremium,
    updateTransactionStatus
}