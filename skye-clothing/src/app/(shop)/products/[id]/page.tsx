"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Minus,
  Plus,
  ShoppingBag,
  Heart,
  Share2,
  Truck,
  RotateCcw,
  Shield,
  Star,
  ChevronDown,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import toast from "react-hot-toast";

interface ProductData {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  salePrice: number | null;
  collection: string | null;
  category: { name: string };
  variants: {
    id: string;
    sku: string;
    size: string;
    color: string;
    colorHex: string;
    stock: number;
    price: number | null;
  }[];
  images: { id: string; url: string; alt: string | null; position: number }[];
  reviews: {
    id: string;
    rating: number;
    title: string | null;
    comment: string | null;
    user: { name: string | null };
    createdAt: string;
  }[];
  averageRating: number;
  reviewCount: number;
}

const placeholderProduct: ProductData = {
  id: "1",
  name: "Oversized Urban Tee",
  slug: "oversized-urban-tee",
  description:
    "Crafted from premium heavyweight cotton, the Oversized Urban Tee delivers an effortlessly cool silhouette. Features dropped shoulders, a relaxed boxy fit, and ribbed crew neck. Perfect for layering or wearing solo — this is street-ready essentials, elevated.\n\n- 100% Premium Heavyweight Cotton (280 GSM)\n- Dropped Shoulder Construction\n- Reinforced Ribbed Crew Neck\n- Pre-shrunk Fabric\n- Available in Multiple Colorways",
  basePrice: 4500,
  salePrice: null,
  collection: "Essentials",
  category: { name: "T-Shirts" },
  variants: [
    { id: "v1", sku: "SKY-UT-BK-S", size: "S", color: "Black", colorHex: "#000000", stock: 15, price: null },
    { id: "v2", sku: "SKY-UT-BK-M", size: "M", color: "Black", colorHex: "#000000", stock: 20, price: null },
    { id: "v3", sku: "SKY-UT-BK-L", size: "L", color: "Black", colorHex: "#000000", stock: 12, price: null },
    { id: "v4", sku: "SKY-UT-BK-XL", size: "XL", color: "Black", colorHex: "#000000", stock: 8, price: null },
    { id: "v5", sku: "SKY-UT-WH-S", size: "S", color: "White", colorHex: "#FFFFFF", stock: 10, price: null },
    { id: "v6", sku: "SKY-UT-WH-M", size: "M", color: "White", colorHex: "#FFFFFF", stock: 18, price: null },
    { id: "v7", sku: "SKY-UT-WH-L", size: "L", color: "White", colorHex: "#FFFFFF", stock: 14, price: null },
    { id: "v8", sku: "SKY-UT-OL-M", size: "M", color: "Olive", colorHex: "#556B2F", stock: 6, price: null },
    { id: "v9", sku: "SKY-UT-OL-L", size: "L", color: "Olive", colorHex: "#556B2F", stock: 4, price: null },
  ],
  images: [
    { id: "i1", url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop", alt: "Front", position: 0 },
    { id: "i2", url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=1000&fit=crop", alt: "Back", position: 1 },
    { id: "i3", url: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=1000&fit=crop", alt: "Detail", position: 2 },
  ],
  reviews: [
    { id: "r1", rating: 5, title: "Perfect fit", comment: "Best tee I've owned. The heavyweight cotton is luxurious.", user: { name: "Kasun M." }, createdAt: "2024-11-01" },
    { id: "r2", rating: 4, title: "Great quality", comment: "Love the oversized cut. Runs slightly large — size down if between sizes.", user: { name: "Amaya S." }, createdAt: "2024-10-15" },
  ],
  averageRating: 4.5,
  reviewCount: 2,
};

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<ProductData>(placeholderProduct);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [showDescription, setShowDescription] = useState(true);
  const [showReviews, setShowReviews] = useState(false);
  const { addItem, openCart } = useCartStore();

  const colors = [...new Map(product.variants.map((v) => [v.color, v])).values()];
  const availableSizes = product.variants
    .filter((v) => !selectedColor || v.color === selectedColor)
    .filter((v) => v.stock > 0);
  const uniqueSizes = [...new Set(availableSizes.map((v) => v.size))];

  const selectedVariant = product.variants.find(
    (v) => v.color === selectedColor && v.size === selectedSize
  );

  const price =
    selectedVariant?.price || product.salePrice || product.basePrice;

  useEffect(() => {
    if (colors.length > 0 && !selectedColor) {
      setSelectedColor(colors[0].color);
    }
  }, [product]);

  useEffect(() => {
    if (uniqueSizes.length > 0 && !uniqueSizes.includes(selectedSize)) {
      setSelectedSize(uniqueSizes[0]);
    }
  }, [selectedColor]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        }
      } catch {
        // Keep placeholder on error
      }
    };
    if (params.id) fetchProduct();
  }, [params.id]);

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error("Please select a size and color");
      return;
    }
    if (selectedVariant.stock < quantity) {
      toast.error("Not enough stock available");
      return;
    }

    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      size: selectedSize,
      color: selectedColor,
      price,
      quantity,
      image: product.images[0]?.url || "",
      slug: product.slug,
      maxStock: selectedVariant.stock,
    });

    toast.success("Added to bag");
    openCart();
  };

  return (
    <div className="pt-24">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Image Gallery */}
          <div className="space-y-4">
            <motion.div
              key={activeImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-skye-900"
            >
              <img
                src={product.images[activeImage]?.url}
                alt={product.images[activeImage]?.alt || product.name}
                className="h-full w-full object-cover"
              />
            </motion.div>

            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {product.images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    "h-20 w-16 flex-shrink-0 overflow-hidden border-2 transition-colors",
                    i === activeImage
                      ? "border-accent"
                      : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <img
                    src={img.url}
                    alt={img.alt || ""}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <ScrollReveal>
              <p className="text-xs uppercase tracking-[0.3em] text-accent">
                {product.category.name}
                {product.collection && ` / ${product.collection}`}
              </p>
              <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-wider lg:text-4xl">
                {product.name}
              </h1>

              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < Math.round(product.averageRating)
                          ? "fill-accent text-accent"
                          : "text-gray-300"
                      }
                    />
                  ))}
                  <span className="ml-1 text-xs text-gray-500">
                    ({product.reviewCount})
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-baseline gap-3">
                {product.salePrice ? (
                  <>
                    <span className="font-display text-2xl font-bold text-accent">
                      {formatPrice(product.salePrice)}
                    </span>
                    <span className="text-lg text-gray-400 line-through">
                      {formatPrice(product.basePrice)}
                    </span>
                  </>
                ) : (
                  <span className="font-display text-2xl font-bold">
                    {formatPrice(product.basePrice)}
                  </span>
                )}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              {/* Color Selection */}
              <div className="mt-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em]">
                  Color — {selectedColor}
                </p>
                <div className="mt-3 flex gap-2">
                  {colors.map((variant) => (
                    <button
                      key={variant.color}
                      onClick={() => setSelectedColor(variant.color)}
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                        selectedColor === variant.color
                          ? "border-accent scale-110"
                          : "border-gray-200 dark:border-gray-700"
                      )}
                      title={variant.color}
                    >
                      <span
                        className="h-7 w-7 rounded-full border border-gray-200"
                        style={{ backgroundColor: variant.colorHex }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em]">
                    Size — {selectedSize}
                  </p>
                  <button className="text-xs text-accent underline">
                    Size Guide
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["XS", "S", "M", "L", "XL", "XXL"].map((size) => {
                    const available = uniqueSizes.includes(size);
                    return (
                      <button
                        key={size}
                        onClick={() => available && setSelectedSize(size)}
                        disabled={!available}
                        className={cn(
                          "flex h-11 w-14 items-center justify-center text-xs font-medium uppercase transition-all",
                          selectedSize === size
                            ? "bg-skye-900 text-white dark:bg-accent dark:text-skye-900"
                            : available
                            ? "border border-gray-300 hover:border-skye-900 dark:border-gray-600 dark:hover:border-accent"
                            : "border border-gray-200 text-gray-300 line-through dark:border-gray-800 dark:text-gray-700"
                        )}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="mt-8 flex gap-4">
                <div className="flex items-center border border-gray-300 dark:border-gray-600">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-3 transition-colors hover:bg-gray-100 dark:hover:bg-skye-800"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center text-sm font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(
                        Math.min(selectedVariant?.stock || 10, quantity + 1)
                      )
                    }
                    className="px-3 py-3 transition-colors hover:bg-gray-100 dark:hover:bg-skye-800"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button onClick={handleAddToCart} className="btn-primary flex-1 gap-2">
                  <ShoppingBag size={18} />
                  Add to Bag — {formatPrice(price * quantity)}
                </button>
              </div>

              {selectedVariant && selectedVariant.stock <= 5 && (
                <p className="mt-2 text-xs text-orange-500">
                  Only {selectedVariant.stock} left in stock
                </p>
              )}

              {/* Actions */}
              <div className="mt-4 flex gap-4">
                <button className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500 hover:text-accent">
                  <Heart size={16} /> Add to Wishlist
                </button>
                <button className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500 hover:text-accent">
                  <Share2 size={16} /> Share
                </button>
              </div>

              {/* Features */}
              <div className="mt-8 grid grid-cols-3 gap-4 border-t border-gray-200 pt-6 dark:border-gray-800">
                {[
                  { icon: Truck, text: "Free Shipping" },
                  { icon: RotateCcw, text: "14-Day Returns" },
                  { icon: Shield, text: "Quality Guaranteed" },
                ].map((feature) => (
                  <div key={feature.text} className="flex flex-col items-center gap-2 text-center">
                    <feature.icon size={18} className="text-accent" />
                    <span className="text-[10px] uppercase tracking-wider text-gray-500">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            {/* Accordion Sections */}
            <div className="mt-8 border-t border-gray-200 dark:border-gray-800">
              <button
                onClick={() => setShowDescription(!showDescription)}
                className="flex w-full items-center justify-between py-4 text-xs font-semibold uppercase tracking-[0.2em]"
              >
                Description
                <ChevronDown
                  size={16}
                  className={cn(
                    "transition-transform",
                    showDescription && "rotate-180"
                  )}
                />
              </button>
              <AnimatePresence>
                {showDescription && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="whitespace-pre-line pb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                      {product.description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-800">
              <button
                onClick={() => setShowReviews(!showReviews)}
                className="flex w-full items-center justify-between py-4 text-xs font-semibold uppercase tracking-[0.2em]"
              >
                Reviews ({product.reviewCount})
                <ChevronDown
                  size={16}
                  className={cn(
                    "transition-transform",
                    showReviews && "rotate-180"
                  )}
                />
              </button>
              <AnimatePresence>
                {showReviews && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-4 pb-4">
                      {product.reviews.map((review) => (
                        <div
                          key={review.id}
                          className="border-b border-gray-100 pb-4 last:border-0 dark:border-gray-800"
                        >
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  size={12}
                                  className={
                                    i < review.rating
                                      ? "fill-accent text-accent"
                                      : "text-gray-300"
                                  }
                                />
                              ))}
                            </div>
                            <span className="text-xs font-medium">
                              {review.user.name}
                            </span>
                          </div>
                          {review.title && (
                            <p className="mt-1 text-sm font-medium">
                              {review.title}
                            </p>
                          )}
                          {review.comment && (
                            <p className="mt-1 text-sm text-gray-500">
                              {review.comment}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
