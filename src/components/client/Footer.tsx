import Link from "next/link";
import { Cpu, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t bg-slate-900 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 text-xl font-bold text-white">
            <span className="flex size-9 items-center justify-center rounded-lg bg-blue-600">
              <Cpu size={22} />
            </span>
            PC Store
          </div>
          <p className="mt-3 text-sm leading-6">
            Chuyên linh kiện máy tính chính hãng: CPU, VGA, RAM, Mainboard,
            SSD, màn hình gaming. Bảo hành uy tín, giá tốt nhất.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-white">Liên kết</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-white">
                Trang chủ
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-white">
                Tất cả sản phẩm
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-white">
                Giỏ hàng
              </Link>
            </li>
            <li>
              <Link href="/orders" className="hover:text-white">
                Đơn hàng của tôi
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white">Liên hệ</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <MapPin size={16} /> Phường Việt Hưng, Hà Nội
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} /> 0362045301
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} /> khanguyenan892@gmail.com
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        © 2026 PC Store. All rights reserved.
      </div>
    </footer>
  );
}
