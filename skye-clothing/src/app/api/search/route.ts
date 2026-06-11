import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");

    if (!q || q.length < 2) {
      return NextResponse.json({ products: [] });
    }

    const products = await prisma.product.findMany({
      where: {
        published: true,
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
          { tags: { hasSome: [q.toLowerCase()] } },
          { category: { name: { contains: q, mode: "insensitive" } } },
        ],
      },
      include: {
        images: { take: 1, orderBy: { position: "asc" } },
        category: { select: { name: true } },
      },
      take: 8,
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
