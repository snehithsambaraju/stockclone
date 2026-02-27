const mongoose = require("mongoose");

const PredictionSchema = new mongoose.Schema({
  symbol: { type: String, required: true, index: true },
  current_price: { type: Number, required: true },
  predicted_price: { type: Number, required: true },
  predicted_change: { type: Number, required: true }, // Percentage change
  confidence: { type: Number, required: true }, // 0-100
  prediction_date: { type: Date, required: true },
  prediction_for_date: { type: Date, required: true }, // Date being predicted
  model_version: { type: String, default: "1.0.0" },
  // Additional metadata
  technical_indicators: {
    rsi: Number,
    macd: Number,
    macd_signal: Number,
    sma_20: Number,
    sma_50: Number
  },
  createdAt: { type: Date, default: Date.now, expires: 86400 * 7 } // Auto-delete after 7 days
}, {
  timestamps: true
});

// Index for efficient queries
PredictionSchema.index({ symbol: 1, prediction_date: -1 });
PredictionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 }); // 7 days

module.exports = { PredictionSchema };

