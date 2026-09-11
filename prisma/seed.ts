import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const categories = [
  { name: "Card đồ họa", slug: "card-do-hoa", description: "GPU NVIDIA / AMD" },
  { name: "CPU - Bộ vi xử lý", slug: "cpu", description: "Intel / AMD Ryzen" },
  { name: "RAM", slug: "ram", description: "DDR4 / DDR5" },
  { name: "Mainboard", slug: "mainboard", description: "Bo mạch chủ" },
  { name: "Ổ cứng SSD", slug: "o-cung-ssd", description: "SSD NVMe / SATA" },
  { name: "Màn hình", slug: "man-hinh", description: "Màn hình gaming / văn phòng" },
];

const brands = [
  { name: "ASUS", slug: "asus", description: "ASUS ROG / TUF" },
  { name: "MSI", slug: "msi", description: "MSI Gaming" },
  { name: "Gigabyte", slug: "gigabyte", description: "Gigabyte AORUS" },
  { name: "Intel", slug: "intel", description: "Intel Core" },
  { name: "AMD", slug: "amd", description: "AMD Ryzen / Radeon" },
  { name: "Corsair", slug: "corsair", description: "Corsair Vengeance" },
  { name: "Samsung", slug: "samsung", description: "Samsung SSD / Monitor" },
  { name: "LG", slug: "lg", description: "LG UltraGear" },
];

type SeedProduct = {
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  categorySlug: string;
  brandSlug: string;
  imageSeed: string;
};

const products: SeedProduct[] = [
  {
    name: "Card màn hình ASUS ROG Strix RTX 4070 12GB",
    slug: "asus-rog-strix-rtx-4070-12gb",
    description: "GPU NVIDIA GeForce RTX 4070 12GB GDDR6X, tản nhiệt 3 fan, phù hợp gaming 2K max setting.",
    price: 18990000,
    stock: 12,
    categorySlug: "card-do-hoa",
    brandSlug: "asus",
    imageSeed: "gpu-4070",
  },
  {
    name: "Card màn hình MSI RTX 4060 Ventus 2X 8GB",
    slug: "msi-rtx-4060-ventus-2x-8gb",
    description: "RTX 4060 8GB GDDR6, thiết kế 2 fan nhỏ gọn, hiệu năng/watt vượt trội cho gaming Full HD.",
    price: 9490000,
    stock: 20,
    categorySlug: "card-do-hoa",
    brandSlug: "msi",
    imageSeed: "gpu-4060",
  },
  {
    name: "Card màn hình Gigabyte RX 7800 XT 16GB",
    slug: "gigabyte-rx-7800-xt-16gb",
    description: "AMD Radeon RX 7800 XT 16GB GDDR6, chiến game 2K mượt mà, giá tốt trong phân khúc.",
    price: 14990000,
    stock: 8,
    categorySlug: "card-do-hoa",
    brandSlug: "gigabyte",
    imageSeed: "gpu-7800xt",
  },
  {
    name: "CPU Intel Core i5-13400F",
    slug: "intel-core-i5-13400f",
    description: "10 nhân 16 luồng, xung tối đa 4.6GHz, không iGPU — lựa chọn quốc dân cho PC gaming tầm trung.",
    price: 4990000,
    stock: 25,
    categorySlug: "cpu",
    brandSlug: "intel",
    imageSeed: "cpu-13400f",
  },
  {
    name: "CPU AMD Ryzen 5 7600",
    slug: "amd-ryzen-5-7600",
    description: "6 nhân 12 luồng Zen 4, socket AM5, kèm tản stock, nâng cấp lâu dài.",
    price: 5450000,
    stock: 18,
    categorySlug: "cpu",
    brandSlug: "amd",
    imageSeed: "cpu-7600",
  },
  {
    name: "RAM Corsair Vengeance 16GB DDR5 5600MHz",
    slug: "corsair-vengeance-16gb-ddr5-5600",
    description: "Kit 2x8GB DDR5 5600MHz CL36, tản nhôm, hỗ trợ XMP 3.0.",
    price: 1890000,
    stock: 40,
    categorySlug: "ram",
    brandSlug: "corsair",
    imageSeed: "ram-ddr5",
  },
  {
    name: "Mainboard ASUS TUF Gaming B760M-Plus",
    slug: "asus-tuf-b760m-plus",
    description: "Socket LGA1700, DDR5, 3 khe M.2, VRM bền bỉ chuẩn quân đội TUF.",
    price: 4290000,
    stock: 15,
    categorySlug: "mainboard",
    brandSlug: "asus",
    imageSeed: "main-b760",
  },
  {
    name: "SSD Samsung 980 Pro 1TB NVMe PCIe 4.0",
    slug: "samsung-980-pro-1tb",
    description: "Đọc 7000MB/s, ghi 5000MB/s, bảo hành 5 năm — nâng cấp tốc độ toàn diện.",
    price: 2790000,
    stock: 30,
    categorySlug: "o-cung-ssd",
    brandSlug: "samsung",
    imageSeed: "ssd-980pro",
  },
  {
    name: "Màn hình LG UltraGear 27GR75Q 27 inch 2K 165Hz",
    slug: "lg-ultragear-27gr75q",
    description: "IPS 27 inch QHD, 165Hz, 1ms, HDR10 — chuẩn gaming 2K.",
    price: 6990000,
    stock: 10,
    categorySlug: "man-hinh",
    brandSlug: "lg",
    imageSeed: "monitor-lg27",
  },
  {
    name: "Màn hình MSI G244F 24 inch Full HD 170Hz",
    slug: "msi-g244f-24",
    description: "IPS 24 inch FHD, 170Hz OC, giá rẻ cho game thủ FPS.",
    price: 3290000,
    stock: 22,
    categorySlug: "man-hinh",
    brandSlug: "msi",
    imageSeed: "monitor-msi24",
  },
];

async function main() {
  await prisma.role.upsert({
    where: { name: "Admin" },
    update: {},
    create: { name: "Admin", description: "Administrator" },
  });

  await prisma.role.upsert({
    where: { name: "Customer" },
    update: {},
    create: { name: "Customer", description: "Customer" },
  });

  const adminRole = await prisma.role.findUnique({ where: { name: "Admin" } });

  if (adminRole) {
    const hashed = await bcrypt.hash("admin123", 10);
    await prisma.user.upsert({
      where: { email: "admin@pcstore.vn" },
      update: {},
      create: {
        fullName: "Administrator",
        email: "admin@pcstore.vn",
        password: hashed,
        roleId: adminRole.id,
      },
    });
    console.log("Admin account: admin@pcstore.vn / admin123");
  }

  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
  }

  for (const b of brands) {
    await prisma.brand.upsert({
      where: { slug: b.slug },
      update: {},
      create: b,
    });
  }

  for (const p of products) {
    const category = await prisma.category.findUnique({
      where: { slug: p.categorySlug },
    });
    const brand = await prisma.brand.findUnique({
      where: { slug: p.brandSlug },
    });
    if (!category || !brand) continue;

    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        stock: p.stock,
        categoryId: category.id,
        brandId: brand.id,
        images: {
          create: [
            {
              imageUrl: `https://picsum.photos/seed/${p.imageSeed}/800/800`,
              publicId: `seed/${p.imageSeed}`,
            },
          ],
        },
      },
    });
  }

  console.log("Seed completed");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
