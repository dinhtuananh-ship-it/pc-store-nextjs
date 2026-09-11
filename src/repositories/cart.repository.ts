import { prisma } from "@/lib/prisma";

export class CartRepository {
  findCartByUserId(userId: string) {
    return prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
                brand: true,
                images: true,
              },
            },
          },
        },
      },
    });
  }

  createCart(userId: string) {
    return prisma.cart.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
                brand: true,
                images: true,
              },
            },
          },
        },
      },
    });
  }

  findCartItem(cartId: string, productId: string) {
    return prisma.cartItem.findFirst({
      where: {
        cartId,
        productId,
      },
    });
  }

  addItem(
    cartId: string,
    productId: string,
    quantity: number
  ) {
    return prisma.cartItem.create({
      data: {
        cart: {
          connect: {
            id: cartId,
          },
        },
        product: {
          connect: {
            id: productId,
          },
        },
        quantity,
      },
    });
  }

  updateQuantity(
    id: string,
    quantity: number
  ) {
    return prisma.cartItem.update({
      where: {
        id,
      },
      data: {
        quantity,
      },
    });
  }

  deleteItem(id: string) {
    return prisma.cartItem.delete({
      where: {
        id,
      },
    });
  }

  clearCart(cartId: string) {
    return prisma.cartItem.deleteMany({
      where: {
        cartId,
      },
    });
  }
}