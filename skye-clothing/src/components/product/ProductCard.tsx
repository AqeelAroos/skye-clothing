"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, Heart, Eye } from "lucide-react";
import { formatPrice, getDiscountPercentage } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    basePrice: number;
    salePrice: number | null;
    images: { url: string; alt: string | null; isHover: boolean }[];
    category: { name: string };
  };
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const primaryImage = product.images.find((img) => !img.isHover) || product.images[0];
  const hoverImage = product.images.find((img) => img.isHover);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-skye-900">
          {primaryImage && (
            <img
              src={primaryImage.url}
              alt={primaryImage.alt || product.name}
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${
                isHovered && hoverImage ? "opacity-0 scale-105" : "opacity-100 scale-100"
              }`}
            />
          )}
          {hoverImage && (
            <img
              src={hoverImage.url}
              alt={hoverImage.alt || product.name}
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${
                isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            />
          )}

          {product.salePrice && (
            <span className="absolute left-3 top-3 bg-accent px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-skye-900">
              -{getDiscountPercentage(product.basePrice, product.salePrice)}%
            </span>
          )}

          <div
            className={`absolute bottom-4 left-4 right-4 flex justify-center gap-2 transition-all duration-300 ${
              isHovered
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            <button
              className="flex h-10 w-10 items-center justify-center bg-white/90 backdrop-blur-sm transition-colors hover:bg-accent dark:bg-skye-900/90"
              aria-label="Quick view"
              onClick={(e) => e.preventDefault()}
            >
              <Eye size={16} />
            </button>
            <button
              className="flex h-10 w-10 items-center justify-center bg-white/90 backdrop-blur-sm transition-colors hover:bg-accent dark:bg-skye-900/90"
              aria-label="Add to wishlist"
              onClick={(e) => e.preventDefault()}
            >
              <Heart size={16} />
            </button>
            <button
              className="flex h-10 flex-1 items-center justify-center gap-2 bg-skye-900 text-xs font-medium uppercase tracking-wider text-white transition-colors hover:bg-accent hover:text-skye-900"
              aria-label="Add to bag"
              onClick={(e) => e.preventDefault()}
            >
              <ShoppingBag size={14} />
              Add to Bag
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-1">
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
            {product.category.name}
          </p>
          <h3 className="text-sm font-medium">{product.name}</h3>
          <div className="flex items-center gap-2">
            {product.salePrice ? (
              <>
                <span className="text-sm font-semibold text-accent">
                  {formatPrice(product.salePrice)}
                </span>
                <span className="text-xs text-gray-400 line-through">
                  {formatPrice(product.basePrice)}
                </span>
              </>
            ) : (
              <span className="text-sm font-semibold">
                {formatPrice(product.basePrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
