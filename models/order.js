const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    paymentid: {
        type: String,
    },
    orderid: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
}); 

module.exports = mongoose.model('Order', orderSchema);