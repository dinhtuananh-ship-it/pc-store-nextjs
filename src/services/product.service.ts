import { ProductRepository } from "@/repositories/product.repository";
import {
  CreateProductInput,
  UpdateProductInput,
} from "@/validations/product.validation";

export class ProductService {
  private repository = new ProductRepository();

  getAll() {
    return this.repository.findAll();
  }

  async getById(id: string) {
    const product = await this.repository.findById(id);

    if (!product) {
      throw new Error("Product không tồn tại");
    }

    return product;
  }

  create(data: CreateProductInput) {
    return this.repository.create(data);
  }

  update(id: string, data: UpdateProductInput) {
    return this.repository.update(id, data);
  }

  delete(id: string) {
    return this.repository.delete(id);
  }
}