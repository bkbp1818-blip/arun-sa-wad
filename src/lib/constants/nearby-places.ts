export const HOTEL_LOCATION = {
  name: "ARUN SA WAD",
  nameTh: "อรุณสวัสดิ์",
  lat: 13.7407,
  lng: 100.5086,
  address: "ถนนเยาวราช แขวงสัมพันธวงศ์ เขตสัมพันธวงศ์ กรุงเทพฯ 10100",
  phone: "02-222-1234",
  description: "โรงแรมบูติคใจกลางเยาวราช",
};

export interface HotelBranch {
  id: string;
  name: string;
  nameTh: string;
  shortName: string;
  lat: number;
  lng: number;
}

export const HOTEL_BRANCHES: HotelBranch[] = [
  { id: "chinatown", name: "ARUN SA WAD - CHINATOWN", nameTh: "ไชน่าทาวน์", shortName: "CHINATOWN", lat: 13.740065, lng: 100.5136482 },
  { id: "yaowarat", name: "ARUN SA WAD - YAOWARAT", nameTh: "เยาวราช", shortName: "YAOWARAT", lat: 13.7435887, lng: 100.504873 },
  { id: "nana", name: "ARUN SA WAD - 103 NANA", nameTh: "103 นานา", shortName: "103 NANA", lat: 13.7392403, lng: 100.5139454 },
  { id: "ladphrao", name: "ARUN SA WAD - House Lad Phrao", nameTh: "บ้านลาดพร้าว", shortName: "House ลาดพร้าว", lat: 13.8092807, lng: 100.5732116 },
  { id: "onnut", name: "ARUN SA WAD - House ON NUT", nameTh: "บ้านอ่อนนุช", shortName: "House อ่อนนุช", lat: 13.7056708, lng: 100.6059399 },
];

export interface NearbyPlace {
  name: string;
  nameTh: string;
  lat: number;
  lng: number;
  type: "temple" | "market" | "transport" | "landmark" | "food";
  description: string;
  distance: string;
}

export const NEARBY_PLACES: NearbyPlace[] = [
  {
    name: "Wat Mangkon Kamalawat",
    nameTh: "วัดมังกรกมลาวาส (วัดเล่งเน่ยยี่)",
    lat: 13.7420,
    lng: 100.5070,
    type: "temple",
    description: "วัดจีนที่สำคัญที่สุดในเยาวราช สร้างปี พ.ศ. 2414",
    distance: "200 ม.",
  },
  {
    name: "Wat Traimit",
    nameTh: "วัดไตรมิตรวิทยารามวรวิหาร",
    lat: 13.7373,
    lng: 100.5134,
    type: "temple",
    description: "ที่ประดิษฐานพระพุทธรูปทองคำแท้ที่ใหญ่ที่สุดในโลก",
    distance: "600 ม.",
  },
  {
    name: "Yaowarat Road",
    nameTh: "ถนนเยาวราช",
    lat: 13.7398,
    lng: 100.5090,
    type: "landmark",
    description: "ถนนสายหลักของไชน่าทาวน์กรุงเทพ ป้ายไฟเยาวราชที่โด่งดัง",
    distance: "100 ม.",
  },
  {
    name: "Talat Kao (Old Market)",
    nameTh: "ตลาดเก่าเยาวราช",
    lat: 13.7410,
    lng: 100.5100,
    type: "market",
    description: "ตลาดเก่าแก่ขายของแห้ง สมุนไพรจีน และอาหาร",
    distance: "150 ม.",
  },
  {
    name: "MRT Wat Mangkon",
    nameTh: "สถานี MRT วัดมังกร",
    lat: 13.7421,
    lng: 100.5103,
    type: "transport",
    description: "สถานีรถไฟฟ้า MRT สายสีน้ำเงิน ทางออก 1",
    distance: "300 ม.",
  },
  {
    name: "Sampeng Lane",
    nameTh: "ซอยสำเพ็ง (ตรอกเล่งบ๊วยเอี๊ย)",
    lat: 13.7388,
    lng: 100.5060,
    type: "market",
    description: "ตลาดค้าส่งที่เก่าแก่ที่สุดในกรุงเทพฯ",
    distance: "400 ม.",
  },
  {
    name: "T&K Seafood",
    nameTh: "ร้านที.แอนด์.เค ซีฟู้ด",
    lat: 13.7395,
    lng: 100.5078,
    type: "food",
    description: "ร้านซีฟู้ดชื่อดังบนถนนเยาวราช กุ้งเผาอร่อยมาก",
    distance: "200 ม.",
  },
];

export const PLACE_TYPE_COLORS: Record<NearbyPlace["type"], string> = {
  temple: "#E74C3C",
  market: "#F39C12",
  transport: "#3498DB",
  landmark: "#9B59B6",
  food: "#27AE60",
};

export const PLACE_TYPE_LABELS: Record<NearbyPlace["type"], string> = {
  temple: "วัด",
  market: "ตลาด",
  transport: "ขนส่ง",
  landmark: "สถานที่สำคัญ",
  food: "อาหาร",
};
