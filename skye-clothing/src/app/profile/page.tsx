"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  User,
  Package,
  Heart,
  MapPin,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { useEffect } from "react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center pt-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!session) return null;

  const isAdmin = (session.user as { role?: string })?.role === "ADMIN";

  const menuItems = [
    { href: "/profile/orders", icon: Package, label: "Order History" },
    { href: "/profile", icon: Heart, label: "Wishlist" },
    { href: "/profile", icon: MapPin, label: "Saved Addresses" },
    { href: "/profile", icon: User, label: "Account Settings" },
  ];

  return (
    <div className="pt-24">
      <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center bg-accent text-skye-900">
              <User size={28} />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold uppercase tracking-wider">
                {session.user?.name || "User"}
              </h1>
              <p className="text-sm text-gray-500">{session.user?.email}</p>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {menuItems.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-4 border border-gray-200 p-5 transition-colors hover:border-accent dark:border-gray-800"
                >
                  <item.icon size={20} className="text-accent" />
                  <span className="text-sm font-medium uppercase tracking-widest">
                    {item.label}
                  </span>
                </Link>
              </motion.div>
            ))}

            {isAdmin && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link
                  href="/admin/dashboard"
                  className="flex items-center gap-4 border border-accent bg-accent/5 p-5 transition-colors hover:bg-accent/10"
                >
                  <ShieldCheck size={20} className="text-accent" />
                  <span className="text-sm font-medium uppercase tracking-widest">
                    Admin Dashboard
                  </span>
                </Link>
              </motion.div>
            )}
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="mt-8 flex items-center gap-2 text-sm uppercase tracking-widest text-gray-500 hover:text-red-500"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </motion.div>
      </div>
    </div>
  );
}
