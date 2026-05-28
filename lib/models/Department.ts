import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IDepartment extends Document {
  name: string;
  type: "job" | "tender" | "both";
  isActive: boolean;
  createdAt: Date;
}

const DepartmentSchema = new Schema<IDepartment>(
  {
    name:     { type: String, required: true, unique: true, trim: true },
    type:     { type: String, enum: ["job", "tender", "both"], default: "both" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Department = models.Department || model<IDepartment>("Department", DepartmentSchema);
