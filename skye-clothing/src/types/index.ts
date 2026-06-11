export interface ProductWithDetails {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  salePrice: number | null;
  categoryId: string;
  collection: string | null;
  tags: string[];
  featured: boolean;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  variants: ProductVariant[];
  images: ProductImage[];
  reviews: ReviewData[];
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  size: string;
  color: string;
  colorHex: string;
  stock: number;
  price: number | null;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  alt: string | null;
  position: number;
  isHover: boolean;
}

export interface ReviewData {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  verified: boolean;
  createdAt: Date;
  user: {
    name: string | null;
    image: string | null;
  };
}

export interface CartItemData {
  id: string;
  productId: string;
  variantId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    basePrice: number;
    salePrice: number | null;
    images: ProductImage[];
  };
  variant: ProductVariant;
}

export interface OrderData {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
  createdAt: Date;
  items: OrderItemData[];
  address: AddressData;
}

export interface OrderItemData {
  id: string;
  name: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  imageUrl: string | null;
}

export interface AddressData {
  id: string;
  label: string;
  firstName: string;
  lastName: string;
  line1: string;
  line2: string | null;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface FilterState {
  category: string | null;
  sizes: string[];
  colors: string[];
  priceRange: [number, number];
  sortBy: "newest" | "price-asc" | "price-desc" | "popular";
  search: string;
}

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  paymentMethod: "STRIPE" | "PAYHERE" | "COD";
  couponCode: string;
  notes: string;
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  recentOrders: OrderData[];
  revenueByDay: { date: string; revenue: number }[];
}
