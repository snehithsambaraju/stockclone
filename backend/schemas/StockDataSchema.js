const mongoose = require("mongoose");

const StockDataSchema = new mongoose.Schema({
  symbol: { type: String, required: true, index: true },
  date: { type: Date, required: true, index: true },
  open: { type: Number, required: true },
  high: { type: Number, required: true },
  low: { type: Number, required: true },
  close: { type: Number, required: true },
  volume: { type: Number, required: true },
  // Technical indicators
  rsi: Number,
  macd: Number,
  macd_signal: Number,
  macd_hist: Number,
  sma_20: Number,
  sma_50: Number,
  ema_12: Number,
  bb_upper: Number,
  bb_lower: Number,
  // Metadata
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Compound index for efficient queries
StockDataSchema.index({ symbol: 1, date: -1 });

module.exports = { StockDataSchema };

