import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        _count: { select: { products: true } },
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
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
    const { name, nameTh } = body;

    const slug = generateSlug(name);

    // Check if slug already exists
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "หมวดหมู่ชื่อนี้มีอยู่แล้ว" },
        { status: 400 }
      );
    }

    // Get max sortOrder
    const maxSort = await prisma.category.findFirst({
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });

    const category = await prisma.category.create({
      data: {
        name,
        nameTh,
        slug,
        sortOrder: (maxSort?.sortOrder ?? 0) + 1,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
