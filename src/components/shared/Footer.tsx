import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-primary">ARUN SA WAD</h3>
            <p className="text-sm text-muted-foreground">
              โรงแรมบูติคใจกลางเยาวราช
              <br />
              สัมผัสประสบการณ์ Chinatown แท้ๆ
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">เมนูลัด</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/rooms" className="hover:text-primary transition-colors">
                  ห้องพัก
                </Link>
              </li>
              <li>
                <Link href="/tours" className="hover:text-primary transition-colors">
                  ทัวร์เยาวราช
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-primary transition-colors">
                  บริการเสริม
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold">ติดต่อเรา</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>ถนนเยาวราช กรุงเทพฯ</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a href="tel:+6621234567" className="hover:text-primary">
                  02-123-4567
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:hello@arunsawad.com" className="hover:text-primary">
                  hello@arunsawad.com
                </a>
              </li>
            </ul>
          </div>

          {/* Social & Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold">ข้อมูลเพิ่มเติม</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  เกี่ยวกับเรา
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors">
                  ข้อกำหนดการใช้งาน
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  นโยบายความเป็นส่วนตัว
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ARUN SA WAD. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
