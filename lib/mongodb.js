import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("⚠️ Please add MONGODB_URI to your .env.local file");
}

// Cache the connection during development to avoid multiple connections
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "blood_donation",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

/* ==========================
   Appointment Schema
========================== */
const appointmentSchema = new mongoose.Schema(
  {
    donorName: { type: String, required: true, trim: true },
    bloodType: { type: String, required: true },
    appointmentDate: { type: String, required: true },
    appointmentTime: { type: String, required: true },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled",
    },
    location: String,
    staff: String,
    notes: String,
  },
  { timestamps: true }
);

export const Appointment =
  mongoose.models.Appointment || mongoose.model("Appointment", appointmentSchema);

/* ==========================
   Blood Unit Schema
========================== */
const bloodUnitSchema = new mongoose.Schema(
  {
    bagNumber: { type: String, required: true, unique: true },
    bloodType: { type: String, required: true },
    donationDate: { type: String, required: true },
    expiryDate: { type: String, required: true },
    volume: { type: Number, default: 450 },
    status: {
      type: String,
      enum: ["available", "reserved", "expired", "used"],
      default: "available",
    },
    location: String,
    donorName: String,
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
  },
  { timestamps: true }
);

export const BloodUnit =
  mongoose.models.BloodUnit || mongoose.model("BloodUnit", bloodUnitSchema);
