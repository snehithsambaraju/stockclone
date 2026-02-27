const mongoose = require("mongoose");
const { StockDataSchema } = require("../schemas/StockDataSchema");

const StockDataModel =
  mongoose.models.stockdata || mongoose.model("stockdata", StockDataSchema);

module.exports = { StockDataModel };

