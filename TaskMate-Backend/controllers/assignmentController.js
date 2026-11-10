const Assignment = require("../models/Assignment");

// GET /api/assignments
const getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ dueDate: 1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch assignments" });
  }
};

// POST /api/assignments
const createAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.create(req.body);
    res.status(201).json(assignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET /api/assignments/:id
const getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    res.json(assignment);
  } catch (error) {
    res.status(400).json({ message: "Invalid assignment ID" });
  }
};

// PUT /api/assignments/:id
const updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.json(assignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/assignments/:id
const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.json({ message: "Assignment deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Invalid assignment ID" });
  }
};

module.exports = {
  getAssignments,
  createAssignment,
  getAssignmentById,
  updateAssignment,
  deleteAssignment
};
