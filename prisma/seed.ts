import { PrismaClient, ProductType, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // ==================== Create Admin User ====================
  const adminPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "test@test.com" },
    update: {},
    create: {
      email: "test@test.com",
      password: adminPassword,
      name: "Admin",
      role: UserRole.ADMIN,
      emailVerified: new Date(),
    },
  });
  console.log(`Created admin user: ${admin.email}`);

  // Seed Rooms
  const rooms = [
    {
      name: "Cozy Single Room",
      nameTh: "ห้องเดี่ยวอบอุ่น",
      description: "Perfect for solo travelers. Includes free WiFi and air conditioning.",
      descTh: "เหมาะสำหรับนักเดินทางคนเดียว รวม WiFi ฟรีและแอร์",
      type: ProductType.ROOM,
      price: 890,
      images: ["/images/rooms/single-1.jpg"],
      roomNumber: "101",
      capacity: 1,
      amenities: ["WiFi", "Air Conditioning", "TV", "Private Bathroom"],
    },
    {
      name: "Deluxe Double Room",
      nameTh: "ห้องคู่ดีลักซ์",
      description: "Spacious room with city view. Perfect for couples.",
      descTh: "ห้องกว้างขวางวิวเมือง เหมาะสำหรับคู่รัก",
      type: ProductType.ROOM,
      price: 1490,
      images: ["/images/rooms/double-1.jpg"],
      roomNumber: "201",
      capacity: 2,
      amenities: ["WiFi", "Air Conditioning", "TV", "Private Bathroom", "Mini Fridge", "City View"],
    },
    {
      name: "Family Suite",
      nameTh: "ห้องครอบครัว",
      description: "Large room perfect for families. Includes extra beds.",
      descTh: "ห้องขนาดใหญ่สำหรับครอบครัว มีเตียงเสริม",
      type: ProductType.ROOM,
      price: 2290,
      images: ["/images/rooms/family-1.jpg"],
      roomNumber: "301",
      capacity: 4,
      amenities: ["WiFi", "Air Conditioning", "TV", "Private Bathroom", "Mini Fridge", "Sofa"],
    },
  ];

  // Seed Tours
  const tours = [
    {
      name: "Chinatown Photo Walk",
      nameTh: "ถ่ายรูปเยาวราชกับช่างภาพ",
      description: "Professional photographer + Cheongsam rental available",
      descTh: "ช่างภาพมืออาชีพ + มีชุดกี่เพ้าให้เช่า",
      type: ProductType.TOUR,
      price: 1500,
      images: ["/images/tours/photo-walk.jpg"],
      duration: "2 hours",
      meetingPoint: "Hotel Lobby",
      schedule: { days: ["Sat", "Sun"], times: ["09:00", "15:00"] },
    },
    {
      name: "Night Street Food Tour",
      nameTh: "ทัวร์ Street Food ยามค่ำ",
      description: "Taste the best of Yaowarat street food with local guide",
      descTh: "ลิ้มรสอาหารริมทางยอดนิยมกับไกด์ท้องถิ่น",
      type: ProductType.TOUR,
      price: 1200,
      images: ["/images/tours/food-tour.jpg"],
      duration: "3 hours",
      meetingPoint: "Hotel Lobby",
      schedule: { days: ["Mon", "Wed", "Fri", "Sat"], times: ["18:00"] },
    },
    {
      name: "Temple & History Walk",
      nameTh: "เดินชมวัดและประวัติศาสตร์",
      description: "Explore ancient temples and learn about Chinatown history",
      descTh: "สำรวจวัดเก่าแก่และเรียนรู้ประวัติศาสตร์เยาวราช",
      type: ProductType.TOUR,
      price: 800,
      images: ["/images/tours/temple-walk.jpg"],
      duration: "2.5 hours",
      meetingPoint: "Wat Mangkon MRT",
      schedule: { days: ["Tue", "Thu", "Sat", "Sun"], times: ["09:00", "14:00"] },
    },
  ];

  // Seed Services
  const services = [
    {
      name: "Street Food Fast Track",
      nameTh: "บริการจองคิวอาหารเยาวราช",
      description: "Skip the queue! We reserve your spot at famous Yaowarat restaurants.",
      descTh: "บริการจองคิวร้านดังเยาวราชล่วงหน้า ไม่ต้องต่อแถว",
      type: ProductType.FOOD,
      price: 200,
      images: ["/images/services/fast-track.jpg"],
    },
    {
      name: "Airport Transfer",
      nameTh: "รถรับส่งสนามบิน",
      description: "Private car from/to Suvarnabhumi or Don Mueang airport",
      descTh: "รถรับส่งสนามบินสุวรรณภูมิ/ดอนเมือง",
      type: ProductType.SERVICE,
      price: 800,
      images: ["/images/services/transfer.jpg"],
    },
    {
      name: "Late Checkout (until 2PM)",
      nameTh: "เช็คเอาท์สาย (ถึง 14:00)",
      description: "Extend your checkout until 2PM",
      descTh: "ขยายเวลาเช็คเอาท์ถึงบ่าย 2 โมง",
      type: ProductType.SERVICE,
      price: 300,
      images: ["/images/services/late-checkout.jpg"],
    },
    {
      name: "Luggage Delivery to Airport",
      nameTh: "ส่งกระเป๋าไปสนามบิน",
      description: "Drop your bags, explore freely. We deliver to airport.",
      descTh: "ฝากกระเป๋า เดินเที่ยวตัวเบา เราส่งไปสนามบินให้",
      type: ProductType.SERVICE,
      price: 500,
      images: ["/images/services/luggage.jpg"],
    },
  ];

  // Seed Merchandise
  const merchandise = [
    {
      name: "Yaowarat Starter Kit",
      nameTh: "ชุดของฝากเยาวราช",
      description: "Curated souvenir set: Dried pork, roasted chestnuts, Chinese pastries",
      descTh: "เซ็ตของฝากคัดสรร: หมูแผ่น เกาลัด ขนมจีน",
      type: ProductType.MERCH,
      price: 450,
      images: ["/images/merch/starter-kit.jpg"],
    },
    {
      name: "Tourist SIM Card",
      nameTh: "ซิมการ์ดนักท่องเที่ยว",
      description: "7-day unlimited data SIM, ready to use",
      descTh: "ซิมเน็ตไม่อั้น 7 วัน พร้อมใช้งานทันที",
      type: ProductType.MERCH,
      price: 299,
      images: ["/images/merch/sim-card.jpg"],
    },
  ];

  // Create all products
  const allProducts = [...rooms, ...tours, ...services, ...merchandise];

  for (const product of allProducts) {
    const created = await prisma.product.create({
      data: {
        name: product.name,
        nameTh: product.nameTh,
        description: product.description,
        descTh: product.descTh,
        type: product.type,
        price: product.price,
        images: product.images,
        roomNumber: "roomNumber" in product ? product.roomNumber : null,
        capacity: "capacity" in product ? product.capacity : null,
        amenities: "amenities" in product ? product.amenities : [],
        duration: "duration" in product ? product.duration : null,
        meetingPoint: "meetingPoint" in product ? product.meetingPoint : null,
        schedule: "schedule" in product ? product.schedule : undefined,
      },
    });
    console.log(`Created product: ${created.name}`);
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
