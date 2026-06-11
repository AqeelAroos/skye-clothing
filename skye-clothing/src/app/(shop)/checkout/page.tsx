"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, CreditCard, Truck, CheckCircle } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

type Step = "shipping" | "payment" | "review";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const [step, setStep] = useState<Step>("shipping");
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    province: "",
    postalCode: "",
    country: "Sri Lanka",
    paymentMethod: "COD" as "STRIPE" | "PAYHERE" | "COD",
    notes: "",
  });

  const subtotal = getTotal();
  const shippingCost = subtotal >= 10000 ? 0 : 350;
  const total = subtotal + shippingCost - discount;

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validateShipping = () => {
    if (!form.firstName || !form.lastName || !form.phone || !form.line1 || !form.city || !form.province) {
      toast.error("Please fill in all required fields");
      return false;
    }
    return true;
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.toUpperCase(), subtotal }),
      });

      if (res.ok) {
        const data = await res.json();
        setDiscount(data.discount);
        setCouponApplied(true);
        toast.success(`Coupon applied! You save ${formatPrice(data.discount)}`);
      } else {
        const data = await res.json();
        toast.error(data.error || "Invalid coupon");
      }
    } catch {
      toast.error("Failed to validate coupon");
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          couponCode: couponApplied ? couponCode : undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        clearCart();
        router.push(`/profile/orders?success=${data.order.orderNumber}`);
      } else {
        const data = await res.json();
        toast.error(data.error || "Checkout failed");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: "shipping" as Step, label: "Shipping", icon: Truck },
    { id: "payment" as Step, label: "Payment", icon: CreditCard },
    { id: "review" as Step, label: "Review", icon: CheckCircle },
  ];

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-24">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold uppercase tracking-wider">
            No Items to Checkout
          </h1>
          <a href="/products" className="btn-primary mt-6">
            Shop Now
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24">
      <div className="mx-auto max-w-6xl px-4 py-12 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-12 flex items-center justify-center gap-4">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center gap-4">
              <button
                onClick={() => {
                  if (s.id === "shipping") setStep("shipping");
                  if (s.id === "payment" && form.firstName) setStep("payment");
                  if (s.id === "review" && form.firstName) setStep("review");
                }}
                className={cn(
                  "flex items-center gap-2 text-xs uppercase tracking-widest transition-colors",
                  step === s.id
                    ? "text-accent"
                    : steps.indexOf(steps.find((st) => st.id === step)!) >= i
                    ? "text-foreground"
                    : "text-gray-400"
                )}
              >
                <s.icon size={16} />
                {s.label}
              </button>
              {i < steps.length - 1 && (
                <div className="h-px w-12 bg-gray-300 dark:bg-gray-700" />
              )}
            </div>
          ))}
        </div>

        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3">
            {/* Shipping Step */}
            {step === "shipping" && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="font-display text-xl font-bold uppercase tracking-widest">
                  Shipping Information
                </h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs uppercase tracking-widest text-gray-500">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={(e) => updateForm("firstName", e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs uppercase tracking-widest text-gray-500">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={(e) => updateForm("lastName", e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs uppercase tracking-widest text-gray-500">
                      Email
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => updateForm("email", e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs uppercase tracking-widest text-gray-500">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => updateForm("phone", e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs uppercase tracking-widest text-gray-500">
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      value={form.line1}
                      onChange={(e) => updateForm("line1", e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs uppercase tracking-widest text-gray-500">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      value={form.line2}
                      onChange={(e) => updateForm("line2", e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs uppercase tracking-widest text-gray-500">
                      City *
                    </label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => updateForm("city", e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs uppercase tracking-widest text-gray-500">
                      Province *
                    </label>
                    <input
                      type="text"
                      value={form.province}
                      onChange={(e) => updateForm("province", e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs uppercase tracking-widest text-gray-500">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={form.postalCode}
                      onChange={(e) => updateForm("postalCode", e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs uppercase tracking-widest text-gray-500">
                      Country
                    </label>
                    <input
                      type="text"
                      value={form.country}
                      readOnly
                      className="input-field bg-gray-50 dark:bg-skye-900"
                    />
                  </div>
                </div>
                <button
                  onClick={() => validateShipping() && setStep("payment")}
                  className="btn-primary mt-8"
                >
                  Continue to Payment
                </button>
              </motion.div>
            )}

            {/* Payment Step */}
            {step === "payment" && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="font-display text-xl font-bold uppercase tracking-widest">
                  Payment Method
                </h2>
                <div className="mt-6 space-y-3">
                  {[
                    { value: "COD", label: "Cash on Delivery", desc: "Pay when you receive your order" },
                    { value: "STRIPE", label: "Credit/Debit Card (Stripe)", desc: "Visa, Mastercard, Amex" },
                    { value: "PAYHERE", label: "PayHere", desc: "Local Sri Lankan payment gateway" },
                  ].map((method) => (
                    <button
                      key={method.value}
                      onClick={() => updateForm("paymentMethod", method.value)}
                      className={cn(
                        "flex w-full items-start gap-4 border p-4 text-left transition-colors",
                        form.paymentMethod === method.value
                          ? "border-accent bg-accent/5"
                          : "border-gray-200 hover:border-gray-400 dark:border-gray-700"
                      )}
                    >
                      <div
                        className={cn(
                          "mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2",
                          form.paymentMethod === method.value
                            ? "border-accent"
                            : "border-gray-300"
                        )}
                      >
                        {form.paymentMethod === method.value && (
                          <div className="h-2.5 w-2.5 rounded-full bg-accent" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{method.label}</p>
                        <p className="text-xs text-gray-500">{method.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-6">
                  <label className="mb-1 block text-xs uppercase tracking-widest text-gray-500">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => updateForm("notes", e.target.value)}
                    rows={3}
                    className="input-field resize-none"
                    placeholder="Special instructions for delivery..."
                  />
                </div>

                <div className="mt-6 flex gap-4">
                  <button
                    onClick={() => setStep("shipping")}
                    className="btn-secondary"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep("review")}
                    className="btn-primary"
                  >
                    Review Order
                  </button>
                </div>
              </motion.div>
            )}

            {/* Review Step */}
            {step === "review" && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="font-display text-xl font-bold uppercase tracking-widest">
                  Review Your Order
                </h2>

                <div className="mt-6 space-y-6">
                  <div className="border border-gray-200 p-4 dark:border-gray-800">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                      Shipping To
                    </h3>
                    <p className="mt-2 text-sm">
                      {form.firstName} {form.lastName}
                      <br />
                      {form.line1}
                      {form.line2 && <><br />{form.line2}</>}
                      <br />
                      {form.city}, {form.province} {form.postalCode}
                      <br />
                      {form.phone}
                    </p>
                  </div>

                  <div className="border border-gray-200 p-4 dark:border-gray-800">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                      Payment Method
                    </h3>
                    <p className="mt-2 text-sm">{form.paymentMethod === "COD" ? "Cash on Delivery" : form.paymentMethod}</p>
                  </div>

                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.variantId} className="flex gap-4">
                        <div className="h-16 w-12 flex-shrink-0 bg-gray-100 dark:bg-skye-900">
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex flex-1 justify-between">
                          <div>
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-gray-500">{item.size} / {item.color} x {item.quantity}</p>
                          </div>
                          <p className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex gap-4">
                  <button onClick={() => setStep("payment")} className="btn-secondary">
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="btn-primary flex-1 gap-2"
                  >
                    <Lock size={16} />
                    {loading ? "Processing..." : `Place Order — ${formatPrice(total)}`}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-2">
            <div className="sticky top-28 border border-gray-200 p-6 dark:border-gray-800">
              <h3 className="font-display text-lg font-bold uppercase tracking-widest">
                Summary
              </h3>

              <div className="mt-4 space-y-2">
                {items.map((item) => (
                  <div key={item.variantId} className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      {item.name} x{item.quantity}
                    </span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-2 border-t border-gray-200 pt-4 text-sm dark:border-gray-800">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span>{shippingCost === 0 ? "Free" : formatPrice(shippingCost)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
              </div>

              {/* Coupon */}
              <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-800">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={couponApplied}
                    className="input-field flex-1 text-xs"
                  />
                  <button
                    onClick={applyCoupon}
                    disabled={couponApplied || !couponCode}
                    className="btn-secondary text-xs"
                  >
                    {couponApplied ? "Applied" : "Apply"}
                  </button>
                </div>
              </div>

              <div className="mt-4 flex justify-between border-t border-gray-200 pt-4 dark:border-gray-800">
                <span className="font-semibold uppercase tracking-widest">
                  Total
                </span>
                <span className="font-display text-xl font-bold">
                  {formatPrice(total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
