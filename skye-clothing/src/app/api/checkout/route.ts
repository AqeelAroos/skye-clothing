import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const body = await req.json();
    const {
      firstName,
      lastName,
      phone,
      line1,
      line2,
      city,
      province,
      postalCode,
      country,
      paymentMethod,
      couponCode,
      notes,
    } = body;

    if (!firstName || !lastName || !line1 || !city || !province || !phone) {
      return NextResponse.json(
        { error: "Missing required shipping information" },
        { status: 400 }
      );
    }

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: { images: { take: 1, orderBy: { position: "asc" } } },
            },
            variant: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    for (const item of cart.items) {
      if (item.variant.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `Insufficient stock for ${item.product.name} (${item.variant.size}/${item.variant.color})`,
          },
          { status: 400 }
        );
      }
    }

    const subtotal = cart.items.reduce((sum, item) => {
      const price =
        item.variant.price ||
        item.product.salePrice ||
        item.product.basePrice;
      return sum + price * item.quantity;
    }, 0);

    const shippingCost = subtotal >= 10000 ? 0 : 350;
    const tax = 0;
    let discount = 0;
    let couponId: string | null = null;

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode },
      });

      if (
        coupon &&
        coupon.active &&
        (!coupon.expiresAt || coupon.expiresAt > new Date()) &&
        (!coupon.maxUses || coupon.usedCount < coupon.maxUses) &&
        (!coupon.minOrderAmount || subtotal >= coupon.minOrderAmount)
      ) {
        if (coupon.discountType === "percentage") {
          discount = (subtotal * coupon.discountValue) / 100;
        } else {
          discount = coupon.discountValue;
        }
        couponId = coupon.id;
      }
    }

    const total = subtotal + shippingCost + tax - discount;

    const result = await prisma.$transaction(async (tx) => {
      const address = await tx.address.create({
        data: {
          userId,
          firstName,
          lastName,
          line1,
          line2: line2 || null,
          city,
          province,
          postalCode: postalCode || "",
          country: country || "Sri Lanka",
          phone,
        },
      });

      const order = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId,
          addressId: address.id,
          paymentMethod: paymentMethod || "COD",
          subtotal,
          shippingCost,
          tax,
          discount,
          total,
          couponId,
          notes: notes || null,
          status: paymentMethod === "COD" ? "CONFIRMED" : "PENDING",
          paymentStatus: paymentMethod === "COD" ? "PENDING" : "PENDING",
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              name: item.product.name,
              size: item.variant.size,
              color: item.variant.color,
              price:
                item.variant.price ||
                item.product.salePrice ||
                item.product.basePrice,
              quantity: item.quantity,
              imageUrl: item.product.images[0]?.url || null,
            })),
          },
        },
        include: { items: true },
      });

      for (const item of cart.items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      if (couponId) {
        await tx.coupon.update({
          where: { id: couponId },
          data: { usedCount: { increment: 1 } },
        });
      }

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return order;
    });

    return NextResponse.json({
      order: {
        id: result.id,
        orderNumber: result.orderNumber,
        total: result.total,
        status: result.status,
      },
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to process checkout" },
      { status: 500 }
    );
  }
}
