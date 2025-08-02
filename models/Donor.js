import mongoose from "mongoose";

const donorSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  bloodType: String,
  address: String,
  dateOfBirth: String,
  medicalNotes: String,
  totalDonations: { type: Number, default: 0 },
  status: { type: String, default: "active" }
});

const Donor = mongoose.models.Donor || mongoose.model("Donor", donorSchema);

export default Donor;
