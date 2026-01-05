const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  deliveryAddress: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  items: [{
    id: Number,
    name: String,
    price: Number,
    quantity: Number
  }],
  totalAmount: { type: Number, required: true },
  cardNumber: { type: String, default: null },
  expiryDate: { type: String, default: null },
  cvv: { type: String, default: null },
  status: { type: String, default: 'completed', enum: ['completed', 'pending', 'failed'] },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);

