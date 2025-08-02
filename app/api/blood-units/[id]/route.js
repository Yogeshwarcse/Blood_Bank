import { connectDB, BloodUnit } from "@/lib/mongodb";

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const data = await req.json();

    const updated = await BloodUnit.findByIdAndUpdate(id, data, { new: true });
    if (!updated) {
      return new Response(JSON.stringify({ error: "Blood unit not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (error) {
    console.error("Error updating blood unit:", error);
    return new Response(JSON.stringify({ error: "Failed to update blood unit" }), { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const deleted = await BloodUnit.findByIdAndDelete(id);
    if (!deleted) {
      return new Response(JSON.stringify({ error: "Blood unit not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Blood unit deleted" }), { status: 200 });
  } catch (error) {
    console.error("Error deleting blood unit:", error);
    return new Response(JSON.stringify({ error: "Failed to delete blood unit" }), { status: 500 });
  }
}
