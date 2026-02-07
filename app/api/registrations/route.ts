import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user role
    const profile = await prisma.profile.findUnique({
      where: { id: user.id }
    });

    let registrations;

    if (profile?.role === "admin") {
      // Admins see everything
      registrations = await prisma.registration.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          tryout: true,
        },
      });
    } else {
      // Parents only see their own
      registrations = await prisma.registration.findMany({
        where: {
          OR: [
            { userId: user.id },
            { parentEmail: user.email }
          ]
        },
        orderBy: { createdAt: "desc" },
        include: {
          tryout: true,
        },
      });
    }

    return NextResponse.json(registrations);
  } catch (error) {
    console.error("Prisma error fetching registrations:", error);
    return NextResponse.json({ error: "Failed to fetch registrations" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
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

    // Check capacity using Prisma
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

    // Get current user if authenticated
    const { data: { user } } = await supabase.auth.getUser();

    const registration = await prisma.registration.create({
      data: {
        parentName,
        parentEmail,
        parentPhone,
        playerName,
        playerAge: parseInt(playerAge.toString()),
        playerGrade,
        medicalInfo: medicalInfo || null,
        emergencyContact,
        emergencyPhone,
        tryoutId,
        userId: user?.id || null,
      },
    });

    return NextResponse.json(registration, { status: 201 });
  } catch (error) {
    console.error("Prisma error creating registration:", error);
    return NextResponse.json(
      { error: "Failed to create registration" },
      { status: 500 }
    );
  }
}
