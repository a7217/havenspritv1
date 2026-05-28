import mongoose, { Schema, Document } from "mongoose";

export interface IAdminProfile extends Document {
  name: string;
  email: string;
  phone: string;
  designation: string;
}

const AdminProfileSchema = new Schema<IAdminProfile>(
  {
    name:        { type: String, default: "Admin User" },
    email:       { type: String, default: "havenspirit.dir@gmail.com" },
    phone:       { type: String, default: "+91 7050322546" },
    designation: { type: String, default: "Portal Administrator" },
  },
  { timestamps: true }
);

export const AdminProfile =
  mongoose.models.AdminProfile ||
  mongoose.model<IAdminProfile>("AdminProfile", AdminProfileSchema);
