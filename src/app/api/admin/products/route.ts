import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ProductType } from "@prisma/client";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      include: { category: true },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
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
      description,
      descTh,
      nameZh,
      descZh,
      type,
      price,
      images,
      roomNumber,
      capacity,
      amenities,
      duration,
      meetingPoint,
      schedule,
      categoryId,
      availableFrom,
      availableTo,
    } = body;

    const product = await prisma.product.create({
      data: {
        name,
        nameTh,
        description,
        descTh,
        nameZh: nameZh || null,
        descZh: descZh || null,
        type: type as ProductType,
        price,
        images: images || [],
        roomNumber,
        capacity,
        amenities: amenities || [],
        duration,
        meetingPoint,
        schedule,
        categoryId: categoryId || null,
        availableFrom: availableFrom ? new Date(availableFrom) : null,
        availableTo: availableTo ? new Date(availableTo) : null,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
