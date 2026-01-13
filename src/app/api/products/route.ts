import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ProductType } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") as ProductType | null;

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
