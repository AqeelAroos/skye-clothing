"use client";

import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: {
    id: string;
    name: string;
    slug: string;
    basePrice: number;
    salePrice: number | null;
    images: { url: string; alt: string | null; isHover: boolean }[];
    category: { name: string };
  }[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="font-display text-2xl font-bold">No products found</p>
          <p className="mt-2 text-sm text-gray-500">
            Try adjusting your filters or search terms.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}
