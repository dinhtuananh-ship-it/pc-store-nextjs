import { prisma } from "@/lib/prisma";
import {
  CreateBrandInput,
  UpdateBrandInput,
} from "@/validations/brand.validation";

export class BrandRepository {
  create(data: CreateBrandInput) {
    return prisma.brand.create({
      data,
    });
  }

  findAll() {
    return prisma.brand.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  findById(id: string) {
    return prisma.brand.findUnique({
      where: { id },
    });
  }

  findBySlug(slug: string) {
    return prisma.brand.findUnique({
      where: { slug },
    });
  }

  update(id: string, data: UpdateBrandInput) {
    return prisma.brand.update({
      where: { id },
      data,
    });
  }

  delete(id: string) {
    return prisma.brand.delete({
      where: { id },
    });
  }

  countProducts(id: string) {
    return prisma.product.count({
      where: { brandId: id },
    });
  }

  count() {
    return prisma.brand.count();
  }
}