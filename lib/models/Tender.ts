import mongoose, { Schema, Document, models, model } from "mongoose";

export interface ITender extends Document {
  projectId: string;
  projectName: string;
  clientDept: "PWD" | "Metro" | "NHAI";
  tenderRef: string;
  totalJobs: number;
  jobsFilled: number;
  activeVacancies: number;
  startDate: string;
  endDate: string;
  status: "ACTIVE" | "CLOSED" | "ARCHIVED";
  tendersManaged: number;
  createdAt: Date;
}

const TenderSchema = new Schema<ITender>(
  {
    projectId:      { type: String, unique: true },
    projectName:    { type: String, required: true },
    clientDept:     { type: String, enum: ["PWD", "Metro", "NHAI"], default: "NHAI" },
    tenderRef:      { type: String, default: "" },
    totalJobs:      { type: Number, default: 0 },
    jobsFilled:     { type: Number, default: 0 },
    activeVacancies:{ type: Number, default: 0 },
    startDate:      { type: String, default: "" },
    endDate:        { type: String, default: "" },
    status:         { type: String, enum: ["ACTIVE", "CLOSED", "ARCHIVED"], default: "ACTIVE" },
    tendersManaged: { type: Number, default: 1 },
  },
  { timestamps: true }
);

TenderSchema.pre("save", async function () {
  if (!this.projectId) {
    this.projectId = `TND-${Date.now()}`;
  }
});

export const Tender = models.Tender || model<ITender>("Tender", TenderSchema);
