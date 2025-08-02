import { connectDB, Appointment } from "@/lib/mongodb";

// GET: Fetch all appointments
export async function GET() {
  try {
    await connectDB();
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    return new Response(JSON.stringify(appointments), { status: 200 });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch appointments" }), { status: 500 });
  }
}

// POST: Create a new appointment
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    // Create new appointment
    const appointment = await Appointment.create(body);

    return new Response(JSON.stringify(appointment), { status: 201 });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return new Response(JSON.stringify({ error: "Failed to create appointment" }), { status: 500 });
  }
}
