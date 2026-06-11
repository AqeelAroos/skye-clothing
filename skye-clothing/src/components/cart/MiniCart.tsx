"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";

export function MiniCart() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotal } =
    useCartStore();

  const total = getTotal();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={closeCart}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed bottom-0 right-0 top-0 z-50 w-full max-w-md bg-white shadow-2xl dark:bg-skye-950"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5 dark:border-gray-800">
                <h2 className="font-display text-lg font-bold uppercase tracking-widest">
                  Your Bag ({items.length})
                </h2>
                <button onClick={closeCart} aria-label="Close cart">
                  <X size={20} />
                </button>
              </div>

              {items.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center px-6">
                  <ShoppingBag size={48} className="text-gray-300" />
                  <p className="mt-4 font-display text-lg font-bold">
                    Your bag is empty
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Add items to get started
                  </p>
                  <Link
                    href="/products"
                    onClick={closeCart}
                    className="btn-primary mt-6"
                  >
                    Shop Now
                  </Link>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto px-6 py-4">
                    <div className="space-y-4">
                      {items.map((item) => (
                        <motion.div
                          key={item.variantId}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: 100 }}
                          className="flex gap-4"
                        >
                          <div className="h-24 w-20 flex-shrink-0 bg-gray-100 dark:bg-skye-900">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>

                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <Link
                                href={`/products/${item.slug}`}
                                onClick={closeCart}
                                className="text-sm font-medium hover:text-accent"
                              >
                                {item.name}
                              </Link>
                              <p className="mt-0.5 text-xs text-gray-500">
                                {item.size} / {item.color}
                              </p>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center border border-gray-200 dark:border-gray-700">
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item.variantId,
                                      item.quantity - 1
                                    )
                                  }
                                  className="px-2 py-1 transition-colors hover:bg-gray-100 dark:hover:bg-skye-800"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="px-3 text-xs font-medium">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item.variantId,
                                      item.quantity + 1
                                    )
                                  }
                                  className="px-2 py-1 transition-colors hover:bg-gray-100 dark:hover:bg-skye-800"
                                  aria-label="Increase quantity"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>

                              <div className="flex items-center gap-3">
                                <span className="text-sm font-semibold">
                                  {formatPrice(item.price * item.quantity)}
                                </span>
                                <button
                                  onClick={() => removeItem(item.variantId)}
                                  className="text-gray-400 transition-colors hover:text-red-500"
                                  aria-label="Remove item"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 px-6 py-5 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                      <span className="text-sm uppercase tracking-widest">
                        Subtotal
                      </span>
                      <span className="font-display text-lg font-bold">
                        {formatPrice(total)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Shipping and taxes calculated at checkout
                    </p>

                    <Link
                      href="/checkout"
                      onClick={closeCart}
                      className="btn-primary mt-4 w-full gap-2"
                    >
                      Checkout
                      <ArrowRight size={16} />
                    </Link>
                    <Link
                      href="/cart"
                      onClick={closeCart}
                      className="btn-secondary mt-2 w-full"
                    >
                      View Full Bag
                    </Link>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
