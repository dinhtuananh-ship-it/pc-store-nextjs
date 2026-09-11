import { ProductService } from "@/services/product.service";
import {
  CreateProductInput,
  UpdateProductInput,
} from "@/validations/product.validation";

export class ProductController {
  private productService = new ProductService();

  getAll() {
    return this.productService.getAll();
  }

  getById(id: string) {
    return this.productService.getById(id);
  }

  create(data: CreateProductInput) {
    return this.productService.create(data);
  }

  update(id: string, data: UpdateProductInput) {
    return this.productService.update(id, data);
  }

  delete(id: string) {
    return this.productService.delete(id);
  }
}