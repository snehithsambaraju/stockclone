const mongoose = require("mongoose");
const { OrdersSchema } = require("../schemas/OrdersSchema");

if (!OrdersSchema) {
  throw new Error(
    "OrdersSchema is undefined. Check `backend/schemas/OrdersSchema.js` exports."
  );
}

const OrdersModel =
  mongoose.models.orders || mongoose.model("orders", OrdersSchema);

module.exports = { OrdersModel };
