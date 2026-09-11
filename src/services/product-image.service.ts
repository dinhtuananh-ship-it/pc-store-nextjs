import { ProductImageRepository } from "@/repositories/product-image.repository";

export class ProductImageService {
  private repository = new ProductImageRepository();

  getByProduct(productId: string) {
    return this.repository.findByProduct(productId);
  }

  create(
    productId: string,
    imageUrl: string,
    publicId: string
  ) {
    return this.repository.create(
      productId,
      imageUrl,
      publicId
    );
  }

  delete(id: string) {
    return this.repository.delete(id);
  }
}