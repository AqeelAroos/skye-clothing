"use client";

import { useState, useEffect } from "react";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductFilters } from "@/components/product/ProductFilters";
import { SplitText } from "@/components/animations/SplitText";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

interface Product {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  salePrice: number | null;
  images: { url: string; alt: string | null; isHover: boolean }[];
  category: { id: string; name: string; slug: string };
}

const staticCategories = [
  { id: "1", name: "T-Shirts", slug: "t-shirts" },
  { id: "2", name: "Hoodies", slug: "hoodies" },
  { id: "3", name: "Pants", slug: "pants" },
  { id: "4", name: "Jackets", slug: "jackets" },
  { id: "5", name: "Accessories", slug: "accessories" },
];

const placeholderProducts: Product[] = [
  {
    id: "1", name: "Oversized Urban Tee", slug: "oversized-urban-tee", basePrice: 4500, salePrice: null,
    images: [
      { url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop", alt: "Urban Tee", isHover: false },
      { url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=800&fit=crop", alt: "Urban Tee Back", isHover: true },
    ],
    category: { id: "1", name: "T-Shirts", slug: "t-shirts" },
  },
  {
    id: "2", name: "Minimal Cargo Pants", slug: "minimal-cargo-pants", basePrice: 8900, salePrice: 6900,
    images: [
      { url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=800&fit=crop", alt: "Cargo Pants", isHover: false },
    ],
    category: { id: "3", name: "Pants", slug: "pants" },
  },
  {
    id: "3", name: "Essential Hoodie", slug: "essential-hoodie", basePrice: 7500, salePrice: null,
    images: [
      { url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=800&fit=crop", alt: "Hoodie", isHover: false },
    ],
    category: { id: "2", name: "Hoodies", slug: "hoodies" },
  },
  {
    id: "4", name: "Structured Bomber Jacket", slug: "structured-bomber-jacket", basePrice: 12500, salePrice: 9900,
    images: [
      { url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop", alt: "Bomber", isHover: false },
    ],
    category: { id: "4", name: "Jackets", slug: "jackets" },
  },
  {
    id: "5", name: "Classic Crew Neck", slug: "classic-crew-neck", basePrice: 3800, salePrice: null,
    images: [
      { url: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=800&fit=crop", alt: "Crew Neck", isHover: false },
    ],
    category: { id: "1", name: "T-Shirts", slug: "t-shirts" },
  },
  {
    id: "6", name: "Slim Fit Joggers", slug: "slim-fit-joggers", basePrice: 5900, salePrice: null,
    images: [
      { url: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&h=800&fit=crop", alt: "Joggers", isHover: false },
    ],
    category: { id: "3", name: "Pants", slug: "pants" },
  },
  {
    id: "7", name: "Windbreaker Jacket", slug: "windbreaker-jacket", basePrice: 9500, salePrice: 7500,
    images: [
      { url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop", alt: "Windbreaker", isHover: false },
    ],
    category: { id: "4", name: "Jackets", slug: "jackets" },
  },
  {
    id: "8", name: "Graphic Print Tee", slug: "graphic-print-tee", basePrice: 4200, salePrice: 3200,
    images: [
      { url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=800&fit=crop", alt: "Graphic Tee", isHover: false },
    ],
    category: { id: "1", name: "T-Shirts", slug: "t-shirts" },
  },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(placeholderProducts);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory) params.set("category", selectedCategory);
        if (selectedSizes.length) params.set("sizes", selectedSizes.join(","));
        if (selectedColors.length) params.set("colors", selectedColors.join(","));
        params.set("sort", sortBy);

        const res = await fetch(`/api/products?${params}`);
        if (res.ok) {
          const data = await res.json();
          if (data.products.length > 0) {
            setProducts(data.products);
          }
        }
      } catch {
        // Keep placeholder products on error
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, selectedSizes, selectedColors, sortBy]);

  const filtered = selectedCategory
    ? products.filter((p) => p.category.slug === selectedCategory)
    : products;

  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return (a.salePrice || a.basePrice) - (b.salePrice || b.basePrice);
      case "price-desc":
        return (b.salePrice || b.basePrice) - (a.salePrice || a.basePrice);
      default:
        return 0;
    }
  });

  return (
    <div className="pt-24">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="mb-12">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.3em] text-accent">
              Explore
            </p>
          </ScrollReveal>
          <SplitText
            text="All Products"
            as="h1"
            className="mt-2 font-display text-4xl font-bold uppercase tracking-wider lg:text-5xl"
          />
        </div>

        <ProductFilters
          categories={staticCategories}
          selectedCategory={selectedCategory}
          selectedSizes={selectedSizes}
          selectedColors={selectedColors}
          sortBy={sortBy}
          onCategoryChange={setSelectedCategory}
          onSizeChange={setSelectedSizes}
          onColorChange={setSelectedColors}
          onSortChange={setSortBy}
        />

        <div className="mt-8">
          {loading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-gray-200 dark:bg-skye-800" />
                  <div className="mt-4 space-y-2">
                    <div className="h-3 w-16 bg-gray-200 dark:bg-skye-800" />
                    <div className="h-4 w-32 bg-gray-200 dark:bg-skye-800" />
                    <div className="h-4 w-20 bg-gray-200 dark:bg-skye-800" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ProductGrid products={sorted} />
          )}
        </div>
      </div>
    </div>
  );
}
