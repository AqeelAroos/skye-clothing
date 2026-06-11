import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, Twitter } from "lucide-react";

const footerLinks = {
  shop: [
    { label: "All Products", href: "/products" },
    { label: "New Arrivals", href: "/collections/new-arrivals" },
    { label: "Men", href: "/collections/mens" },
    { label: "Women", href: "/collections/womens" },
    { label: "Accessories", href: "/collections/accessories" },
  ],
  support: [
    { label: "Contact Us", href: "/contact" },
    { label: "Shipping Info", href: "/shipping" },
    { label: "Returns & Exchanges", href: "/returns" },
    { label: "Size Guide", href: "/size-guide" },
    { label: "FAQs", href: "/faq" },
  ],
  company: [
    { label: "About Skye Clothing", href: "/about" },
    { label: "Our Story", href: "/story" },
    { label: "Sustainability", href: "/sustainability" },
    { label: "Careers", href: "/careers" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-skye-950">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-4">
          <div>
            <Link href="/" aria-label="Skye Clothing Home">
              <Image
                src="https://skyeclothing.lk/wp-content/uploads/2025/10/cropped-Black-PNG.png"
                alt="Skye Clothing"
                width={120}
                height={48}
                className="h-10 w-auto object-contain dark:invert"
              />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              Premium modern clothing from Skye Clothing. Elevating everyday
              wear with contemporary design, crafted for the bold and the free.
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href="#"
                className="text-gray-400 transition-colors hover:text-accent"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 transition-colors hover:text-accent"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 transition-colors hover:text-accent"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em]">
              Shop
            </h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 transition-colors hover:text-accent dark:text-gray-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em]">
              Support
            </h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 transition-colors hover:text-accent dark:text-gray-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em]">
              Company
            </h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 transition-colors hover:text-accent dark:text-gray-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-8 dark:border-gray-800 lg:flex-row">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Skye Clothing. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-gray-400">
            <Link href="/privacy" className="hover:text-accent">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-accent">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
