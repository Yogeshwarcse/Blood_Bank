import { connectDB } from "@/lib/mongodb";
import Donor from "@/models/Donor";
import { NextResponse } from "next/server";

// DELETE Donor by ID
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const deletedDonor = await Donor.findByIdAndDelete(id);
    if (!deletedDonor) {
      return NextResponse.json({ error: "Donor not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Donor deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
