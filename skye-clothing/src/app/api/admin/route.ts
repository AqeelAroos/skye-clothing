import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { error: "Unauthorized", status: 401 };
  }
  const role = (session.user as { role: string }).role;
  if (role !== "ADMIN") {
    return { error: "Forbidden", status: 403 };
  }
  return { userId: (session.user as { id: string }).id };
}

export async function GET() {
  const auth = await requireAdmin();
  if ("error" in auth) {
    return NextResponse.json(
      { error: auth.error },
      { status: auth.status }
    );
  }

  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [totalRevenue, totalOrders, totalCustomers, totalProducts, recentOrders, dailyRevenue] =
      await Promise.all([
        prisma.order.aggregate({
          _sum: { total: true },
          where: { paymentStatus: "PAID" },
        }),
        prisma.order.count(),
        prisma.user.count({ where: { role: "CUSTOMER" } }),
        prisma.product.count(),
        prisma.order.findMany({
          include: { items: true, address: true, user: { select: { name: true, email: true } } },
          orderBy: { createdAt: "desc" },
          take: 10,
        }),
        prisma.order.groupBy({
          by: ["createdAt"],
          _sum: { total: true },
          where: {
            createdAt: { gte: thirtyDaysAgo },
            paymentStatus: "PAID",
          },
          orderBy: { createdAt: "asc" },
        }),
      ]);

    return NextResponse.json({
      totalRevenue: totalRevenue._sum.total || 0,
      totalOrders,
      totalCustomers,
      totalProducts,
      recentOrders,
      revenueByDay: dailyRevenue.map((d) => ({
        date: d.createdAt.toISOString().split("T")[0],
        revenue: d._sum.total || 0,
      })),
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin stats" },
      { status: 500 }
    );
  }
}
