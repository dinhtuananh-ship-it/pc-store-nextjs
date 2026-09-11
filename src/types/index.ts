export type Role = {
  id: string;
  name: string;
  description?: string | null;
};

export type User = {
  id: string;
  fullName: string;
  email: string;
  avatar?: string | null;
  status: boolean;
  roleId: string;
  role?: Role;
  createdAt: string | Date;
  updatedAt: string | Date;
  lastLoginAt?: string | Date | null;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  createdAt: string | Date;
  updateAt: string | Date;
};

export type Brand = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  logo?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
};

export type ProductImage = {
  id: string;
  imageUrl: string;
  publicId: string;
  productId: string;
  createdAt: string | Date;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  stock: number;
  status: boolean;
  categoryId: string;
  brandId: string;
  category?: Category;
  brand?: Brand;
  images?: ProductImage[];
  createdAt: string | Date;
  updatedAt: string | Date;
};

export type CartItem = {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  product: Product;
  createdAt: string | Date;
};

export type Cart = {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: string | Date;
  updatedAt: string | Date;
};

export type DashboardStatistics = {
  totalCategories: number;
  totalBrands: number;
  totalProducts: number;
  totalUsers: number;
};

export type OrderItem = {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  imageUrl?: string | null;
  createdAt: string | Date;
};

export type Order = {
  id: string;
  code: string;
  userId: string;
  user?: User;
  fullName: string;
  phone: string;
  address: string;
  city?: string | null;
  note?: string | null;
  paymentMethod: string;
  status: string;
  subtotal: number;
  shippingFee: number;
  total: number;
  items: OrderItem[];
  createdAt: string | Date;
  updatedAt: string | Date;
};

export type FinanceStats = {
  totalOrders: number;
  totalRevenue: number;
  paidOrders: number;
  todayRevenue: number;
  todayOrders: number;
  byStatus: { status: string; count: number; revenue: number }[];
};

export type ApiResult<T> = {
  success: boolean;
  data?: T;
  message?: string;
};
