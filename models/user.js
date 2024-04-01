const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdTests: [
    {
      testId: {
        type: Schema.Types.ObjectId,
        ref: "Test",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
  ],
  solvedTests: [
    {
      testId: {
        type: Schema.Types.ObjectId,
        ref: "Test",
      },
      score: Number,
    },
  ],
  otp: {
    type: String,
  },
});
export default mongoose.models.User || mongoose.model("User", userSchema);
