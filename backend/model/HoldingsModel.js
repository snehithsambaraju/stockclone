const mongoose = require("mongoose");
const { HoldingsSchema } = require("../schemas/HoldingsSchema");

const HoldingsModel = mongoose.model("holdings", HoldingsSchema);

module.exports = { HoldingsModel };