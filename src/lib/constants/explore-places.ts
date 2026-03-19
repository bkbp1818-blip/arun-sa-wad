import { HOTEL_LOCATION } from "./nearby-places";

export type ExplorePlaceType =
  | "temple"
  | "food"
  | "market"
  | "landmark"
  | "museum"
  | "event";

export interface ExplorePlace {
  name: string;
  nameTh: string;
  lat: number;
  lng: number;
  type: ExplorePlaceType;
  description: string;
  distance: string;
  phone?: string;
  website?: string;
  openingHours?: string;
  admissionFee?: string;
  highlights?: string[];
  image?: string;
}

export const EXPLORE_PLACES: ExplorePlace[] = [
  // === วัด 5 แห่ง ===
  {
    name: "Wat Mangkon Kamalawat",
    nameTh: "วัดมังกรกมลาวาส (วัดเล่งเน่ยยี่)",
    lat: 13.7420,
    lng: 100.5070,
    type: "temple",
    description: "วัดจีนที่สำคัญที่สุดในเยาวราช สร้างปี พ.ศ. 2414 เป็นศูนย์กลางพิธีกรรมชาวไทยเชื้อสายจีน",
    distance: "200 ม.",
    phone: "02-222-3975",
    openingHours: "06:00–18:00 ทุกวัน",
    admissionFee: "ฟรี",
    highlights: ["วัดจีนเก่าแก่", "สถาปัตยกรรมจีน"],
  },
  {
    name: "Wat Traimit Withayaram",
    nameTh: "วัดไตรมิตรวิทยารามวรวิหาร",
    lat: 13.7373,
    lng: 100.5134,
    type: "temple",
    description: "ที่ประดิษฐานพระพุทธรูปทองคำแท้ที่ใหญ่ที่สุดในโลก หนัก 5.5 ตัน",
    distance: "600 ม.",
    phone: "02-225-9775",
    openingHours: "08:00–17:00 ทุกวัน",
    admissionFee: "40 บาท",
    highlights: ["พระพุทธรูปทองคำ", "มรดกโลก"],
  },
  {
    name: "Wat Chakrawat Rachawat",
    nameTh: "วัดจักรวรรดิราชาวาสวรมหาวิหาร",
    lat: 13.7401,
    lng: 100.5038,
    type: "temple",
    description: "วัดเก่าแก่สมัยอยุธยา มีจระเข้สตัฟฟ์และพระพุทธรูปเก่าแก่ที่น่าชม",
    distance: "500 ม.",
    phone: "02-222-5678",
    openingHours: "06:00–18:00 ทุกวัน",
    admissionFee: "ฟรี",
    highlights: ["วัดเก่าสมัยอยุธยา"],
  },
  {
    name: "Wat Pho",
    nameTh: "วัดโพธิ์ (วัดพระเชตุพนฯ)",
    lat: 13.7463,
    lng: 100.4928,
    type: "temple",
    description: "วัดที่มีพระพุทธไสยาสน์องค์ใหญ่ และเป็นสถานที่กำเนิดนวดแผนไทย",
    distance: "2.0 กม.",
    phone: "02-226-0335",
    website: "https://www.watpho.com",
    openingHours: "08:00–18:30 ทุกวัน",
    admissionFee: "200 บาท",
    highlights: ["มรดกโลก", "พระพุทธไสยาสน์", "นวดแผนไทย"],
  },
  {
    name: "Wat Arun Ratchawararam",
    nameTh: "วัดอรุณราชวรารามราชวรมหาวิหาร",
    lat: 13.7437,
    lng: 100.4888,
    type: "temple",
    description: "วัดแจ้ง สัญลักษณ์ของกรุงเทพฯ พระปรางค์สูง 82 เมตร ริมแม่น้ำเจ้าพระยา",
    distance: "2.5 กม.",
    phone: "02-891-2185",
    website: "https://www.watarun.net",
    openingHours: "08:00–18:00 ทุกวัน",
    admissionFee: "100 บาท",
    highlights: ["มรดกโลก", "พระปรางค์", "วิวแม่น้ำ"],
  },

  // === ร้านอาหาร 5 แห่ง ===
  {
    name: "T&K Seafood",
    nameTh: "ร้านที.แอนด์.เค ซีฟู้ด",
    lat: 13.7395,
    lng: 100.5078,
    type: "food",
    description: "ร้านซีฟู้ดชื่อดังบนถนนเยาวราช ขึ้นชื่อเรื่องกุ้งเผาและหอยนางรม",
    distance: "200 ม.",
    phone: "02-236-4519",
    openingHours: "16:00–01:00 ทุกวัน",
    highlights: ["Michelin Bib Gourmand", "กุ้งเผา"],
  },
  {
    name: "Lek & Rut Seafood",
    nameTh: "เล็ก & รัตน์ ซีฟู้ด",
    lat: 13.7393,
    lng: 100.5082,
    type: "food",
    description: "ร้านซีฟู้ดคู่แข่ง T&K ขึ้นชื่อเรื่องปูผัดผงกะหรี่และกุ้งอบวุ้นเส้น",
    distance: "200 ม.",
    phone: "02-222-1539",
    openingHours: "15:30–01:00 ทุกวัน",
    highlights: ["ปูผัดผงกะหรี่"],
  },
  {
    name: "Nai Ek Roll Noodles",
    nameTh: "นายเอ็ก ก๋วยจั๊บ",
    lat: 13.7403,
    lng: 100.5095,
    type: "food",
    description: "ร้านก๋วยจั๊บน้ำข้นที่ดังที่สุดในเยาวราช เปิดมากว่า 80 ปี",
    distance: "150 ม.",
    phone: "02-222-6839",
    openingHours: "10:00–22:00 (หยุดจันทร์)",
    highlights: ["Michelin Bib Gourmand", "ร้านเก่าแก่"],
  },
  {
    name: "Uan Pochana",
    nameTh: "อ้วนโภชนา",
    lat: 13.7389,
    lng: 100.5092,
    type: "food",
    description: "ร้านอาหารจีนแต้จิ๋วเก่าแก่ ขึ้นชื่อเรื่องข้าวหมูแดงและหมูกรอบ",
    distance: "250 ม.",
    openingHours: "08:30–20:30 ทุกวัน",
    highlights: ["ข้าวหมูแดง"],
  },
  {
    name: "Jek Pui Curry Rice",
    nameTh: "เจ๊กปุ้ย ข้าวแกง",
    lat: 13.7400,
    lng: 100.5065,
    type: "food",
    description: "ร้านข้าวแกงยอดนิยมในเยาวราช มีกับข้าวหลากหลายกว่า 30 อย่าง",
    distance: "300 ม.",
    openingHours: "06:00–14:00 (หยุดอาทิตย์)",
    highlights: ["ข้าวแกงยอดนิยม"],
  },

  // === ตลาด 2 แห่ง ===
  {
    name: "Sampeng Market",
    nameTh: "ตลาดสำเพ็ง",
    lat: 13.7388,
    lng: 100.5060,
    type: "market",
    description: "ตลาดค้าส่งที่เก่าแก่ที่สุดในกรุงเทพฯ ขายของทุกอย่างราคาถูก",
    distance: "400 ม.",
    openingHours: "08:00–18:00 ทุกวัน",
    highlights: ["ตลาดค้าส่ง", "ราคาถูก"],
  },
  {
    name: "Pak Khlong Talat",
    nameTh: "ปากคลองตลาด",
    lat: 13.7404,
    lng: 100.4964,
    type: "market",
    description: "ตลาดดอกไม้ที่ใหญ่ที่สุดในกรุงเทพฯ เปิด 24 ชม. ดอกไม้สดส่งตรงทุกวัน",
    distance: "1.5 กม.",
    openingHours: "24 ชั่วโมง",
    highlights: ["ตลาดดอกไม้", "เปิด 24 ชม."],
  },

  // === พิพิธภัณฑ์ 2 แห่ง ===
  {
    name: "Yaowarat Heritage Center",
    nameTh: "ศูนย์มรดกเมืองเยาวราช",
    lat: 13.7398,
    lng: 100.5100,
    type: "museum",
    description: "พิพิธภัณฑ์เล่าเรื่องราวประวัติศาสตร์ชุมชนชาวจีนในเยาวราช",
    distance: "100 ม.",
    openingHours: "10:00–18:00 (หยุดจันทร์)",
    admissionFee: "ฟรี",
    highlights: ["ฟรี", "ประวัติศาสตร์"],
  },
  {
    name: "Hua Lamphong Station",
    nameTh: "สถานีหัวลำโพง",
    lat: 13.7381,
    lng: 100.5173,
    type: "museum",
    description: "สถานีรถไฟเก่าแก่สไตล์อิตาเลียน-เรอเนสซองส์ สร้างปี 2459 กำลังจะเป็นพิพิธภัณฑ์",
    distance: "900 ม.",
    openingHours: "ดูได้จากภายนอก ตลอด 24 ชม.",
    admissionFee: "ฟรี",
    highlights: ["สถาปัตยกรรม", "ฟรี"],
  },

  // === แลนด์มาร์ค 4 แห่ง ===
  {
    name: "Grand Palace",
    nameTh: "พระบรมมหาราชวัง",
    lat: 13.7500,
    lng: 100.4914,
    type: "landmark",
    description: "พระราชวังหลวงสมัยรัตนโกสินทร์ สถานที่ท่องเที่ยวอันดับ 1 ของกรุงเทพฯ",
    distance: "2.5 กม.",
    phone: "02-623-5500",
    website: "https://www.royalgrandpalace.th",
    openingHours: "08:30–15:30 ทุกวัน",
    admissionFee: "500 บาท",
    highlights: ["มรดกโลก", "พระแก้วมรกต"],
  },
  {
    name: "Talat Noi Street Art",
    nameTh: "ตลาดน้อย Street Art",
    lat: 13.7365,
    lng: 100.5120,
    type: "landmark",
    description: "ย่านศิลปะริมแม่น้ำ มีสตรีทอาร์ตและคาเฟ่สุดชิค ในชุมชนเก่าแก่",
    distance: "700 ม.",
    openingHours: "เปิดตลอด (ร้านค้า 10:00–20:00)",
    admissionFee: "ฟรี",
    highlights: ["Street Art", "คาเฟ่", "ฟรี"],
  },
  {
    name: "Yaowarat Road",
    nameTh: "ถนนเยาวราช (ป้ายไฟเยาวราช)",
    lat: 13.7398,
    lng: 100.5090,
    type: "landmark",
    description: "ถนนสายหลักของไชน่าทาวน์กรุงเทพ ป้ายไฟเยาวราชที่โด่งดังและร้านอาหารเรียงราย",
    distance: "100 ม.",
    openingHours: "ป้ายไฟสวยช่วง 18:00–00:00",
    admissionFee: "ฟรี",
    highlights: ["ป้ายไฟเยาวราช", "ฟรี"],
  },
  {
    name: "Odeon Circle",
    nameTh: "วงเวียนโอเดียน",
    lat: 13.7387,
    lng: 100.5111,
    type: "landmark",
    description: "วงเวียนสำคัญของเยาวราช มีซุ้มประตูจีนสีแดงสวยงาม เป็นจุดถ่ายรูปยอดนิยม",
    distance: "350 ม.",
    openingHours: "เปิดตลอด",
    admissionFee: "ฟรี",
    highlights: ["ซุ้มประตูจีน", "จุดถ่ายรูป", "ฟรี"],
  },

  // === เทศกาล 3 งาน ===
  {
    name: "Chinese New Year Festival",
    nameTh: "เทศกาลตรุษจีนเยาวราช",
    lat: 13.7398,
    lng: 100.5090,
    type: "event",
    description: "เทศกาลตรุษจีนที่ใหญ่ที่สุดนอกประเทศจีน มีขบวนมังกร สิงโต และการแสดงมากมาย",
    distance: "100 ม.",
    openingHours: "ปลายมกราคม–กุมภาพันธ์ (ตามปฏิทินจันทรคติ)",
    admissionFee: "ฟรี",
    highlights: ["เทศกาลใหญ่", "ขบวนมังกร", "ฟรี"],
  },
  {
    name: "Vegetarian Festival",
    nameTh: "เทศกาลกินเจเยาวราช",
    lat: 13.7398,
    lng: 100.5090,
    type: "event",
    description: "เทศกาลกินเจ 9 วัน ถนนเยาวราชเต็มไปด้วยร้านอาหารเจ ธงเหลืองปลิวสะบัด",
    distance: "100 ม.",
    openingHours: "กันยายน–ตุลาคม (ตามปฏิทินจันทรคติ)",
    admissionFee: "ฟรี",
    highlights: ["อาหารเจ", "ธงเหลือง", "ฟรี"],
  },
  {
    name: "Mid-Autumn Festival",
    nameTh: "เทศกาลไหว้พระจันทร์ (เทศกาลขนมไหว้)",
    lat: 13.7398,
    lng: 100.5090,
    type: "event",
    description: "เทศกาลขนมไหว้พระจันทร์ มีขนมไหว้นานาชนิดขายตลอดถนนเยาวราช",
    distance: "100 ม.",
    openingHours: "กันยายน–ตุลาคม (ตามปฏิทินจันทรคติ)",
    admissionFee: "ฟรี",
    highlights: ["ขนมไหว้", "ฟรี"],
  },
];

export const EXPLORE_TYPE_COLORS: Record<ExplorePlaceType, string> = {
  temple: "#E74C3C",
  food: "#27AE60",
  market: "#F39C12",
  landmark: "#9B59B6",
  museum: "#3498DB",
  event: "#E91E63",
};

export const EXPLORE_TYPE_LABELS: Record<ExplorePlaceType, string> = {
  temple: "วัด",
  food: "ร้านอาหาร",
  market: "ตลาด",
  landmark: "สถานที่สำคัญ",
  museum: "พิพิธภัณฑ์",
  event: "เทศกาล",
};

export { HOTEL_LOCATION };
