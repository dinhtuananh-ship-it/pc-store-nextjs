import { BrandService } from "@/services/brand.service";
import {
  CreateBrandInput,
  UpdateBrandInput,
} from "@/validations/brand.validation";

export class BrandController {
  private service = new BrandService();

  create(data: CreateBrandInput) {
    return this.service.create(data);
  }

  findAll() {
    return this.service.findAll();
  }

  findById(id: string) {
    return this.service.findById(id);
  }

  update(id: string, data: UpdateBrandInput) {
    return this.service.update(id, data);
  }

  delete(id: string) {
    return this.service.delete(id);
  }
}