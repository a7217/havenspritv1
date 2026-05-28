import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IJob extends Document {
  title: string;
  project: string;
  location: string;
  salary: string;
  salaryFull: string;
  experience: string;
  vacancies: number;
  lastDate: string;
  shiftTiming: string;
  department: string;
  qualification: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  documents: string[];
  isActive: boolean;
  createdAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    title:            { type: String, required: true },
    project:          { type: String, default: "" },
    location:         { type: String, default: "" },
    salary:           { type: String, default: "" },
    salaryFull:       { type: String, default: "" },
    experience:       { type: String, default: "" },
    vacancies:        { type: Number, default: 1 },
    lastDate:         { type: String, default: "" },
    shiftTiming:      { type: String, default: "Full-Time, 9 AM - 6 PM" },
    department:       { type: String, default: "Government" },
    qualification:    { type: String, default: "" },
    description:      { type: String, default: "" },
    responsibilities: { type: [String], default: [] },
    qualifications:   { type: [String], default: [] },
    documents:        { type: [String], default: [] },
    isActive:         { type: Boolean, default: true },
  },
  { timestamps: true }
);

JobSchema.index({ isActive: 1, createdAt: -1 });
JobSchema.index({ department: 1 });
JobSchema.index({ location: 1 });

export const Job = models.Job || model<IJob>("Job", JobSchema);
