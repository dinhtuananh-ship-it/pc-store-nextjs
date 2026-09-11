import { ProductImageService } from "@/services/product-image.service";

export class ProductImageController {
  private service = new ProductImageService();

  getByProduct(productId: string) {
    return this.service.getByProduct(productId);
  }

  create(
    productId: string,
    imageUrl: string,
    publicId: string
  ) {
    return this.service.create(
      productId,
      imageUrl,
      publicId
    );
  }

  delete(id: string) {
    return this.service.delete(id);
  }
}