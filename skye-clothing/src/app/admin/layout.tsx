"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const sidebarLinks = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/products", icon: Package, label: "Products" },
  { href: "/admin/orders", icon: ShoppingCart, label: "Orders" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (
      status === "authenticated" &&
      (session.user as { role?: string })?.role !== "ADMIN"
    ) {
      router.push("/");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (
    !session ||
    (session.user as { role?: string })?.role !== "ADMIN"
  ) {
    return null;
  }

  return (
    <div className="flex min-h-screen pt-20">
      <aside className="fixed left-0 top-20 hidden h-[calc(100vh-5rem)] w-56 border-r border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-skye-950 lg:block">
        <Link
          href="/"
          className="mb-6 flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500 hover:text-accent"
        >
          <ArrowLeft size={14} />
          Back to Store
        </Link>

        <nav className="space-y-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm transition-colors",
                pathname === link.href
                  ? "bg-accent/10 font-medium text-accent"
                  : "text-gray-500 hover:bg-gray-50 hover:text-foreground dark:hover:bg-skye-900"
              )}
            >
              <link.icon size={18} />
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex-1 lg:ml-56">
        <div className="p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
