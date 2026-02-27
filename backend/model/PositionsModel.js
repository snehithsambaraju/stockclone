const mongoose = require("mongoose");
const { PositionsSchema } = require("../schemas/PositionsSchema");

if (!PositionsSchema) {
  throw new Error(
    "PositionsSchema is undefined. Check `backend/schemas/PositionsSchema.js` exports."
  );
}

const PositionsModel =
  mongoose.models.positions || mongoose.model("positions", PositionsSchema);

module.exports = { PositionsModel };
