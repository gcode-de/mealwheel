const mongoose = require("mongoose");

const { Schema } = mongoose;

const feedbackSchema = new Schema({
  negativeFeedback: String,
  positiveFeedback: String,
  newFeatures: String,
});

const Feedback =
  mongoose.models.Feedback ||
  mongoose.model("Feedback", feedbackSchema, "feedbacks");

module.exports = Feedback;
