import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IApplication extends Document {
  jobId: string | number;
  jobTitle: string;
  tender: string;
  fullName: string;
  fatherName: string;
  mobile: string;
  email: string;
  dob: string;
  aadhaar: string;
  address: string;
  state: string;
  city: string;
  pinCode: string;
  qualification: string;
  experience: number;
  employer: string;
  resumeUrl: string;
  idProofUrl: string;
  photoUrl: string;
  additionalCertificate: string;
  preferredDistrict: string;
  preferredBlocks: string[];
  applicationStatus: "PENDING" | "SHORTLISTED" | "SELECTED" | "REJECTED";
  submissionDate: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    jobId:         { type: Schema.Types.Mixed, required: true },
    jobTitle:      { type: String, required: true },
    tender:        { type: String, default: "General" },
    fullName:      { type: String, required: true },
    fatherName:    { type: String, default: "" },
    mobile:        { type: String, required: true },
    email:         { type: String, required: true },
    dob:           { type: String, default: "" },
    aadhaar:       { type: String, default: "" },
    address:       { type: String, default: "" },
    state:         { type: String, default: "" },
    city:          { type: String, default: "" },
    pinCode:       { type: String, default: "" },
    qualification: { type: String, default: "" },
    experience:    { type: Number, default: 0 },
    employer:      { type: String, default: "" },
    resumeUrl:             { type: String, default: "" },
    idProofUrl:            { type: String, default: "" },
    photoUrl:              { type: String, default: "" },
    additionalCertificate: { type: String, default: "" },
    preferredDistrict:     { type: String, default: "" },
    preferredBlocks:       { type: [String], default: [] },
    applicationStatus: {
      type: String,
      enum: ["PENDING", "SHORTLISTED", "SELECTED", "REJECTED"],
      default: "PENDING",
    },
    submissionDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

ApplicationSchema.index({ applicationStatus: 1, createdAt: -1 });
ApplicationSchema.index({ tender: 1, createdAt: -1 });
ApplicationSchema.index({ email: 1 });
ApplicationSchema.index({ city: 1 });
ApplicationSchema.index({ qualification: 1 });

export const Application =
  models.Application || model<IApplication>("Application", ApplicationSchema);
