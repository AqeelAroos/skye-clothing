"use client";

import { useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Truck, Shield, RotateCcw, Star } from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { SplitText } from "@/components/animations/SplitText";
import { ParallaxImage } from "@/components/animations/ParallaxImage";
import { ProductCard } from "@/components/product/ProductCard";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { heroScrollProgress } from "@/lib/scroll-progress";

gsap.registerPlugin(ScrollTrigger);

const HeroScene = dynamic(
  () =>
    import("@/components/three/HeroScene").then((mod) => ({
      default: mod.HeroScene,
    })),
  { ssr: false },
);

const HERO_TEXT = "SKYE CLOTHING";

const featuredProducts = [
  {
    id: "1",
    name: "Polo Knit — 7CPC",
    slug: "polo-knit-7cpc",
    basePrice: 4950,
    salePrice: null,
    images: [
      {
        url: "https://skyeclothing.lk/wp-content/uploads/2026/05/Polo-Knit-7CPC-04-630x630.jpg",
        alt: "Polo Knit 7CPC",
        isHover: false,
      },
      {
        url: "https://skyeclothing.lk/wp-content/uploads/2026/05/Polo-Knit-7JSM-04-630x630.jpg",
        alt: "Polo Knit 7CPC Alt",
        isHover: true,
      },
    ],
    category: { name: "Polo Knit" },
  },
  {
    id: "2",
    name: "Polo Knit — 7BSK",
    slug: "polo-knit-7bsk",
    basePrice: 4950,
    salePrice: null,
    images: [
      {
        url: "https://skyeclothing.lk/wp-content/uploads/2026/05/Polo-Knit-7BSK-01-630x630.jpg",
        alt: "Polo Knit 7BSK",
        isHover: false,
      },
      {
        url: "https://skyeclothing.lk/wp-content/uploads/2026/05/Polo-Knit-7GUS-04-630x630.jpg",
        alt: "Polo Knit 7BSK Alt",
        isHover: true,
      },
    ],
    category: { name: "Polo Knit" },
  },
  {
    id: "3",
    name: "Polo Knit — 7FMD",
    slug: "polo-knit-7fmd",
    basePrice: 4950,
    salePrice: null,
    images: [
      {
        url: "https://skyeclothing.lk/wp-content/uploads/2026/05/Polo-Knit-7FMD-01-630x630.jpg",
        alt: "Polo Knit 7FMD",
        isHover: false,
      },
      {
        url: "https://skyeclothing.lk/wp-content/uploads/2026/05/Polo-Knit-7BCM-03-630x630.jpg",
        alt: "Polo Knit 7FMD Alt",
        isHover: true,
      },
    ],
    category: { name: "Polo Knit" },
  },
  {
    id: "4",
    name: "Polo Knit — 7KWW",
    slug: "polo-knit-7kww",
    basePrice: 4950,
    salePrice: null,
    images: [
      {
        url: "https://skyeclothing.lk/wp-content/uploads/2026/05/Polo-Knit-7KWW-04-630x630.jpg",
        alt: "Polo Knit 7KWW",
        isHover: false,
      },
      {
        url: "https://skyeclothing.lk/wp-content/uploads/2026/05/Polo-Knit-7SKG-04-630x630.jpg",
        alt: "Polo Knit 7KWW Alt",
        isHover: true,
      },
    ],
    category: { name: "Polo Knit" },
  },
];

const collections = [
  {
    name: "Basics",
    slug: "basics",
    image:
      "https://skyeclothing.lk/wp-content/uploads/2024/07/Crew-Neck-Maroon-01-650x572.jpg",
    description: "Everyday essentials, perfected.",
  },
  {
    name: "Classic Polos",
    slug: "classic-polos",
    image:
      "https://skyeclothing.lk/wp-content/uploads/2023/04/4.1.-Classic-Polo-Black-01-1-1-650x572.jpg",
    description: "Timeless style, refined fit.",
  },
  {
    name: "Collared Tees",
    slug: "collared-tees",
    image:
      "https://skyeclothing.lk/wp-content/uploads/2023/04/Anchor-1-1-650x572.jpg",
    description: "Smart casual, effortlessly.",
  },
];

export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const sparkleRef = useRef<HTMLDivElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const setCharRef = useCallback(
    (i: number) => (el: HTMLSpanElement | null) => {
      charRefs.current[i] = el;
    },
    [],
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => {
          heroScrollProgress.current = self.progress;
        },
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: "15% top",
          end: "75% top",
          scrub: 1.2,
        },
      });

      tl.to(
        charRefs.current.filter(Boolean),
        {
          opacity: 0,
          y: -60,
          scale: 0.7,
          rotateX: 40,
          stagger: 0.025,
          duration: 1,
          ease: "power2.in",
        },
        0,
      );

      tl.to(
        taglineRef.current,
        { opacity: 0, y: -30, duration: 0.7, ease: "power2.in" },
        0.15,
      );

      tl.to(
        buttonsRef.current,
        { opacity: 0, y: 40, duration: 0.7, ease: "power2.in" },
        0.2,
      );

      tl.to(
        sparkleRef.current,
        { opacity: 0, scale: 0, duration: 0.5, ease: "power2.in" },
        0.1,
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* ───── HERO ───── */}
      <section
        ref={heroRef}
        className="relative h-screen overflow-hidden"
      >
        <HeroScene />

        {/* DOM overlay — Layer 2 */}
        <div className="relative z-10 flex h-full items-end justify-center px-4 pb-[14vh]">
          <div className="text-center">
            {/* Main heading — split into chars for GSAP */}
            <h1
              className="whitespace-nowrap font-display font-bold uppercase leading-[0.9]"
              style={{
                fontSize: "clamp(2rem, 6.2vw, 8rem)",
                letterSpacing: "0.1em",
                color: "#e0e8f0",
                textShadow: `
                  0 1px 0 rgba(160,200,255,0.15),
                  0 -1px 2px rgba(0,0,0,0.6),
                  0 3px 8px rgba(0,0,0,0.5),
                  0 0 40px rgba(60,120,200,0.2)
                `,
                perspective: "800px",
              }}
            >
              {HERO_TEXT.split("").map((char, i) => (
                <span
                  key={i}
                  ref={setCharRef(i)}
                  className="inline-block"
                  style={{ willChange: "transform, opacity" }}
                >
                  {char === " " ? " " : char}
                </span>
              ))}
            </h1>

            {/* Tagline */}
            <p
              ref={taglineRef}
              className="mt-3 text-[10px] uppercase tracking-[0.3em] text-white/60 sm:text-xs md:text-sm"
            >
              Elevated Streetwear for the Modern Era
            </p>

            {/* CTA buttons */}
            <div
              ref={buttonsRef}
              className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            >
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 border border-white/50 bg-white/10 px-8 py-3 text-sm font-semibold uppercase tracking-widest text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
              >
                Shop Collection
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/collections/new-arrivals"
                className="inline-flex items-center justify-center border border-white/40 px-8 py-3 text-sm font-medium uppercase tracking-widest text-white transition-all duration-300 hover:border-white hover:bg-white/10"
              >
                New Arrivals
              </Link>
            </div>
          </div>
        </div>

        {/* 4-pointed sparkle — bottom right */}
        <div
          ref={sparkleRef}
          className="absolute bottom-24 right-8 z-10 text-white/80 md:bottom-32 md:right-16"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 32 32"
            fill="currentColor"
          >
            <path d="M16 0 L18 14 L32 16 L18 18 L16 32 L14 18 L0 16 L14 14 Z" />
          </svg>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="flex h-8 w-5 items-start justify-center rounded-full border border-white/30"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="mt-1.5 h-1.5 w-1 rounded-full bg-white/70"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ───── FEATURES BAR ───── */}
      <section className="border-b border-t border-gray-200 dark:border-gray-800">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-gray-200 dark:divide-gray-800 lg:grid-cols-4">
          {[
            { icon: Truck, text: "Free Shipping Over LKR 10,000" },
            { icon: Shield, text: "Secure Payment Gateway" },
            { icon: RotateCcw, text: "14-Day Easy Returns" },
            { icon: Star, text: "Premium Quality Assured" },
          ].map((feature) => (
            <div
              key={feature.text}
              className="flex items-center justify-center gap-3 px-4 py-5"
            >
              <feature.icon
                size={18}
                className="flex-shrink-0 text-accent"
              />
              <span className="text-[11px] uppercase tracking-wider">
                {feature.text}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ───── FEATURED PRODUCTS ───── */}
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <ScrollReveal>
              <p className="text-xs uppercase tracking-[0.3em] text-accent">
                Curated Selection
              </p>
            </ScrollReveal>
            <SplitText
              text="Featured Pieces"
              as="h2"
              className="mt-2 font-display text-4xl font-bold uppercase tracking-wider lg:text-5xl"
              delay={0.2}
            />
          </div>
          <ScrollReveal delay={0.4}>
            <Link
              href="/products"
              className="group flex items-center gap-2 text-xs uppercase tracking-widest"
            >
              View All
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
          {featuredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
            />
          ))}
        </div>
      </section>

      {/* ───── COLLECTIONS ───── */}
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <div className="mb-12 text-center">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.3em] text-accent">
              Explore
            </p>
          </ScrollReveal>
          <SplitText
            text="Shop by Collection"
            as="h2"
            className="mt-2 font-display text-4xl font-bold uppercase tracking-wider lg:text-5xl"
            delay={0.2}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3 lg:gap-6">
          {collections.map((collection, i) => (
            <ScrollReveal key={collection.slug} delay={i * 0.15}>
              <Link
                href={`/collections/${collection.slug}`}
                className="group relative block aspect-[3/4] overflow-hidden"
              >
                <ParallaxImage
                  src={collection.image}
                  alt={collection.name}
                  className="absolute inset-0"
                  speed={0.2}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-all duration-500 group-hover:from-black/80" />
                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                  <p className="text-xs uppercase tracking-[0.3em] text-accent">
                    {collection.description}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-bold uppercase tracking-wider text-white lg:text-3xl">
                    {collection.name}
                  </h3>
                  <div className="mt-4 flex items-center gap-2 text-xs uppercase tracking-widest text-white/80 transition-colors group-hover:text-accent">
                    Explore
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ───── BRAND STATEMENT ───── */}
      <section className="bg-skye-900 py-24 text-white dark:bg-skye-950">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.3em] text-accent">
              Our Philosophy
            </p>
          </ScrollReveal>
          <SplitText
            text="Where urban meets elevated. Every piece is designed to make a statement without saying a word."
            as="p"
            className="mt-6 font-display text-2xl font-light leading-relaxed tracking-wide lg:text-4xl"
            delay={0.3}
          />
          <ScrollReveal delay={0.8}>
            <Link
              href="/about"
              className="mt-10 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-accent transition-colors hover:text-white"
            >
              Our Story
              <ArrowRight size={14} />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ───── NEWSLETTER ───── */}
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.3em] text-accent">
              Stay Connected
            </p>
          </ScrollReveal>
          <SplitText
            text="Join the Skye Clothing Community"
            as="h2"
            className="mt-2 font-display text-3xl font-bold uppercase tracking-wider"
            delay={0.2}
          />
          <ScrollReveal delay={0.4}>
            <p className="mt-4 text-sm text-gray-500">
              Get early access to new drops, exclusive offers, and style
              inspiration delivered to your inbox.
            </p>
            <form
              className="mt-6 flex gap-0"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Your email address"
                className="input-field flex-1"
              />
              <button type="submit" className="btn-primary">
                Subscribe
              </button>
            </form>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
