const mongoose = require('mongoose');

var readingsSchema = new mongoose.Schema({
  no:  Number,
  SEVolt_Avg: Number,
  SEVolt_2_Avg: Number,
  SEVolt_3_Avg: Number,
  SEVolt_2_Tot: Number,
  SEVolt_3_Tot: Number,
  'SEVolt_4_Avg(2)': Number,
  'SEVolt_4_Avg(3)': Number,
  'SEVolt_4_Avg(4)': Number,
  'SEVolt_4_Avg(5)': Number,
  'SEVolt_4_Avg(6)': Number,
  'SEVolt_4_Avg(7)': Number,
  'SEVolt_4_Avg(8)': Number,
  'SEVolt_4_Avg(9)': Number,
  'SEVolt_4_Avg(10)': Number,
  'SEVolt_4_Avg(11)': Number,
  'SEVolt_4_Avg(12)': Number,
  'SEVolt_4_Avg(13)': Number,
  PTemp_C_Avg: Number,
  time: { type: Date, default: Date.now },
});

exports.ReadingsModel = mongoose.model('Readings', readingsSchema);