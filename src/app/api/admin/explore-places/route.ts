import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ExplorePlaceType } from "@prisma/client";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const places = await prisma.explorePlace.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(places);
  } catch (error) {
    console.error("Error fetching explore places:", error);
    return NextResponse.json(
      { error: "Failed to fetch explore places" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
    } = body;

    const place = await prisma.explorePlace.create({
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
        images: images || [],
      },
    });

    return NextResponse.json(place, { status: 201 });
  } catch (error) {
    console.error("Error creating explore place:", error);
    return NextResponse.json(
      { error: "Failed to create explore place" },
      { status: 500 }
    );
  }
}
