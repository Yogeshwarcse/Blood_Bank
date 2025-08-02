import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema(
  {
    donorName: String,
    donorEmail: String,
    donorPhone: String,
    bloodType: String,
    appointmentDate: String,
    appointmentTime: String,
    location: String,
    staff: String,
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled",
    },
    notes: String,
    createdAt: {
      type: String,
      default: () => new Date().toISOString().split("T")[0],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Appointment ||
  mongoose.model("Appointment", AppointmentSchema); 