import { BrandRepository } from "@/repositories/brand.repository";
import {
  CreateBrandInput,
  UpdateBrandInput,
} from "@/validations/brand.validation";

export class BrandService {
  private repository = new BrandRepository();

  async create(data: CreateBrandInput) {
    const exist = await this.repository.findBySlug(data.slug);

    if (exist) {
      throw new Error("Slug đã tồn tại");
    }

    return this.repository.create(data);
  }

  findAll() {
    return this.repository.findAll();
  }

  findById(id: string) {
    return this.repository.findById(id);
  }

  update(id: string, data: UpdateBrandInput) {
    return this.repository.update(id, data);
  }

  async delete(id: string) {
    const productCount = await this.repository.countProducts(id);

    if (productCount > 0) {
      throw new Error(
        `Không thể xóa: còn ${productCount} sản phẩm thuộc thương hiệu này`
      );
    }

    return this.repository.delete(id);
  }
}