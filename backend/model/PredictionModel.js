const mongoose = require("mongoose");
const { PredictionSchema } = require("../schemas/PredictionSchema");

const PredictionModel =
  mongoose.models.predictions || mongoose.model("predictions", PredictionSchema);

module.exports = { PredictionModel };

