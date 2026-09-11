import { prisma } from "@/lib/prisma";

export class DashboardRepository {
  async getStatistics() {
    const [
      totalCategories,
      totalBrands,
      totalProducts,
      totalUsers,
    ] = await Promise.all([
      prisma.category.count(),
      prisma.brand.count(),
      prisma.product.count(),
      prisma.user.count(),
    ]);

    return {
      totalCategories,
      totalBrands,
      totalProducts,
      totalUsers,
    };
  }
}