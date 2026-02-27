const mongoose = require("mongoose");
const { UserSchema } = require("../schemas/UserSchema");

if (!UserSchema) {
  throw new Error(
    "UserSchema is undefined. Check `backend/schemas/UserSchema.js` exports."
  );
}

const UserModel =
  mongoose.models.users || mongoose.model("users", UserSchema);

module.exports = { UserModel };


