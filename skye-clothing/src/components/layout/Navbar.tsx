"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  Sun,
  Moon,
  Heart,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useUIStore } from "@/store/ui";
import { cn } from "@/lib/utils";
import { SearchOverlay } from "./SearchOverlay";

const navLinks = [
  { href: "/products", label: "Shop All" },
  { href: "/collections/new-arrivals", label: "New Arrivals" },
  { href: "/collections/mens", label: "Men" },
  { href: "/collections/womens", label: "Women" },
  { href: "/collections/accessories", label: "Accessories" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { data: session } = useSession();
  const { getItemCount, openCart } = useCartStore();
  const {
    isDarkMode,
    toggleDarkMode,
    isMobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu,
    isSearchOpen,
    toggleSearch,
  } = useUIStore();

  const itemCount = getItemCount();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed left-0 right-0 top-0 z-50 transition-all duration-500",
          scrolled
            ? "glass py-3 shadow-sm"
            : "bg-transparent py-5"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 lg:px-8">
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link href="/" aria-label="Skye Clothing Home">
            <Image
              src="https://skyeclothing.lk/wp-content/uploads/2025/10/cropped-Black-PNG.png"
              alt="Skye Clothing"
              width={120}
              height={48}
              className="h-10 w-auto object-contain dark:invert"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative text-xs font-medium uppercase tracking-[0.2em] transition-colors hover:text-accent"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleSearch}
              className="transition-colors hover:text-accent"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            <button
              onClick={toggleDarkMode}
              className="hidden transition-colors hover:text-accent lg:block"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <Link
              href="/profile"
              className="hidden transition-colors hover:text-accent lg:block"
              aria-label="Account"
            >
              <User size={20} />
            </Link>

            <Link
              href="/profile"
              className="hidden transition-colors hover:text-accent lg:block"
              aria-label="Wishlist"
            >
              <Heart size={20} />
            </Link>

            <button
              onClick={openCart}
              className="relative transition-colors hover:text-accent"
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center bg-accent text-[10px] font-bold text-skye-900"
                >
                  {itemCount}
                </motion.span>
              )}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 z-40 bg-white dark:bg-skye-950 lg:hidden"
          >
            <div className="flex h-full flex-col justify-center px-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={closeMobileMenu}
                    className="block py-4 font-display text-3xl font-bold uppercase tracking-widest"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="mt-8 flex items-center gap-6 border-t border-gray-200 pt-8 dark:border-gray-800">
                <Link
                  href={session ? "/profile" : "/login"}
                  onClick={closeMobileMenu}
                  className="text-sm uppercase tracking-widest"
                >
                  {session ? "Account" : "Sign In"}
                </Link>
                <button
                  onClick={toggleDarkMode}
                  className="text-sm uppercase tracking-widest"
                >
                  {isDarkMode ? "Light Mode" : "Dark Mode"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>{isSearchOpen && <SearchOverlay />}</AnimatePresence>
    </>
  );
}
