const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const resetRequest = new Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
  },
});
export default mongoose.models.ResetRequest ||
  mongoose.model("ResetRequest", resetRequest);
