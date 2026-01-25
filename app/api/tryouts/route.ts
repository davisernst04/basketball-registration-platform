import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const tryouts = await prisma.tryout.findMany({
      orderBy: { date: "asc" },
      include: {
        _count: {
          select: { registrations: true },
        },
      },
    });

    return NextResponse.json(tryouts);
  } catch (error) {
    console.error("Error fetching tryouts:", error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { location, date, startTime, endTime, ageGroup, maxCapacity, notes } = body;

    if (!location || !date || !startTime || !endTime || !ageGroup) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const tryout = await prisma.tryout.create({
      data: {
        location,
        date: new Date(date),
        startTime,
        endTime,
        ageGroup,
        maxCapacity,
        notes,
      },
    });

    return NextResponse.json(tryout, { status: 201 });
  } catch (error) {
    console.error("Error creating tryout:", error);
    return NextResponse.json(
      { error: "Failed to create tryout" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, location, date, startTime, endTime, ageGroup, maxCapacity, notes } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Tryout ID is required" },
        { status: 400 }
      );
    }

    const tryout = await prisma.tryout.update({
      where: { id },
      data: {
        location,
        date: new Date(date),
        startTime,
        endTime,
        ageGroup,
        maxCapacity,
        notes,
      },
    });

    return NextResponse.json(tryout);
  } catch (error) {
    console.error("Error updating tryout:", error);
    return NextResponse.json(
      { error: "Failed to update tryout" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Tryout ID is required" },
        { status: 400 }
      );
    }

    await prisma.tryout.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting tryout:", error);
    return NextResponse.json(
      { error: "Failed to delete tryout" },
      { status: 500 }
    );
  }
}
