"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useUIStore } from "@/store/ui";
import Link from "next/link";

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  images: { url: string }[];
}

export function SearchOverlay() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { closeSearch } = useUIStore();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query)}`
        );
        if (res.ok) {
          const data = await res.json();
          setResults(data.products || []);
        }
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 z-50 bg-white/95 backdrop-blur-xl dark:bg-skye-950/95"
    >
      <div className="mx-auto max-w-3xl px-4 pt-32">
        <div className="flex items-center gap-4 border-b-2 border-skye-900 pb-4 dark:border-accent">
          <Search size={24} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent font-display text-2xl font-light outline-none placeholder:text-gray-400"
          />
          <button onClick={closeSearch} aria-label="Close search">
            <X size={24} />
          </button>
        </div>

        <div className="mt-8">
          {loading && (
            <p className="text-sm uppercase tracking-widest text-gray-500">
              Searching...
            </p>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-4">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  onClick={closeSearch}
                  className="flex items-center gap-4 p-4 transition-colors hover:bg-gray-50 dark:hover:bg-skye-900/50"
                >
                  {product.images[0] && (
                    <div className="h-16 w-16 flex-shrink-0 bg-gray-100 dark:bg-skye-800">
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">
                      LKR {product.basePrice.toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!loading && query.length >= 2 && results.length === 0 && (
            <p className="text-sm text-gray-500">
              No products found for &quot;{query}&quot;
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
