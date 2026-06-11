"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Eye, EyeOff, Search } from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";

interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  salePrice: number | null;
  published: boolean;
  featured: boolean;
  category: { name: string };
  images: { url: string }[];
  variants: { id: string; size: string; color: string; stock: number }[];
  _count: { orderItems: number; reviews: number };
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    basePrice: "",
    salePrice: "",
    categoryId: "",
    featured: false,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/admin/products");
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products);
        }
      } catch {
        // Handle silently
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const togglePublished = async (id: string, published: boolean) => {
    try {
      await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, published: !published }),
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, published: !published } : p))
      );
    } catch {
      // Handle silently
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const getTotalStock = (variants: { stock: number }[]) =>
    variants.reduce((sum, v) => sum + v.stock, 0);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold uppercase tracking-wider">
          Products
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary gap-2 text-xs"
        >
          <Plus size={14} />
          Add Product
        </button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-6 border border-gray-200 p-6 dark:border-gray-800"
        >
          <h2 className="text-sm font-semibold uppercase tracking-widest">
            New Product
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-gray-500">Name</label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500">
                Base Price (LKR)
              </label>
              <input
                type="number"
                value={newProduct.basePrice}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, basePrice: e.target.value })
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500">
                Sale Price (LKR)
              </label>
              <input
                type="number"
                value={newProduct.salePrice}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, salePrice: e.target.value })
                }
                className="input-field"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-gray-500">
                Description
              </label>
              <textarea
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
                rows={3}
                className="input-field resize-none"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="btn-primary text-xs">Save Product</button>
            <button
              onClick={() => setShowForm(false)}
              className="btn-secondary text-xs"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      <div className="mt-6">
        <div className="flex items-center gap-2 border border-gray-200 px-3 dark:border-gray-800">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent py-2.5 text-sm outline-none"
          />
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="pb-3 text-left text-xs uppercase tracking-widest text-gray-500">
                Product
              </th>
              <th className="pb-3 text-left text-xs uppercase tracking-widest text-gray-500">
                Category
              </th>
              <th className="pb-3 text-right text-xs uppercase tracking-widest text-gray-500">
                Price
              </th>
              <th className="pb-3 text-right text-xs uppercase tracking-widest text-gray-500">
                Stock
              </th>
              <th className="pb-3 text-right text-xs uppercase tracking-widest text-gray-500">
                Sales
              </th>
              <th className="pb-3 text-right text-xs uppercase tracking-widest text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3"><div className="h-4 w-40 bg-gray-200 dark:bg-skye-800" /></td>
                    <td className="py-3"><div className="h-4 w-20 bg-gray-200 dark:bg-skye-800" /></td>
                    <td className="py-3"><div className="ml-auto h-4 w-16 bg-gray-200 dark:bg-skye-800" /></td>
                    <td className="py-3"><div className="ml-auto h-4 w-12 bg-gray-200 dark:bg-skye-800" /></td>
                    <td className="py-3"><div className="ml-auto h-4 w-10 bg-gray-200 dark:bg-skye-800" /></td>
                    <td className="py-3"><div className="ml-auto h-4 w-16 bg-gray-200 dark:bg-skye-800" /></td>
                  </tr>
                ))
              : filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-100 dark:border-gray-800"
                  >
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-8 flex-shrink-0 bg-gray-100 dark:bg-skye-800">
                          {product.images[0] && (
                            <img
                              src={product.images[0].url}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          {product.featured && (
                            <span className="text-[10px] text-accent">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-gray-500">
                      {product.category.name}
                    </td>
                    <td className="py-3 text-right">
                      {product.salePrice ? (
                        <div>
                          <span className="font-medium text-accent">
                            {formatPrice(product.salePrice)}
                          </span>
                          <br />
                          <span className="text-xs text-gray-400 line-through">
                            {formatPrice(product.basePrice)}
                          </span>
                        </div>
                      ) : (
                        formatPrice(product.basePrice)
                      )}
                    </td>
                    <td className="py-3 text-right">
                      <span
                        className={cn(
                          "font-medium",
                          getTotalStock(product.variants) <= 5
                            ? "text-red-500"
                            : ""
                        )}
                      >
                        {getTotalStock(product.variants)}
                      </span>
                    </td>
                    <td className="py-3 text-right text-gray-500">
                      {product._count.orderItems}
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            togglePublished(product.id, product.published)
                          }
                          className={cn(
                            "transition-colors",
                            product.published
                              ? "text-green-500 hover:text-red-500"
                              : "text-gray-400 hover:text-green-500"
                          )}
                          title={
                            product.published ? "Unpublish" : "Publish"
                          }
                        >
                          {product.published ? (
                            <Eye size={16} />
                          ) : (
                            <EyeOff size={16} />
                          )}
                        </button>
                        <button className="text-gray-400 hover:text-accent">
                          <Edit size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
