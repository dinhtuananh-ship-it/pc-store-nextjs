import { prisma } from "@/lib/prisma";
import {
  CreateProductInput,
  UpdateProductInput,
} from "@/validations/product.validation";

export class ProductRepository {
  // Lấy tất cả sản phẩm
  findAll() {
    return prisma.product.findMany({
      include: {
        category: true,
        brand: true,
        images: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // Lấy sản phẩm theo ID
  findById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        images: true,
      },
    });
  }

  // Tạo sản phẩm
  create(data: CreateProductInput) {
    return prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
        stock: data.stock,

        category: {
          connect: {
            id: data.categoryId,
          },
        },

        brand: {
          connect: {
            id: data.brandId,
          },
        },

        images: {
          create:
            data.images?.map((image) => ({
              imageUrl: image.imageUrl,
              publicId: image.publicId,
            })) ?? [],
        },
      },

      include: {
        category: true,
        brand: true,
        images: true,
      },
    });
  }

  // Cập nhật sản phẩm
  update(id: string, data: UpdateProductInput) {
    return prisma.product.update({
      where: {
        id,
      },

      data: {
        ...(data.name && { name: data.name }),
        ...(data.slug && { slug: data.slug }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.price !== undefined && {
          price: data.price,
        }),
        ...(data.stock !== undefined && {
          stock: data.stock,
        }),

        ...(data.categoryId && {
          category: {
            connect: {
              id: data.categoryId,
            },
          },
        }),

        ...(data.brandId && {
          brand: {
            connect: {
              id: data.brandId,
            },
          },
        }),

        ...(data.images && {
          images: {
            deleteMany: {},
            create: data.images.map((image) => ({
              imageUrl: image.imageUrl,
              publicId: image.publicId,
            })),
          },
        }),
      },

      include: {
        category: true,
        brand: true,
        images: true,
      },
    });
  }

  // Xóa sản phẩm (xóa luôn cart item liên quan để tránh lỗi FK)
  async delete(id: string) {
    await prisma.cartItem.deleteMany({
      where: { productId: id },
    });

    return prisma.product.delete({
      where: {
        id,
      },
    });
  }
}