import { CartRepository } from "@/repositories/cart.repository";
import {
  AddToCartInput,
} from "@/validations/cart.validation";

export class CartService {
  private repository = new CartRepository();

  async getCart(userId: string) {
    let cart = await this.repository.findCartByUserId(userId);

    if (!cart) {
      cart = await this.repository.createCart(userId);
    }

    return cart;
  }

  async addToCart(
    userId: string,
    data: AddToCartInput
  ) {
    let cart = await this.repository.findCartByUserId(userId);

    if (!cart) {
      cart = await this.repository.createCart(userId);
    }

    const item = await this.repository.findCartItem(
      cart.id,
      data.productId
    );

    if (item) {
      return this.repository.updateQuantity(
        item.id,
        item.quantity + data.quantity
      );
    }

    return this.repository.addItem(
      cart.id,
      data.productId,
      data.quantity
    );
  }

  updateQuantity(
    id: string,
    quantity: number
  ) {
    return this.repository.updateQuantity(
      id,
      quantity
    );
  }

  deleteItem(id: string) {
    return this.repository.deleteItem(id);
  }

  clearCart(cartId: string) {
    return this.repository.clearCart(cartId);
  }
}