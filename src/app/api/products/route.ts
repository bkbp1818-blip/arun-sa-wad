import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ProductType } from "@prisma/client";

// Valid product types from Prisma enum
const validProductTypes: ProductType[] = ["ROOM", "TOUR", "FOOD", "SERVICE", "MERCH"];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const typeParam = searchParams.get("type");

    // Validate type parameter if provided
    if (typeParam && !validProductTypes.includes(typeParam as ProductType)) {
      return NextResponse.json(
        { error: `Invalid product type. Valid types: ${validProductTypes.join(", ")}` },
        { status: 400 }
      );
    }

    const type = typeParam as ProductType | null;

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        ...(type && { type }),
      },
      orderBy: {
        createdAt: "desc",
      },
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
