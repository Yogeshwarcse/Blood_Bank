import { connectDB, Appointment } from "@/lib/mongodb";

// UPDATE appointment status
export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const data = await req.json();

    const updated = await Appointment.findByIdAndUpdate(
      id,
      { status: data.status },
      { new: true }
    );

    if (!updated) {
      return new Response(JSON.stringify({ error: "Appointment not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (error) {
    console.error("Error updating appointment:", error);
    return new Response(JSON.stringify({ error: "Failed to update appointment" }), { status: 500 });
  }
}

// DELETE appointment
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const deleted = await Appointment.findByIdAndDelete(id);
    if (!deleted) {
      return new Response(JSON.stringify({ error: "Appointment not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Deleted successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return new Response(JSON.stringify({ error: "Failed to delete appointment" }), { status: 500 });
  }
}
