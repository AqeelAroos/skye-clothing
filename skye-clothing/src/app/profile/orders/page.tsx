"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Package, CheckCircle } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  createdAt: string;
  items: {
    name: string;
    size: string;
    color: string;
    quantity: number;
    price: number;
    imageUrl: string | null;
  }[];
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function OrdersPage() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const successOrder = searchParams.get("success");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders);
        }
      } catch {
        // Handle silently
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") fetchOrders();
  }, [status, router]);

  return (
    <div className="pt-24">
      <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
        {successOrder && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-center gap-3 border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20"
          >
            <CheckCircle size={20} className="text-green-600" />
            <div>
              <p className="font-medium text-green-800 dark:text-green-400">
                Order placed successfully!
              </p>
              <p className="text-sm text-green-600 dark:text-green-500">
                Order number: {successOrder}
              </p>
            </div>
          </motion.div>
        )}

        <h1 className="font-display text-3xl font-bold uppercase tracking-wider">
          Order History
        </h1>

        {loading ? (
          <div className="mt-8 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse border border-gray-200 p-6 dark:border-gray-800">
                <div className="h-4 w-32 bg-gray-200 dark:bg-skye-800" />
                <div className="mt-2 h-3 w-48 bg-gray-200 dark:bg-skye-800" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="mt-12 text-center">
            <Package size={48} className="mx-auto text-gray-300" />
            <p className="mt-4 text-gray-500">No orders yet</p>
            <a href="/products" className="btn-primary mt-4">
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {orders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border border-gray-200 p-6 dark:border-gray-800"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-display text-sm font-bold uppercase tracking-wider">
                      {order.orderNumber}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        statusColors[order.status] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status}
                    </span>
                    <span className="font-semibold">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex gap-3 overflow-x-auto">
                  {order.items.map((item, j) => (
                    <div key={j} className="flex flex-shrink-0 gap-3">
                      <div className="h-14 w-11 bg-gray-100 dark:bg-skye-800">
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-medium">{item.name}</p>
                        <p className="text-[10px] text-gray-500">
                          {item.size} / {item.color} x{item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
