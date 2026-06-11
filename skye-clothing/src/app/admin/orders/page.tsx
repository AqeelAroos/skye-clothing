"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { formatPrice, cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface AdminOrder {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  total: number;
  createdAt: string;
  user: { name: string | null; email: string };
  items: {
    name: string;
    size: string;
    color: string;
    quantity: number;
    price: number;
  }[];
  address: {
    firstName: string;
    lastName: string;
    city: string;
    province: string;
  };
}

const orderStatuses = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const paymentStatuses = ["PENDING", "PAID", "FAILED", "REFUNDED"];

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  PAID: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
  REFUNDED: "bg-orange-100 text-orange-800",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/admin/orders");
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
    fetchOrders();
  }, []);

  const updateOrderStatus = async (
    orderId: string,
    field: "status" | "paymentStatus",
    value: string
  ) => {
    try {
      const body: Record<string, string> = { orderId };
      if (field === "status") body.status = value;
      if (field === "paymentStatus") body.paymentStatus = value;

      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const { order } = await res.json();
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, ...order } : o))
        );
        toast.success("Order updated");
      }
    } catch {
      toast.error("Failed to update order");
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold uppercase tracking-wider">
        Orders
      </h1>

      <div className="mt-8 space-y-3">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse border border-gray-200 p-6 dark:border-gray-800"
              >
                <div className="h-4 w-32 bg-gray-200 dark:bg-skye-800" />
                <div className="mt-2 h-3 w-48 bg-gray-200 dark:bg-skye-800" />
              </div>
            ))
          : orders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="border border-gray-200 dark:border-gray-800"
              >
                <button
                  onClick={() =>
                    setExpandedOrder(
                      expandedOrder === order.id ? null : order.id
                    )
                  }
                  className="flex w-full items-center justify-between p-4 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-sm font-bold">{order.orderNumber}</p>
                      <p className="text-xs text-gray-500">
                        {order.user.name || order.user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={cn(
                        "px-2 py-0.5 text-[10px] font-bold uppercase",
                        statusColors[order.status]
                      )}
                    >
                      {order.status}
                    </span>
                    <span
                      className={cn(
                        "px-2 py-0.5 text-[10px] font-bold uppercase",
                        statusColors[order.paymentStatus]
                      )}
                    >
                      {order.paymentStatus}
                    </span>
                    <span className="text-sm font-semibold">
                      {formatPrice(order.total)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </button>

                {expandedOrder === order.id && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    className="overflow-hidden border-t border-gray-200 dark:border-gray-800"
                  >
                    <div className="grid gap-4 p-4 sm:grid-cols-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                          Items
                        </p>
                        <div className="mt-2 space-y-1">
                          {order.items.map((item, j) => (
                            <p key={j} className="text-sm">
                              {item.name} — {item.size}/{item.color} x
                              {item.quantity} ({formatPrice(item.price)})
                            </p>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                          Shipping
                        </p>
                        <p className="mt-2 text-sm">
                          {order.address.firstName} {order.address.lastName}
                          <br />
                          {order.address.city}, {order.address.province}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          Payment: {order.paymentMethod}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                          Update Status
                        </p>
                        <div className="mt-2 space-y-2">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              updateOrderStatus(
                                order.id,
                                "status",
                                e.target.value
                              )
                            }
                            className="input-field text-xs"
                          >
                            {orderStatuses.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                          <select
                            value={order.paymentStatus}
                            onChange={(e) =>
                              updateOrderStatus(
                                order.id,
                                "paymentStatus",
                                e.target.value
                              )
                            }
                            className="input-field text-xs"
                          >
                            {paymentStatuses.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
      </div>
    </div>
  );
}
