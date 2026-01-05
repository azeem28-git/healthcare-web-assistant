const mongoose = require('mongoose');

const consultSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  specialty: { type: String, required: true },
  symptoms: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Consult', consultSchema);

