const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const testSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  questions: [
    {
      type: {
        type: String,
        required: true,
      },
      points: {
        type: Number,
        required: true,
      },
      questionText: {
        type: String,
        required: true,
      },
      options: {
        type: [String],
      },
      correctOption: {
        type: Number,
      },
    },
  ],
  totalPoints: Number,
  solved: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      questions: [Object],
      startTime: Number,
      endTime: Number,
      scoredPoints: Number,
    },
  ],
});

export default mongoose.models.Test || mongoose.model("Test", testSchema);
