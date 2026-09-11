import { prisma } from "@/lib/prisma";

export class ProductImageRepository {
  findByProduct(productId: string) {
    return prisma.productImage.findMany({
      where: {
        productId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }

create(
  productId: string,
  imageUrl: string,
  publicId: string
) {
  return prisma.productImage.create({
    data: {
      productId,
      imageUrl,
      publicId,
    },
  });
}

  delete(id: string) {
    return prisma.productImage.delete({
      where: {
        id,
      },
    });
  }
}