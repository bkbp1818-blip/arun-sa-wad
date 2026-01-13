import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bed, Map, Utensils, Gift } from "lucide-react";

const features = [
  {
    icon: Bed,
    title: "ห้องพักสะดวกสบาย",
    description: "ห้องพักสไตล์โมเดิร์น กลางย่านเยาวราช",
    href: "/rooms",
  },
  {
    icon: Map,
    title: "ทัวร์เยาวราช",
    description: "สำรวจเสน่ห์ Chinatown กับไกด์ท้องถิ่น",
    href: "/tours",
  },
  {
    icon: Utensils,
    title: "Street Food Fast Track",
    description: "จองคิวร้านดัง ไม่ต้องรอคิว",
    href: "/services",
  },
  {
    icon: Gift,
    title: "ของฝากคัดสรร",
    description: "เซ็ตของฝากเยาวราชแท้ๆ",
    href: "/services",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/10 to-background py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4">
            Welcome to Yaowarat
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            <span className="text-primary">ARUN SA WAD</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground md:text-xl">
            อรุณสวัสดิ์ - โรงแรมบูติคใจกลางเยาวราช
            <br />
            สัมผัสประสบการณ์ Chinatown แท้ๆ ในแบบที่คุณไม่เคยรู้จัก
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/rooms">จองห้องพัก</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/tours">ดูทัวร์ทั้งหมด</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">บริการของเรา</h2>
            <p className="mt-2 text-muted-foreground">
              ครบครันทุกความต้องการสำหรับทริปเยาวราชของคุณ
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <feature.icon className="h-10 w-10 text-primary mb-2 group-hover:scale-110 transition-transform" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="link" className="p-0" asChild>
                    <Link href={feature.href}>ดูเพิ่มเติม &rarr;</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold">พร้อมเริ่มต้นทริปเยาวราช?</h2>
          <p className="mt-4 text-primary-foreground/80">
            จองตอนนี้รับส่วนลดพิเศษสำหรับบริการเสริม
          </p>
          <Button size="lg" variant="secondary" className="mt-8" asChild>
            <Link href="/rooms">เริ่มจองเลย</Link>
          </Button>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <h3 className="text-4xl font-bold text-primary">100+</h3>
              <p className="text-muted-foreground">รีวิว 5 ดาว</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-bold text-primary">24/7</h3>
              <p className="text-muted-foreground">บริการลูกค้า</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-bold text-primary">5 นาที</h3>
              <p className="text-muted-foreground">จาก MRT วัดมังกร</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
