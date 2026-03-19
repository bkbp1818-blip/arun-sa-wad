import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ExplorePlaceType } from "@prisma/client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const place = await prisma.explorePlace.findUnique({
      where: { id },
    });

    if (!place) {
      return NextResponse.json({ error: "Place not found" }, { status: 404 });
    }

    return NextResponse.json(place);
  } catch (error) {
    console.error("Error fetching explore place:", error);
    return NextResponse.json(
      { error: "Failed to fetch explore place" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const {
      name,
      nameTh,
      type,
      description,
      latitude,
      longitude,
      distance,
      phone,
      website,
      openingHours,
      admissionFee,
      highlights,
      images,
      isActive,
    } = body;

    const place = await prisma.explorePlace.update({
      where: { id },
      data: {
        name,
        nameTh,
        type: type as ExplorePlaceType,
        description,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        distance,
        phone: phone || null,
        website: website || null,
        openingHours: openingHours || null,
        admissionFee: admissionFee || null,
        highlights: highlights || [],
        images,
        isActive,
      },
    });

    return NextResponse.json(place);
  } catch (error) {
    console.error("Error updating explore place:", error);
    return NextResponse.json(
      { error: "Failed to update explore place" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Soft delete
    await prisma.explorePlace.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting explore place:", error);
    return NextResponse.json(
      { error: "Failed to delete explore place" },
      { status: 500 }
    );
  }
}
