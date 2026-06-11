import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123456", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@skyeclothing.lk" },
    update: {},
    create: {
      email: "admin@skyeclothing.lk",
      name: "Skye Admin",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("Admin user created:", admin.email);

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "t-shirts" },
      update: {},
      create: { name: "T-Shirts", slug: "t-shirts", description: "Premium tees for every occasion" },
    }),
    prisma.category.upsert({
      where: { slug: "hoodies" },
      update: {},
      create: { name: "Hoodies", slug: "hoodies", description: "Cozy yet elevated hoodies" },
    }),
    prisma.category.upsert({
      where: { slug: "pants" },
      update: {},
      create: { name: "Pants", slug: "pants", description: "Tailored and casual pants" },
    }),
    prisma.category.upsert({
      where: { slug: "jackets" },
      update: {},
      create: { name: "Jackets", slug: "jackets", description: "Outerwear that makes a statement" },
    }),
    prisma.category.upsert({
      where: { slug: "accessories" },
      update: {},
      create: { name: "Accessories", slug: "accessories", description: "Finishing touches" },
    }),
  ]);

  const [tshirts, hoodies, pants, jackets, accessories] = categories;
  console.log("Categories created:", categories.length);

  // Create products
  const products = [
    {
      name: "Oversized Urban Tee",
      slug: "oversized-urban-tee",
      description: "Crafted from premium heavyweight cotton, the Oversized Urban Tee delivers an effortlessly cool silhouette. Features dropped shoulders, a relaxed boxy fit, and ribbed crew neck.\n\n- 100% Premium Heavyweight Cotton (280 GSM)\n- Dropped Shoulder Construction\n- Reinforced Ribbed Crew Neck\n- Pre-shrunk Fabric",
      basePrice: 4500,
      salePrice: null,
      categoryId: tshirts.id,
      collection: "Essentials",
      tags: ["tee", "oversized", "cotton", "urban"],
      featured: true,
      images: [
        { url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop", alt: "Oversized Urban Tee Front", isHover: false },
        { url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=1000&fit=crop", alt: "Oversized Urban Tee Back", isHover: true },
      ],
      variants: [
        { sku: "SKY-UT-BK-S", size: "S", color: "Black", colorHex: "#000000", stock: 15 },
        { sku: "SKY-UT-BK-M", size: "M", color: "Black", colorHex: "#000000", stock: 20 },
        { sku: "SKY-UT-BK-L", size: "L", color: "Black", colorHex: "#000000", stock: 12 },
        { sku: "SKY-UT-BK-XL", size: "XL", color: "Black", colorHex: "#000000", stock: 8 },
        { sku: "SKY-UT-WH-S", size: "S", color: "White", colorHex: "#FFFFFF", stock: 10 },
        { sku: "SKY-UT-WH-M", size: "M", color: "White", colorHex: "#FFFFFF", stock: 18 },
        { sku: "SKY-UT-WH-L", size: "L", color: "White", colorHex: "#FFFFFF", stock: 14 },
        { sku: "SKY-UT-OL-M", size: "M", color: "Olive", colorHex: "#556B2F", stock: 6 },
        { sku: "SKY-UT-OL-L", size: "L", color: "Olive", colorHex: "#556B2F", stock: 4 },
      ],
    },
    {
      name: "Minimal Cargo Pants",
      slug: "minimal-cargo-pants",
      description: "Redefining utility wear with a minimalist approach. These cargo pants feature streamlined pockets, a tapered fit, and premium cotton-twill construction.\n\n- 98% Cotton, 2% Elastane\n- Tapered Leg with Ankle Zip\n- Utility Pockets with Hidden Closures\n- YKK Hardware",
      basePrice: 8900,
      salePrice: 6900,
      categoryId: pants.id,
      collection: "Urban",
      tags: ["cargo", "pants", "minimal", "tapered"],
      featured: true,
      images: [
        { url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&h=1000&fit=crop", alt: "Minimal Cargo Pants", isHover: false },
        { url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=1000&fit=crop", alt: "Minimal Cargo Side", isHover: true },
      ],
      variants: [
        { sku: "SKY-CP-BK-S", size: "S", color: "Black", colorHex: "#000000", stock: 10 },
        { sku: "SKY-CP-BK-M", size: "M", color: "Black", colorHex: "#000000", stock: 15 },
        { sku: "SKY-CP-BK-L", size: "L", color: "Black", colorHex: "#000000", stock: 8 },
        { sku: "SKY-CP-KH-M", size: "M", color: "Khaki", colorHex: "#C3B091", stock: 12 },
        { sku: "SKY-CP-KH-L", size: "L", color: "Khaki", colorHex: "#C3B091", stock: 10 },
      ],
    },
    {
      name: "Essential Hoodie",
      slug: "essential-hoodie",
      description: "The cornerstone of any modern wardrobe. Our Essential Hoodie is built from French terry fabric with a brushed interior for unmatched comfort.\n\n- 100% French Terry Cotton (350 GSM)\n- Kangaroo Pocket\n- Adjustable Drawstring Hood\n- Ribbed Cuffs and Hem",
      basePrice: 7500,
      salePrice: null,
      categoryId: hoodies.id,
      collection: "Essentials",
      tags: ["hoodie", "essential", "french-terry", "comfort"],
      featured: true,
      images: [
        { url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=1000&fit=crop", alt: "Essential Hoodie", isHover: false },
        { url: "https://images.unsplash.com/photo-1578768079470-62f67e10f628?w=800&h=1000&fit=crop", alt: "Essential Hoodie Back", isHover: true },
      ],
      variants: [
        { sku: "SKY-EH-BK-S", size: "S", color: "Black", colorHex: "#000000", stock: 20 },
        { sku: "SKY-EH-BK-M", size: "M", color: "Black", colorHex: "#000000", stock: 25 },
        { sku: "SKY-EH-BK-L", size: "L", color: "Black", colorHex: "#000000", stock: 18 },
        { sku: "SKY-EH-GR-M", size: "M", color: "Gray", colorHex: "#808080", stock: 15 },
        { sku: "SKY-EH-GR-L", size: "L", color: "Gray", colorHex: "#808080", stock: 12 },
        { sku: "SKY-EH-NV-M", size: "M", color: "Navy", colorHex: "#1B2A4A", stock: 10 },
      ],
    },
    {
      name: "Structured Bomber Jacket",
      slug: "structured-bomber-jacket",
      description: "A modern take on the classic bomber. Features structured shoulders, premium satin lining, and ribbed knit trim.\n\n- Water-Resistant Nylon Shell\n- Satin Lining\n- YKK Premium Zipper\n- Ribbed Knit Collar, Cuffs and Hem",
      basePrice: 12500,
      salePrice: 9900,
      categoryId: jackets.id,
      collection: "Urban",
      tags: ["bomber", "jacket", "structured", "nylon"],
      featured: true,
      images: [
        { url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=1000&fit=crop", alt: "Bomber Jacket", isHover: false },
        { url: "https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=800&h=1000&fit=crop", alt: "Bomber Jacket Side", isHover: true },
      ],
      variants: [
        { sku: "SKY-BJ-BK-M", size: "M", color: "Black", colorHex: "#000000", stock: 8 },
        { sku: "SKY-BJ-BK-L", size: "L", color: "Black", colorHex: "#000000", stock: 6 },
        { sku: "SKY-BJ-BK-XL", size: "XL", color: "Black", colorHex: "#000000", stock: 4 },
        { sku: "SKY-BJ-OL-M", size: "M", color: "Olive", colorHex: "#556B2F", stock: 5 },
        { sku: "SKY-BJ-OL-L", size: "L", color: "Olive", colorHex: "#556B2F", stock: 3 },
      ],
    },
    {
      name: "Classic Crew Neck",
      slug: "classic-crew-neck",
      description: "Timeless simplicity. The Classic Crew Neck is your go-to daily essential.\n\n- 100% Organic Cotton (200 GSM)\n- Regular Fit\n- Seamless Collar Construction\n- Sustainably Sourced",
      basePrice: 3800,
      salePrice: null,
      categoryId: tshirts.id,
      collection: "Basics",
      tags: ["crew-neck", "basic", "organic", "everyday"],
      featured: false,
      images: [
        { url: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=1000&fit=crop", alt: "Classic Crew", isHover: false },
      ],
      variants: [
        { sku: "SKY-CC-BK-S", size: "S", color: "Black", colorHex: "#000000", stock: 30 },
        { sku: "SKY-CC-BK-M", size: "M", color: "Black", colorHex: "#000000", stock: 30 },
        { sku: "SKY-CC-BK-L", size: "L", color: "Black", colorHex: "#000000", stock: 25 },
        { sku: "SKY-CC-WH-S", size: "S", color: "White", colorHex: "#FFFFFF", stock: 25 },
        { sku: "SKY-CC-WH-M", size: "M", color: "White", colorHex: "#FFFFFF", stock: 30 },
        { sku: "SKY-CC-WH-L", size: "L", color: "White", colorHex: "#FFFFFF", stock: 20 },
      ],
    },
    {
      name: "Slim Fit Joggers",
      slug: "slim-fit-joggers",
      description: "Elevated comfort meets street-ready style. These joggers feature a tapered leg, zippered pockets, and premium fleece interior.\n\n- 80% Cotton, 20% Polyester\n- Tapered Fit\n- Zippered Side Pockets\n- Elasticated Waistband with Drawstring",
      basePrice: 5900,
      salePrice: null,
      categoryId: pants.id,
      collection: "Essentials",
      tags: ["joggers", "slim", "comfort", "fleece"],
      featured: false,
      images: [
        { url: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&h=1000&fit=crop", alt: "Slim Joggers", isHover: false },
      ],
      variants: [
        { sku: "SKY-SJ-BK-S", size: "S", color: "Black", colorHex: "#000000", stock: 18 },
        { sku: "SKY-SJ-BK-M", size: "M", color: "Black", colorHex: "#000000", stock: 22 },
        { sku: "SKY-SJ-BK-L", size: "L", color: "Black", colorHex: "#000000", stock: 15 },
        { sku: "SKY-SJ-GR-M", size: "M", color: "Gray", colorHex: "#808080", stock: 12 },
        { sku: "SKY-SJ-GR-L", size: "L", color: "Gray", colorHex: "#808080", stock: 10 },
      ],
    },
    {
      name: "Windbreaker Jacket",
      slug: "windbreaker-jacket",
      description: "Lightweight protection meets modern design. Features a packable design, reflective details, and mesh lining.\n\n- Lightweight Ripstop Nylon\n- Packable into Internal Pocket\n- Mesh Lining\n- Adjustable Hood and Hem",
      basePrice: 9500,
      salePrice: 7500,
      categoryId: jackets.id,
      collection: "Urban",
      tags: ["windbreaker", "lightweight", "packable", "nylon"],
      featured: false,
      images: [
        { url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&h=1000&fit=crop", alt: "Windbreaker", isHover: false },
      ],
      variants: [
        { sku: "SKY-WB-BK-M", size: "M", color: "Black", colorHex: "#000000", stock: 10 },
        { sku: "SKY-WB-BK-L", size: "L", color: "Black", colorHex: "#000000", stock: 8 },
        { sku: "SKY-WB-NV-M", size: "M", color: "Navy", colorHex: "#1B2A4A", stock: 6 },
        { sku: "SKY-WB-NV-L", size: "L", color: "Navy", colorHex: "#1B2A4A", stock: 4 },
      ],
    },
    {
      name: "Graphic Print Tee",
      slug: "graphic-print-tee",
      description: "Make a statement. Premium screen-printed graphics on heavyweight cotton.\n\n- 100% Cotton (250 GSM)\n- High-quality Screen Print\n- Oversized Fit\n- Reinforced Neckline",
      basePrice: 4200,
      salePrice: 3200,
      categoryId: tshirts.id,
      collection: "Statement",
      tags: ["graphic", "print", "statement", "oversized"],
      featured: false,
      images: [
        { url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=1000&fit=crop", alt: "Graphic Tee", isHover: false },
      ],
      variants: [
        { sku: "SKY-GT-BK-S", size: "S", color: "Black", colorHex: "#000000", stock: 12 },
        { sku: "SKY-GT-BK-M", size: "M", color: "Black", colorHex: "#000000", stock: 15 },
        { sku: "SKY-GT-BK-L", size: "L", color: "Black", colorHex: "#000000", stock: 10 },
        { sku: "SKY-GT-WH-M", size: "M", color: "White", colorHex: "#FFFFFF", stock: 8 },
        { sku: "SKY-GT-WH-L", size: "L", color: "White", colorHex: "#FFFFFF", stock: 6 },
      ],
    },
  ];

  for (const product of products) {
    const { images, variants, ...productData } = product;
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        ...productData,
        images: { create: images.map((img, i) => ({ ...img, position: i })) },
        variants: { create: variants },
      },
    });
  }
  console.log("Products created:", products.length);

  // Create coupons
  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      description: "10% off your first order",
      discountType: "percentage",
      discountValue: 10,
      minOrderAmount: 3000,
      active: true,
    },
  });

  await prisma.coupon.upsert({
    where: { code: "SKYE500" },
    update: {},
    create: {
      code: "SKYE500",
      description: "LKR 500 off orders over LKR 8,000",
      discountType: "fixed",
      discountValue: 500,
      minOrderAmount: 8000,
      active: true,
    },
  });
  console.log("Coupons created");

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
