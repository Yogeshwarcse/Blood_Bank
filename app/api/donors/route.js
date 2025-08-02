// app/api/donors/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Donor from "@/models/Donor";

export async function GET() {
  try {
    await connectDB();
    const donors = await Donor.find();
    return NextResponse.json(donors);
  } catch (error) {
    console.error("Error fetching donors:", error);
    return NextResponse.json({ error: "Failed to fetch donors" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    const newDonor = await Donor.create(data);
    return NextResponse.json(newDonor, { status: 201 });
  } catch (error) {
    console.error("Error adding donor:", error);
    return NextResponse.json({ error: "Failed to add donor" }, { status: 500 });
  }
}
