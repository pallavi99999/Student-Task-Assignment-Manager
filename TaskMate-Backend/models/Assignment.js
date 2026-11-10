const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter an assignment title"],
      trim: true
    },
    subject: {
      type: String,
      required: [true, "Please enter a subject"],
      trim: true,
      maxlength: [100, "Subject cannot exceed 100 characters"]
    },
    description: {
      type: String,
      trim: true,
      default: ""
    },
    dueDate: {
      type: Date,
      required: [true, "Please provide a due date"]
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium"
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assignment", assignmentSchema);
