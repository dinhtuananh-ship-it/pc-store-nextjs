import { CartService } from "@/services/cart.service";
import {
  AddToCartInput,
  UpdateCartItemInput,
} from "@/validations/cart.validation";

export class CartController {
  private service = new CartService();

  getCart(userId: string) {
    return this.service.getCart(userId);
  }

  addToCart(userId: string, data: AddToCartInput) {
    return this.service.addToCart(userId, data);
  }

  updateQuantity(id: string, data: UpdateCartItemInput) {
    return this.service.updateQuantity(id, data.quantity);
  }

  deleteItem(id: string) {
    return this.service.deleteItem(id);
  }

  clearCart(cartId: string) {
    return this.service.clearCart(cartId);
  }
}