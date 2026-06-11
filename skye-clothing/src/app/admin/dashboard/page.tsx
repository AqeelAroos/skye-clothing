"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  recentOrders: {
    id: string;
    orderNumber: string;
    status: string;
    total: number;
    createdAt: string;
    user: { name: string | null; email: string };
  }[];
}

const statusColors: Record<string, string> = {
  PENDING: "text-yellow-600",
  CONFIRMED: "text-blue-600",
  PROCESSING: "text-purple-600",
  SHIPPED: "text-indigo-600",
  DELIVERED: "text-green-600",
  CANCELLED: "text-red-600",
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch {
        // Handle silently
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: formatPrice(stats?.totalRevenue || 0),
      color: "text-green-500",
    },
    {
      icon: ShoppingCart,
      label: "Total Orders",
      value: String(stats?.totalOrders || 0),
      color: "text-blue-500",
    },
    {
      icon: Users,
      label: "Customers",
      value: String(stats?.totalCustomers || 0),
      color: "text-purple-500",
    },
    {
      icon: Package,
      label: "Products",
      value: String(stats?.totalProducts || 0),
      color: "text-accent",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold uppercase tracking-wider">
          Dashboard
        </h1>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <TrendingUp size={14} className="text-green-500" />
          Last 30 days
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="border border-gray-200 p-5 dark:border-gray-800"
          >
            {loading ? (
              <div className="animate-pulse">
                <div className="h-4 w-20 bg-gray-200 dark:bg-skye-800" />
                <div className="mt-2 h-8 w-28 bg-gray-200 dark:bg-skye-800" />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <card.icon size={16} className={card.color} />
                  <span className="text-xs uppercase tracking-widest text-gray-500">
                    {card.label}
                  </span>
                </div>
                <p className="mt-2 font-display text-2xl font-bold">
                  {card.value}
                </p>
              </>
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="font-display text-lg font-bold uppercase tracking-wider">
          Recent Orders
        </h2>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="pb-3 text-left text-xs uppercase tracking-widest text-gray-500">
                  Order
                </th>
                <th className="pb-3 text-left text-xs uppercase tracking-widest text-gray-500">
                  Customer
                </th>
                <th className="pb-3 text-left text-xs uppercase tracking-widest text-gray-500">
                  Status
                </th>
                <th className="pb-3 text-right text-xs uppercase tracking-widest text-gray-500">
                  Total
                </th>
                <th className="pb-3 text-right text-xs uppercase tracking-widest text-gray-500">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3"><div className="h-4 w-24 bg-gray-200 dark:bg-skye-800" /></td>
                      <td className="py-3"><div className="h-4 w-32 bg-gray-200 dark:bg-skye-800" /></td>
                      <td className="py-3"><div className="h-4 w-16 bg-gray-200 dark:bg-skye-800" /></td>
                      <td className="py-3"><div className="ml-auto h-4 w-20 bg-gray-200 dark:bg-skye-800" /></td>
                      <td className="py-3"><div className="ml-auto h-4 w-24 bg-gray-200 dark:bg-skye-800" /></td>
                    </tr>
                  ))
                : stats?.recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-gray-100 dark:border-gray-800"
                    >
                      <td className="py-3 font-medium">
                        {order.orderNumber}
                      </td>
                      <td className="py-3 text-gray-500">
                        {order.user.name || order.user.email}
                      </td>
                      <td className="py-3">
                        <span
                          className={`text-xs font-semibold uppercase ${
                            statusColors[order.status] || ""
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 text-right font-medium">
                        {formatPrice(order.total)}
                      </td>
                      <td className="py-3 text-right text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
