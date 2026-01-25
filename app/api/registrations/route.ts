import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const registrations = await prisma.registration.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        tryout: {
          select: {
            ageGroup: true,
            date: true,
            location: true,
            startTime: true,
            endTime: true,
          },
        },
      },
    });

    return NextResponse.json(registrations);
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      parentName,
      parentEmail,
      parentPhone,
      playerName,
      playerAge,
      playerGrade,
      medicalInfo,
      emergencyContact,
      emergencyPhone,
      tryoutId,
    } = body;

    if (
      !parentName ||
      !parentEmail ||
      !parentPhone ||
      !playerName ||
      !playerAge ||
      !playerGrade ||
      !emergencyContact ||
      !emergencyPhone ||
      !tryoutId
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const tryout = await prisma.tryout.findUnique({
      where: { id: tryoutId },
      include: {
        _count: {
          select: { registrations: true },
        },
      },
    });

    if (!tryout) {
      return NextResponse.json(
        { error: "Tryout session not found" },
        { status: 404 }
      );
    }

    if (
      tryout.maxCapacity !== null &&
      tryout._count.registrations >= tryout.maxCapacity
    ) {
      return NextResponse.json(
        { error: "This tryout session is full" },
        { status: 400 }
      );
    }

    const registration = await prisma.registration.create({
      data: {
        parentName,
        parentEmail,
        parentPhone,
        playerName,
        playerAge,
        playerGrade,
        medicalInfo: medicalInfo || null,
        emergencyContact,
        emergencyPhone,
        tryoutId,
      },
    });

    return NextResponse.json(registration, { status: 201 });
  } catch (error) {
    console.error("Error creating registration:", error);
    return NextResponse.json(
      { error: "Failed to create registration" },
      { status: 500 }
    );
  }
}
