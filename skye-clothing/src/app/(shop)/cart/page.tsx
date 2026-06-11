"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Minus,
  Plus,
  X,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { SplitText } from "@/components/animations/SplitText";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } =
    useCartStore();

  const total = getTotal();
  const shippingCost = total >= 10000 ? 0 : 350;
  const grandTotal = total + shippingCost;

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-24">
        <div className="text-center">
          <ShoppingBag size={64} className="mx-auto text-gray-300" />
          <h1 className="mt-6 font-display text-3xl font-bold uppercase tracking-wider">
            Your Bag is Empty
          </h1>
          <p className="mt-2 text-gray-500">
            Looks like you haven&apos;t added anything yet.
          </p>
          <Link href="/products" className="btn-primary mt-8 gap-2">
            Continue Shopping
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <SplitText
          text="Shopping Bag"
          as="h1"
          className="font-display text-4xl font-bold uppercase tracking-wider"
        />

        <div className="mt-12 grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {items.map((item, index) => (
                <motion.div
                  key={item.variantId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-6 border-b border-gray-200 pb-6 dark:border-gray-800"
                >
                  <div className="h-32 w-24 flex-shrink-0 bg-gray-100 dark:bg-skye-900">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex justify-between">
                      <div>
                        <Link
                          href={`/products/${item.slug}`}
                          className="font-medium hover:text-accent"
                        >
                          {item.name}
                        </Link>
                        <p className="mt-1 text-xs text-gray-500">
                          {item.size} / {item.color}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.variantId)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-gray-200 dark:border-gray-700">
                        <button
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity - 1)
                          }
                          className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-skye-800"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity + 1)
                          }
                          className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-skye-800"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="font-semibold">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 flex justify-between">
              <Link
                href="/products"
                className="flex items-center gap-2 text-xs uppercase tracking-widest hover:text-accent"
              >
                <ArrowLeft size={14} />
                Continue Shopping
              </Link>
              <button
                onClick={clearCart}
                className="text-xs uppercase tracking-widest text-gray-400 hover:text-red-500"
              >
                Clear Bag
              </button>
            </div>
          </div>

          <div>
            <div className="border border-gray-200 p-6 dark:border-gray-800">
              <h2 className="font-display text-lg font-bold uppercase tracking-widest">
                Order Summary
              </h2>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span>
                    {shippingCost === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      formatPrice(shippingCost)
                    )}
                  </span>
                </div>
                {total < 10000 && (
                  <p className="text-xs text-accent">
                    Add {formatPrice(10000 - total)} more for free shipping
                  </p>
                )}
                <div className="border-t border-gray-200 pt-3 dark:border-gray-800">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="font-display text-lg">
                      {formatPrice(grandTotal)}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href="/checkout"
                className="btn-primary mt-6 w-full gap-2"
              >
                Proceed to Checkout
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
