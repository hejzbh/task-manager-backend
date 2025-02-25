import mongoose from "mongoose";
import { TITLE_MAX_LENGTH, DESC_MAX_LENGTH } from "constants/index.js";

export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export enum TaskStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN PROGRESS",
  COMPLETED = "COMPLETED",
}

// Task schema
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    maxLength: TITLE_MAX_LENGTH,
  },
  description: {
    type: String,
    maxLength: DESC_MAX_LENGTH,
    default: "",
  },
  status: {
    type: String,
    enum: [TaskStatus.PENDING, TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED],
    default: TaskStatus.PENDING,
  },
  dueDate: {
    type: Date,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create Task model and export

const Task = mongoose.model("Task", taskSchema);

export default Task;
