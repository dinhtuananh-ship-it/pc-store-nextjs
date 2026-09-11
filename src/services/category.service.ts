import { CategoryRepository } from "@/repositories/category.repository";
import { CreateCategoryInput } from "@/validations/category.validation";

export class CategoryService {
  private repository = new CategoryRepository();

  async getAll() {
    return this.repository.findAll();
  }

  async create(data: CreateCategoryInput) {
    const existed = await this.repository.findBySlug(data.slug);

    if (existed) {
      throw new Error("Slug đã tồn tại");
    }

    return this.repository.create(data);
  }
  async getById(id: string) {
  const category = await this.repository.findById(id);

  if (!category) {
    throw new Error("Không tìm thấy danh mục");
  }

  return category;
}

async update(id: string, data: CreateCategoryInput) {
  const category = await this.repository.findById(id);

  if (!category) {
    throw new Error("Không tìm thấy danh mục");
  }

  return this.repository.update(id, data);
}

async delete(id: string) {
  const category = await this.repository.findById(id);

  if (!category) {
    throw new Error("Không tìm thấy danh mục");
  }

  const productCount = await this.repository.countProducts(id);

  if (productCount > 0) {
    throw new Error(
      `Không thể xóa: còn ${productCount} sản phẩm thuộc danh mục này`
    );
  }

  return this.repository.delete(id);
}
}