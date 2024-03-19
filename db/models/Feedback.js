const mongoose = require("mongoose");

const { Schema } = mongoose;

const feebackSchema = new Schema({
  negativeFeedback: String,
  positiveFeedback: String,
  newFeatures: String,
});

const Feedback =
  mongoose.models.Feedback || mongoose.model("feedback", feebackSchema);

module.exports = Feedback;
