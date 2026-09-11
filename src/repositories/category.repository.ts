import { prisma } from "@/lib/prisma";

export class CategoryRepository {
  async findAll() {
    return prisma.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findBySlug(slug: string) {
    return prisma.category.findUnique({
      where: {
        slug,
      },
    });
  }

  async create(data: {
    name: string;
    slug: string;
    description?: string;
    image?: string;
  }) {
    return prisma.category.create({
      data,
    });
  }
  async findById(id: string) {
  return prisma.category.findUnique({
    where: { id },
  });
}

async update(
  id: string,
  data: {
    name: string;
    slug: string;
    description?: string;
    image?: string;
  }
) {
  return prisma.category.update({
    where: { id },
    data,
  });
}

async delete(id: string) {
  return prisma.category.delete({
    where: { id },
  });
}

async countProducts(id: string) {
  return prisma.product.count({
    where: { categoryId: id },
  });
}
}