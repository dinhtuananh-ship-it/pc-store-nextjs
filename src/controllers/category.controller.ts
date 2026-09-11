import { CategoryService } from "@/services/category.service";
import { CreateCategoryInput } from "@/validations/category.validation";

export class CategoryController {
  private service = new CategoryService();

  async getAll() {
    return this.service.getAll();
  }

  async create(data: CreateCategoryInput) {
    return this.service.create(data);
  }
  async getById(id: string) {
  return this.service.getById(id);
}

async update(id: string, data: CreateCategoryInput) {
  return this.service.update(id, data);
}

async delete(id: string) {
  return this.service.delete(id);
}
}