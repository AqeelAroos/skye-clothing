import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { take: 1, orderBy: { position: "asc" } },
              },
            },
            variant: true,
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: { take: 1, orderBy: { position: "asc" } },
                },
              },
              variant: true,
            },
          },
        },
      });
    }

    return NextResponse.json(cart);
  } catch (error) {
    console.error("Cart fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const { productId, variantId, quantity } = await req.json();

    if (!productId || !variantId || !quantity) {
      return NextResponse.json(
        { error: "Product, variant, and quantity are required" },
        { status: 400 }
      );
    }

    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant || variant.stock < quantity) {
      return NextResponse.json(
        { error: "Insufficient stock" },
        { status: 400 }
      );
    }

    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: { cartId_variantId: { cartId: cart.id, variantId } },
    });

    if (existingItem) {
      const newQty = existingItem.quantity + quantity;
      if (newQty > variant.stock) {
        return NextResponse.json(
          { error: "Exceeds available stock" },
          { status: 400 }
        );
      }

      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQty },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          variantId,
          quantity,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cart add error:", error);
    return NextResponse.json(
      { error: "Failed to add item to cart" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get("itemId");

    if (!itemId) {
      return NextResponse.json(
        { error: "Item ID is required" },
        { status: 400 }
      );
    }

    await prisma.cartItem.delete({ where: { id: itemId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cart delete error:", error);
    return NextResponse.json(
      { error: "Failed to remove item from cart" },
      { status: 500 }
    );
  }
}
