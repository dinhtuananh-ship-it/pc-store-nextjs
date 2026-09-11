# PC Store - Cửa hàng linh kiện máy tính

Website bán linh kiện PC (CPU, VGA, RAM, Mainboard, SSD, màn hình...) xây dựng bằng
**Next.js 16 (App Router) + TypeScript + Tailwind CSS + Prisma + PostgreSQL (Neon) + Cloudinary**.

## Tính năng

**Khách hàng (`/`):**

- Trang chủ: hero, danh mục, sản phẩm nổi bật, thương hiệu
- Danh sách sản phẩm: tìm kiếm, lọc theo danh mục/thương hiệu, sắp xếp
- Chi tiết sản phẩm: thư viện ảnh, chọn số lượng, thêm giỏ / mua ngay, sản phẩm liên quan
- Giỏ hàng: tăng/giảm số lượng, xóa item, xóa tất cả, tóm tắt đơn hàng
- Thanh toán (giả lập): điền địa chỉ, chọn COD / chuyển khoản / MoMo
  (BANK/MoMo tự ghi nhận đã thanh toán ngay, COD thì thanh toán khi nhận hàng)
- Đơn hàng của tôi: theo dõi trạng thái (Chờ xác nhận → Đã thanh toán →
  Đang giao → Hoàn thành), thanh toán ngay đơn COD/chờ, hủy đơn chờ xác nhận
- Đăng ký / Đăng nhập (tự động đăng nhập sau khi đăng ký)

**Quản trị (`/admin`, chỉ role Admin):**

- Dashboard thống kê: danh mục, thương hiệu, sản phẩm, người dùng,
  tổng doanh thu, doanh thu hôm nay, tổng đơn hàng
- Quản lý đơn hàng: lọc theo trạng thái, xem chi tiết (sản phẩm, địa chỉ,
  thanh toán), cập nhật trạng thái (hủy đơn tự hoàn kho)
- CRUD sản phẩm (upload nhiều ảnh lên Cloudinary)
- CRUD danh mục, thương hiệu (chặn xóa khi còn sản phẩm)
- Xem danh sách người dùng

**API (`/api/*`):** `auth/login`, `auth/register`, `products`, `categories`,
`brands`, `product-images`, `cart`, `cart/clear`, `cart/items/[id]`,
`checkout` (đặt hàng từ giỏ), `orders` (đơn của tôi), `orders/[id]`
(chi tiết / thanh toán giả lập / hủy / admin đổi trạng thái),
`admin/orders`, `admin/finance`, `upload` (Cloudinary),
`dashboard/statistics`, `users`.

Kiến trúc backend: Route Handler → Controller → Service → Repository → Prisma.

## Cài đặt

```bash
npm install
```

Tạo file `.env`:

```env
DATABASE_URL="postgresql://user:password@host:5432/db?sslmode=require"
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```

Đồng bộ database + seed dữ liệu mẫu:

```bash
npx prisma db push
npm run seed
```

Tài khoản admin mẫu sau khi seed: `admin@pcstore.vn` / `admin123`.

## Chạy

```bash
npm run dev      # dev: http://localhost:3000
npm run build    # kiểm tra production build
npm start        # chạy production
```
