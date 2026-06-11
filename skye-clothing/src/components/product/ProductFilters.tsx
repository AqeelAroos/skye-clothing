"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductFiltersProps {
  categories: { id: string; name: string; slug: string }[];
  selectedCategory: string | null;
  selectedSizes: string[];
  selectedColors: string[];
  sortBy: string;
  onCategoryChange: (category: string | null) => void;
  onSizeChange: (sizes: string[]) => void;
  onColorChange: (colors: string[]) => void;
  onSortChange: (sort: string) => void;
}

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
const colors = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Navy", hex: "#1B2A4A" },
  { name: "Gray", hex: "#808080" },
  { name: "Beige", hex: "#D4C5A9" },
  { name: "Olive", hex: "#556B2F" },
  { name: "Burgundy", hex: "#800020" },
  { name: "Brown", hex: "#8B4513" },
];

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
];

export function ProductFilters({
  categories,
  selectedCategory,
  selectedSizes,
  selectedColors,
  sortBy,
  onCategoryChange,
  onSizeChange,
  onColorChange,
  onSortChange,
}: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSize = (size: string) => {
    onSizeChange(
      selectedSizes.includes(size)
        ? selectedSizes.filter((s) => s !== size)
        : [...selectedSizes, size]
    );
  };

  const toggleColor = (color: string) => {
    onColorChange(
      selectedColors.includes(color)
        ? selectedColors.filter((c) => c !== color)
        : [...selectedColors, color]
    );
  };

  const activeFilterCount =
    (selectedCategory ? 1 : 0) + selectedSizes.length + selectedColors.length;

  return (
    <>
      <div className="flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-800">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-sm uppercase tracking-widest"
        >
          <SlidersHorizontal size={16} />
          Filters
          {activeFilterCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center bg-accent text-[10px] font-bold text-skye-900">
              {activeFilterCount}
            </span>
          )}
        </button>

        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="bg-transparent text-sm uppercase tracking-widest outline-none"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid gap-8 border-b border-gray-200 py-6 dark:border-gray-800 md:grid-cols-3">
              <div>
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em]">
                  Category
                </h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => onCategoryChange(null)}
                    className={cn(
                      "px-3 py-1.5 text-xs uppercase tracking-wider transition-colors",
                      !selectedCategory
                        ? "bg-skye-900 text-white dark:bg-accent dark:text-skye-900"
                        : "border border-gray-300 hover:border-skye-900 dark:border-gray-600"
                    )}
                  >
                    All
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => onCategoryChange(cat.slug)}
                      className={cn(
                        "px-3 py-1.5 text-xs uppercase tracking-wider transition-colors",
                        selectedCategory === cat.slug
                          ? "bg-skye-900 text-white dark:bg-accent dark:text-skye-900"
                          : "border border-gray-300 hover:border-skye-900 dark:border-gray-600"
                      )}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em]">
                  Size
                </h4>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={cn(
                        "flex h-9 w-9 items-center justify-center text-xs transition-colors",
                        selectedSizes.includes(size)
                          ? "bg-skye-900 text-white dark:bg-accent dark:text-skye-900"
                          : "border border-gray-300 hover:border-skye-900 dark:border-gray-600"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em]">
                  Color
                </h4>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => toggleColor(color.name)}
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all",
                        selectedColors.includes(color.name)
                          ? "border-accent scale-110"
                          : "border-transparent hover:border-gray-400"
                      )}
                      title={color.name}
                    >
                      <span
                        className="h-5 w-5 rounded-full border border-gray-200"
                        style={{ backgroundColor: color.hex }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
