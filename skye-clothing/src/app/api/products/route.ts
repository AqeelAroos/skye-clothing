import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const sort = searchParams.get("sort") || "newest";
    const sizes = searchParams.get("sizes")?.split(",").filter(Boolean) || [];
    const colors = searchParams.get("colors")?.split(",").filter(Boolean) || [];
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const featured = searchParams.get("featured");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: Record<string, unknown> = {
      published: true,
    };

    if (category) {
      where.category = { slug: category };
    }

    if (featured === "true") {
      where.featured = true;
    }

    if (sizes.length > 0 || colors.length > 0) {
      where.variants = {
        some: {
          ...(sizes.length > 0 ? { size: { in: sizes } } : {}),
          ...(colors.length > 0 ? { color: { in: colors } } : {}),
          stock: { gt: 0 },
        },
      };
    }

    if (minPrice || maxPrice) {
      where.basePrice = {
        ...(minPrice ? { gte: parseFloat(minPrice) } : {}),
        ...(maxPrice ? { lte: parseFloat(maxPrice) } : {}),
      };
    }

    const orderBy: Record<string, string> = {};
    switch (sort) {
      case "price-asc":
        orderBy.basePrice = "asc";
        break;
      case "price-desc":
        orderBy.basePrice = "desc";
        break;
      case "popular":
        orderBy.createdAt = "desc";
        break;
      default:
        orderBy.createdAt = "desc";
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          images: { orderBy: { position: "asc" } },
          variants: true,
          _count: { select: { reviews: true } },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Products fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
