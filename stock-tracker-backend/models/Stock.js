const mongoose = require("mongoose");

const StockSchema = new mongoose.Schema({
  symbol: { type: String, required: true, unique: true },
  name: { type: String, required: true },
});

module.exports = mongoose.model("Stock", StockSchema);
