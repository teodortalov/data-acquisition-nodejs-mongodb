const mongoose = require('mongoose');

var readingsSchema = new mongoose.Schema({
  no:  Number,
  voltage1: Number,
  time: { type: Date, default: Date.now },
});

exports.ReadingsModel = mongoose.model('Readings', readingsSchema);