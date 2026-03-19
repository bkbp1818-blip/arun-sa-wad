import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

interface ProductInfo {
  id: string;
  name: string;
  nameTh: string;
  type: string;
  price: number;
  description: string | null;
  descTh: string | null;
  duration: string | null;
  meetingPoint: string | null;
  roomNumber: string | null;
  capacity: number | null;
  amenities: string[];
}

const getProductData = unstable_cache(
  async (): Promise<ProductInfo[]> => {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        nameTh: true,
        type: true,
        price: true,
        description: true,
        descTh: true,
        duration: true,
        meetingPoint: true,
        roomNumber: true,
        capacity: true,
        amenities: true,
      },
    });

    return products.map((p) => ({
      ...p,
      price: Number(p.price),
    }));
  },
  ["chat-products"],
  { revalidate: 300 } // 5 minutes
);

function formatProductsForPrompt(products: ProductInfo[]): string {
  const grouped: Record<string, ProductInfo[]> = {};

  for (const p of products) {
    if (!grouped[p.type]) grouped[p.type] = [];
    grouped[p.type].push(p);
  }

  const typeLabels: Record<string, string> = {
    ROOM: "ห้องพัก (Rooms)",
    TOUR: "ทัวร์/กิจกรรม (Tours)",
    FOOD: "อาหาร (Food)",
    MERCH: "ของฝาก (Merchandise)",
    SERVICE: "บริการเสริม (Services)",
  };

  let text = "";

  for (const [type, items] of Object.entries(grouped)) {
    text += `\n### ${typeLabels[type] || type}\n`;
    for (const item of items) {
      text += `- **${item.nameTh}** (${item.name}): ฿${item.price.toLocaleString()}`;
      if (item.type === "ROOM" && item.capacity) {
        text += ` | รองรับ ${item.capacity} คน | สิ่งอำนวยความสะดวก: ${item.amenities.join(", ") || "ไม่ระบุ"}`;
      }
      if (item.type === "TOUR" && item.duration) {
        text += ` | ระยะเวลา: ${item.duration}`;
        if (item.meetingPoint) text += ` | จุดนัดพบ: ${item.meetingPoint}`;
      }
      text += "\n";
      if (item.descTh) text += `  ${item.descTh}\n`;
    }
  }

  return text;
}

export async function buildSystemPrompt(): Promise<string> {
  const products = await getProductData();
  const productText = formatProductsForPrompt(products);

  return `คุณคือ "ARUN Assistant" ผู้ช่วยอัจฉริยะของโรงแรม ARUN SA WAD (อรุณสวัสดิ์) โรงแรมบูติคใจกลางเยาวราช กรุงเทพมหานคร

## ข้อมูลโรงแรม
- **ชื่อ**: ARUN SA WAD (อรุณสวัสดิ์)
- **ที่อยู่**: ถนนเยาวราช แขวงสัมพันธวงศ์ เขตสัมพันธวงศ์ กรุงเทพฯ 10100
- **โทรศัพท์**: 02-222-1234
- **Check-in**: 14:00 น.
- **Check-out**: 12:00 น.
- **การเดินทาง**: MRT วัดมังกร ทางออก 1 เดินประมาณ 5 นาที

## สินค้าและบริการปัจจุบัน
${productText}

## นโยบาย
- ยกเลิกฟรีก่อน 24 ชั่วโมง
- ชำระเงินผ่าน PromptPay QR Code
- สัตว์เลี้ยงไม่อนุญาต
- ห้ามสูบบุหรี่ภายในห้องพัก

## คำถามที่พบบ่อย (FAQ)
- **Wi-Fi**: ฟรีทุกพื้นที่
- **ที่จอดรถ**: มีที่จอดรถใกล้เคียง (ค่าจอดเพิ่มเติม)
- **สัมภาระ**: ฝากสัมภาระได้ฟรีก่อน check-in และหลัง check-out

## คำสั่งสำคัญ
1. **ตอบภาษาเดียวกับที่ลูกค้าถาม** — ถ้าถามภาษาไทย ตอบเป็นภาษาไทย, ถ้าถามภาษาอังกฤษ ตอบเป็นภาษาอังกฤษ
2. **ถ้าลูกค้าสนใจจอง** → แนะนำลิงก์:
   - จองห้องพัก: [คลิกที่นี่](/rooms)
   - ดูทัวร์: [คลิกที่นี่](/tours)
   - บริการเสริม: [คลิกที่นี่](/services)
   - จองเลย: [คลิกที่นี่](/booking)
3. **ถ้าไม่รู้คำตอบ** → แนะนำให้ติดต่อโรงแรมโดยตรง โทร 02-222-1234
4. **ห้ามแต่งข้อมูลที่ไม่จริง** — ตอบเฉพาะข้อมูลที่มีอยู่ข้างต้น
5. **ตอบกระชับ เป็นมิตร** — ใช้น้ำเสียงอบอุ่น เหมือนพนักงานต้อนรับที่ดี
6. **ใช้ markdown** สำหรับจัดรูปแบบคำตอบ (bold, list, link)`;
}
