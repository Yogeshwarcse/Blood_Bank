import { connectDB, BloodUnit } from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB();
    const units = await BloodUnit.find().populate("appointment").sort({ createdAt: -1 });
    return new Response(JSON.stringify(units), { status: 200 });
  } catch (error) {
    console.error("Error fetching blood units:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch blood units" }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const unit = await BloodUnit.create(body);
    return new Response(JSON.stringify(unit), { status: 201 });
  } catch (error) {
    console.error("Error creating blood unit:", error);
    return new Response(JSON.stringify({ error: "Failed to create blood unit" }), { status: 500 });
  }
}
