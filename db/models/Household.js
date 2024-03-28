const mongoose = require("mongoose");
const { Schema } = mongoose;

const calendarEntrySchema = new Schema({
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipe",
  },
  date: String,
  numberOfPeople: Number,
  isDisabled: Boolean,
});

const shoppingItem = new Schema({
  name: { type: String, required: true },
  quantity: { type: Number },
  unit: { type: String },
  isChecked: Boolean,
});

const householdSchema = new Schema({
  name: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  members: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      role: {
        type: String,
        required: true,
        enum: ["owner", "canWrite", "canRead"],
      },
    },
  ],
  settings: {
    weekdaysEnabled: {},
    mealsPerDay: Number,
    defaultNumberOfPeople: Number,
    defaultDiet: [String],
    numberOfRandomMeals: Number,
  },
  calendar: [calendarEntrySchema],
  shoppingList: [shoppingItem],
});

const Household =
  mongoose.models.Household || mongoose.model("Household", householdSchema);

module.exports = Household;
