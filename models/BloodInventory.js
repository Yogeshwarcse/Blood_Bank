import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  donorName: { type: String, required: true },
  bloodType: { type: String, required: true },
  appointmentDate: { type: String, required: true },
  appointmentTime: { type: String, required: true },
  status: { type: String, default: "scheduled" },
});

export default mongoose.models.Appointment ||
  mongoose.model("Appointment", AppointmentSchema);
