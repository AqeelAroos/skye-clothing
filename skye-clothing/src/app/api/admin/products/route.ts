import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  const role = (session.user as { role: string }).role;
  if (role !== "ADMIN") return null;
  return session.user;
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const products = await prisma.product.findMany({
    include: {
      category: { select: { name: true } },
      images: { take: 1, orderBy: { position: "asc" } },
      variants: true,
      _count: { select: { orderItems: true, reviews: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const {
      name,
      description,
      basePrice,
      salePrice,
      categoryId,
      collection,
      tags,
      featured,
      variants,
      images,
    } = body;

    if (!name || !description || !basePrice || !categoryId) {
      return NextResponse.json(
        { error: "Name, description, base price, and category are required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug: slugify(name),
        description,
        basePrice: parseFloat(basePrice),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        categoryId,
        collection: collection || null,
        tags: tags || [],
        featured: featured || false,
        variants: {
          create: (variants || []).map(
            (v: {
              sku: string;
              size: string;
              color: string;
              colorHex: string;
              stock: number;
              price?: number;
            }) => ({
              sku: v.sku,
              size: v.size,
              color: v.color,
              colorHex: v.colorHex || "#000000",
              stock: v.stock || 0,
              price: v.price || null,
            })
          ),
        },
        images: {
          create: (images || []).map(
            (img: { url: string; alt?: string; isHover?: boolean }, i: number) => ({
              url: img.url,
              alt: img.alt || name,
              position: i,
              isHover: img.isHover || false,
            })
          ),
        },
      },
      include: {
        variants: true,
        images: true,
        category: true,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Product create error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.name ? slugify(data.name) : undefined,
        description: data.description,
        basePrice: data.basePrice ? parseFloat(data.basePrice) : undefined,
        salePrice: data.salePrice !== undefined ? (data.salePrice ? parseFloat(data.salePrice) : null) : undefined,
        categoryId: data.categoryId,
        collection: data.collection,
        tags: data.tags,
        featured: data.featured,
        published: data.published,
      },
    });

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Product update error:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}
