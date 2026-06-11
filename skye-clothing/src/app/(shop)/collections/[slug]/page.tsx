"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SplitText } from "@/components/animations/SplitText";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

const collectionMeta: Record<string, { title: string; description: string }> = {
  "new-arrivals": {
    title: "New Arrivals",
    description: "Fresh drops. Limited pieces. Be first.",
  },
  mens: {
    title: "Men's Collection",
    description: "Bold. Refined. Unapologetic.",
  },
  womens: {
    title: "Women's Collection",
    description: "Effortless elegance, redefined.",
  },
  accessories: {
    title: "Accessories",
    description: "The finishing touches that define your look.",
  },
};

const placeholderProducts = [
  {
    id: "1", name: "Oversized Urban Tee", slug: "oversized-urban-tee", basePrice: 4500, salePrice: null,
    images: [{ url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop", alt: "Urban Tee", isHover: false }],
    category: { name: "T-Shirts" },
  },
  {
    id: "2", name: "Essential Hoodie", slug: "essential-hoodie", basePrice: 7500, salePrice: null,
    images: [{ url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=800&fit=crop", alt: "Hoodie", isHover: false }],
    category: { name: "Hoodies" },
  },
  {
    id: "3", name: "Structured Bomber", slug: "structured-bomber-jacket", basePrice: 12500, salePrice: 9900,
    images: [{ url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop", alt: "Bomber", isHover: false }],
    category: { name: "Jackets" },
  },
  {
    id: "4", name: "Minimal Cargo Pants", slug: "minimal-cargo-pants", basePrice: 8900, salePrice: 6900,
    images: [{ url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=800&fit=crop", alt: "Cargo", isHover: false }],
    category: { name: "Pants" },
  },
];

export default function CollectionPage() {
  const params = useParams();
  const slug = params.slug as string;
  const meta = collectionMeta[slug] || { title: slug, description: "" };
  const [products, setProducts] = useState(placeholderProducts);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`/api/products?category=${slug}`);
        if (res.ok) {
          const data = await res.json();
          if (data.products.length > 0) setProducts(data.products);
        }
      } catch {
        // Keep placeholders
      }
    };
    fetchProducts();
  }, [slug]);

  return (
    <div className="pt-24">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="mb-12">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.3em] text-accent">
              {meta.description}
            </p>
          </ScrollReveal>
          <SplitText
            text={meta.title}
            as="h1"
            className="mt-2 font-display text-4xl font-bold uppercase tracking-wider lg:text-5xl"
          />
        </div>

        <ProductGrid products={products} />
      </div>
    </div>
  );
}
