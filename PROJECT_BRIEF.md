# ARUN SA WAD - Web Platform Project Brief

## 🎯 Project Overview

**ชื่อโปรเจค:** ARUN SA WAD (อรุณสวัสดิ์) - Yaowarat Hostel Booking & Upsell Platform  
**ประเภท:** Full-stack Web Application  
**เป้าหมาย:** ระบบจองห้องพัก + ขายบริการเสริม (Upsell) + Affiliate Marketing สำหรับโรงแรมขนาดเล็กในเยาวราช

---

## 🛠 Tech Stack

```
Framework:      Next.js 14 (App Router)
Styling:        Tailwind CSS + Shadcn UI
Database:       PostgreSQL (Neon recommended)
ORM:            Prisma
Authentication: NextAuth.js (LINE, Google, Facebook providers)
Payment:        Stripe / PromptPay QR integration
Deployment:     Vercel
Language:       TypeScript
```

---

## 📊 Database Schema (Prisma)

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ==================== USERS & AUTH ====================

model User {
  id            String    @id @default(cuid())
  email         String?   @unique
  name          String?
  phone         String?
  image         String?
  emailVerified DateTime?
  role          UserRole  @default(GUEST)
  
  // Relations
  accounts      Account[]
  sessions      Session[]
  bookings      Booking[]
  affiliate     Affiliate?
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

enum UserRole {
  GUEST
  ADMIN
  AGENT
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// ==================== PRODUCTS ====================

model Product {
  id          String      @id @default(cuid())
  name        String
  nameTh      String
  description String?     @db.Text
  descTh      String?     @db.Text
  type        ProductType
  price       Decimal     @db.Decimal(10, 2)
  currency    String      @default("THB")
  images      String[]    // Array of image URLs
  isActive    Boolean     @default(true)
  
  // For ROOM type
  roomNumber  String?
  capacity    Int?
  amenities   String[]
  
  // For TOUR type
  duration    String?     // e.g., "3 hours"
  meetingPoint String?
  schedule    Json?       // Available days/times
  
  // Relations
  bookingItems BookingItem[]
  
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}

enum ProductType {
  ROOM          // ห้องพัก
  TOUR          // ทัวร์/กิจกรรม
  FOOD          // อาหาร/Street Food
  MERCH         // ของฝาก/Starter Kit
  SERVICE       // บริการเสริม (Late checkout, Luggage, Transfer)
}

// ==================== BOOKINGS ====================

model Booking {
  id              String        @id @default(cuid())
  bookingNumber   String        @unique @default(cuid())
  userId          String
  status          BookingStatus @default(PENDING)
  
  // Dates (for room bookings)
  checkIn         DateTime?
  checkOut        DateTime?
  
  // Pricing
  subtotal        Decimal       @db.Decimal(10, 2)
  discount        Decimal       @default(0) @db.Decimal(10, 2)
  total           Decimal       @db.Decimal(10, 2)
  
  // Payment
  paymentStatus   PaymentStatus @default(UNPAID)
  paymentMethod   String?
  paymentRef      String?
  
  // Affiliate tracking
  affiliateId     String?
  commissionPaid  Decimal       @default(0) @db.Decimal(10, 2)
  
  // Relations
  user            User          @relation(fields: [userId], references: [id])
  items           BookingItem[]
  affiliate       Affiliate?    @relation(fields: [affiliateId], references: [id])
  
  // Guest info (if different from user)
  guestName       String?
  guestEmail      String?
  guestPhone      String?
  specialRequests String?       @db.Text
  
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}

enum BookingStatus {
  PENDING
  CONFIRMED
  CHECKED_IN
  COMPLETED
  CANCELLED
}

enum PaymentStatus {
  UNPAID
  PAID
  REFUNDED
  PARTIAL
}

model BookingItem {
  id          String   @id @default(cuid())
  bookingId   String
  productId   String
  quantity    Int      @default(1)
  unitPrice   Decimal  @db.Decimal(10, 2)
  totalPrice  Decimal  @db.Decimal(10, 2)
  
  // Specific date/time for this item
  serviceDate DateTime?
  notes       String?
  
  booking     Booking  @relation(fields: [bookingId], references: [id], onDelete: Cascade)
  product     Product  @relation(fields: [productId], references: [id])
  
  createdAt   DateTime @default(now())
}

// ==================== AFFILIATE SYSTEM ====================

model Affiliate {
  id              String   @id @default(cuid())
  userId          String   @unique
  referralCode    String   @unique
  commissionRate  Decimal  @default(10) @db.Decimal(5, 2) // percentage
  
  // Balance
  totalEarned     Decimal  @default(0) @db.Decimal(10, 2)
  pendingBalance  Decimal  @default(0) @db.Decimal(10, 2)
  paidBalance     Decimal  @default(0) @db.Decimal(10, 2)
  
  // Bank info for withdrawal
  bankName        String?
  bankAccount     String?
  bankAccountName String?
  
  // Stats
  totalClicks     Int      @default(0)
  totalBookings   Int      @default(0)
  
  // Relations
  user            User     @relation(fields: [userId], references: [id])
  bookings        Booking[]
  withdrawals     Withdrawal[]
  
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model Withdrawal {
  id          String           @id @default(cuid())
  affiliateId String
  amount      Decimal          @db.Decimal(10, 2)
  status      WithdrawalStatus @default(PENDING)
  
  // Admin processing
  processedBy String?
  processedAt DateTime?
  transferRef String?
  notes       String?
  
  affiliate   Affiliate        @relation(fields: [affiliateId], references: [id])
  
  createdAt   DateTime         @default(now())
}

enum WithdrawalStatus {
  PENDING
  APPROVED
  COMPLETED
  REJECTED
}

// ==================== PARTNER COUPONS ====================

model PartnerCoupon {
  id          String   @id @default(cuid())
  code        String   @unique
  partnerName String   // e.g., "ร้านซีฟู้ดเสื้อเขียว"
  description String
  discountType String  // "PERCENT" or "FIXED"
  discountValue Decimal @db.Decimal(10, 2)
  
  validFrom   DateTime
  validUntil  DateTime
  maxUses     Int?
  usedCount   Int      @default(0)
  
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
}
```

---

## 📁 Recommended File Structure

```
arun-sa-wad/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   ├── (guest)/
│   │   │   ├── page.tsx                 # Homepage
│   │   │   ├── rooms/
│   │   │   │   ├── page.tsx             # Room listing
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx         # Room detail
│   │   │   ├── tours/
│   │   │   │   ├── page.tsx             # Tours listing
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── services/
│   │   │   │   └── page.tsx             # Upsell services
│   │   │   ├── booking/
│   │   │   │   ├── page.tsx             # Cart/Checkout
│   │   │   │   └── confirmation/
│   │   │   │       └── page.tsx
│   │   │   └── my-bookings/
│   │   │       └── page.tsx
│   │   ├── admin/
│   │   │   ├── layout.tsx               # Admin layout with sidebar
│   │   │   ├── page.tsx                 # Dashboard
│   │   │   ├── products/
│   │   │   │   ├── page.tsx             # Product management
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── bookings/
│   │   │   │   └── page.tsx
│   │   │   ├── affiliates/
│   │   │   │   ├── page.tsx             # Affiliate list
│   │   │   │   └── withdrawals/
│   │   │   │       └── page.tsx
│   │   │   └── coupons/
│   │   │       └── page.tsx
│   │   ├── agent/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                 # Agent dashboard
│   │   │   ├── earnings/
│   │   │   │   └── page.tsx
│   │   │   └── withdraw/
│   │   │       └── page.tsx
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts
│   │   │   ├── products/
│   │   │   │   └── route.ts
│   │   │   ├── bookings/
│   │   │   │   └── route.ts
│   │   │   ├── affiliates/
│   │   │   │   ├── route.ts
│   │   │   │   ├── track/
│   │   │   │   │   └── route.ts         # Track referral clicks
│   │   │   │   └── withdraw/
│   │   │   │       └── route.ts
│   │   │   └── webhooks/
│   │   │       └── payment/
│   │   │           └── route.ts
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/                          # Shadcn components
│   │   ├── booking/
│   │   │   ├── BookingCart.tsx
│   │   │   ├── DatePicker.tsx
│   │   │   └── GuestForm.tsx
│   │   ├── products/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── RoomCard.tsx
│   │   │   └── TourCard.tsx
│   │   ├── admin/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── RevenueChart.tsx
│   │   │   └── BookingTable.tsx
│   │   └── shared/
│   │       ├── Navbar.tsx
│   │       ├── Footer.tsx
│   │       └── ChatWidget.tsx           # AI Chatbot
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   ├── utils.ts
│   │   └── constants.ts
│   ├── hooks/
│   │   ├── useCart.ts
│   │   └── useAffiliate.ts
│   └── types/
│       └── index.ts
├── public/
│   └── images/
├── .env.local
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🔐 Authentication Setup

### NextAuth Configuration

```typescript
// src/lib/auth.ts
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import LineProvider from "next-auth/providers/line";
import FacebookProvider from "next-auth/providers/facebook";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID!,
      clientSecret: process.env.LINE_CLIENT_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
```

### Environment Variables (.env.example)

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/arunsawad?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# LINE Login
LINE_CLIENT_ID=""
LINE_CLIENT_SECRET=""

# Google OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Facebook OAuth
FACEBOOK_CLIENT_ID=""
FACEBOOK_CLIENT_SECRET=""

# Payment (optional)
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
```

---

## 📋 Feature Specifications

### 1. Guest Features (ลูกค้า)

| Feature | Description | Priority |
|---------|-------------|----------|
| Social Login | LINE, Google, Facebook | 🔴 Must Have |
| Room Browsing | ดูห้องพัก + ราคา + availability | 🔴 Must Have |
| Tour Browsing | ดูทัวร์/กิจกรรม Yaowarat | 🔴 Must Have |
| Mixed Cart | ใส่ห้อง + ทัวร์ + บริการเสริมในตะกร้าเดียว | 🔴 Must Have |
| Checkout | ชำระเงิน + กรอกข้อมูลผู้เข้าพัก | 🔴 Must Have |
| Booking History | ดูประวัติการจอง | 🟡 Nice to Have |
| Referral Link | แชร์ลิงก์รับค่าคอมมิชชั่น | 🟡 Nice to Have |

### 2. Admin Features (ผู้ดูแล)

| Feature | Description | Priority |
|---------|-------------|----------|
| Dashboard | กราฟรายได้ (Room vs Upsell) | 🔴 Must Have |
| Product CRUD | เพิ่ม/แก้ไข/ลบ ห้องพัก/ทัวร์/สินค้า | 🔴 Must Have |
| Booking Management | ดูรายการจอง + อัพเดทสถานะ | 🔴 Must Have |
| Affiliate Management | ดูรายชื่อ Agent + ยอด | 🔴 Must Have |
| Withdrawal Approval | อนุมัติการถอนเงิน Agent | 🔴 Must Have |
| Partner Coupons | จัดการคูปองพาร์ทเนอร์ | 🟡 Nice to Have |

### 3. Agent Features (ตัวแทน)

| Feature | Description | Priority |
|---------|-------------|----------|
| Agent Dashboard | ดูยอดคลิก + ยอดจอง + รายได้ | 🔴 Must Have |
| Referral Code | สร้างลิงก์แนะนำ | 🔴 Must Have |
| Earnings Report | รายงานค่าคอมมิชชั่น | 🔴 Must Have |
| Withdrawal Request | แจ้งถอนเงินเข้าบัญชี | 🔴 Must Have |

---

## 🍜 Upsell Products to Seed

```typescript
// prisma/seed.ts - Example products

const upsellProducts = [
  // Street Food Fast Track
  {
    name: "Street Food Fast Track",
    nameTh: "บริการจองคิวอาหารเยาวราช",
    type: "FOOD",
    price: 200,
    description: "Skip the queue! We reserve your spot at famous Yaowarat restaurants.",
    descTh: "บริการจองคิวร้านดังเยาวราชล่วงหน้า ไม่ต้องต่อแถว",
  },
  // Airport Transfer
  {
    name: "Airport Transfer",
    nameTh: "รถรับส่งสนามบิน",
    type: "SERVICE",
    price: 800,
    description: "Private car from/to Suvarnabhumi or Don Mueang airport",
    descTh: "รถรับส่งสนามบินสุวรรณภูมิ/ดอนเมือง",
  },
  // Late Checkout
  {
    name: "Late Checkout (until 2PM)",
    nameTh: "เช็คเอาท์สาย (ถึง 14:00)",
    type: "SERVICE",
    price: 300,
    description: "Extend your checkout until 2PM",
    descTh: "ขยายเวลาเช็คเอาท์ถึงบ่าย 2 โมง",
  },
  // Chinatown Photo Walk
  {
    name: "Chinatown Photo Walk",
    nameTh: "ถ่ายรูปเยาวราชกับช่างภาพ",
    type: "TOUR",
    price: 1500,
    duration: "2 hours",
    description: "Professional photographer + Cheongsam rental available",
    descTh: "ช่างภาพมืออาชีพ + มีชุดกี่เพ้าให้เช่า",
  },
  // Yaowarat Starter Kit
  {
    name: "Yaowarat Starter Kit",
    nameTh: "ชุดของฝากเยาวราช",
    type: "MERCH",
    price: 450,
    description: "Curated souvenir set: Dried pork, roasted chestnuts, Chinese pastries",
    descTh: "เซ็ตของฝากคัดสรร: หมูแผ่น เกาลัด ขนมจีน",
  },
  // Luggage Delivery
  {
    name: "Luggage Delivery to Airport",
    nameTh: "ส่งกระเป๋าไปสนามบิน",
    type: "SERVICE",
    price: 500,
    description: "Drop your bags, explore freely. We deliver to airport.",
    descTh: "ฝากกระเป๋า เดินเที่ยวตัวเบา เราส่งไปสนามบินให้",
  },
  // Tourist SIM
  {
    name: "Tourist SIM Card",
    nameTh: "ซิมการ์ดนักท่องเที่ยว",
    type: "MERCH",
    price: 299,
    description: "7-day unlimited data SIM, ready to use",
    descTh: "ซิมเน็ตไม่อั้น 7 วัน พร้อมใช้งานทันที",
  },
];
```

---

## 📈 Admin Dashboard Charts

### Revenue Chart Requirements

```typescript
// Components needed for admin dashboard

// 1. Revenue Overview (Line/Bar Chart)
// - X-axis: Days/Weeks/Months
// - Y-axis: Revenue in THB
// - Series: Room Revenue vs Upsell Revenue

// 2. Booking Source Pie Chart
// - Direct bookings
// - Affiliate referrals
// - OTA (if tracked)

// 3. Top Upsell Products (Horizontal Bar)
// - Rank products by revenue

// 4. Affiliate Performance Table
// - Name, Clicks, Bookings, Conversion Rate, Earnings
```

---

## 🔗 API Endpoints Summary

### Public APIs
```
GET  /api/products              # List all active products
GET  /api/products/[id]         # Get product detail
GET  /api/products/rooms        # List rooms with availability
GET  /api/products/tours        # List tours
POST /api/bookings              # Create new booking
GET  /api/affiliates/track      # Track referral click (with code param)
```

### Protected APIs (Authenticated)
```
GET  /api/bookings/my           # Get user's bookings
GET  /api/affiliates/me         # Get user's affiliate info
POST /api/affiliates/withdraw   # Request withdrawal
```

### Admin APIs
```
GET    /api/admin/dashboard     # Dashboard stats
GET    /api/admin/bookings      # All bookings
PATCH  /api/admin/bookings/[id] # Update booking status
GET    /api/admin/affiliates    # All affiliates
POST   /api/admin/withdrawals/[id]/approve  # Approve withdrawal
CRUD   /api/admin/products      # Product management
CRUD   /api/admin/coupons       # Coupon management
```

---

## 🚀 Development Phases

### Phase 1: Foundation (Week 1-2)
- [ ] Initialize Next.js project with TypeScript
- [ ] Setup Prisma + PostgreSQL connection
- [ ] Implement NextAuth with LINE + Google
- [ ] Create basic UI layout (Navbar, Footer)
- [ ] Setup Shadcn UI components

### Phase 2: Core Booking (Week 3-4)
- [ ] Product listing pages (Rooms, Tours, Services)
- [ ] Product detail pages
- [ ] Shopping cart functionality
- [ ] Checkout flow
- [ ] Booking confirmation

### Phase 3: Admin Panel (Week 5-6)
- [ ] Admin layout with sidebar
- [ ] Dashboard with charts (use Recharts or Chart.js)
- [ ] Product CRUD interface
- [ ] Booking management table
- [ ] Basic reporting

### Phase 4: Affiliate System (Week 7)
- [ ] Affiliate registration flow
- [ ] Referral link generation
- [ ] Click tracking
- [ ] Commission calculation
- [ ] Withdrawal request system

### Phase 5: Polish & Deploy (Week 8)
- [ ] AI Chatbot integration (optional)
- [ ] Email notifications
- [ ] Payment gateway integration
- [ ] Testing & bug fixes
- [ ] Deploy to Vercel

---

## 💡 Important Notes for Claude Code

1. **ใช้ App Router** - ไม่ใช้ Pages Router แบบเก่า
2. **TypeScript เท่านั้น** - ไม่ใช้ JavaScript
3. **Server Components เป็นหลัก** - ใช้ Client Components เฉพาะที่จำเป็น
4. **Prisma transactions** - ใช้สำหรับ booking creation ที่มีหลาย items
5. **LINE Login สำคัญมาก** - คนไทยใช้ LINE เป็นหลัก ต้อง setup ให้ถูกต้อง
6. **Mobile-first** - ลูกค้าส่วนใหญ่ใช้มือถือ
7. **ภาษาไทย** - UI ต้องรองรับภาษาไทย (แต่ code เป็นภาษาอังกฤษ)

---

## 📞 Contact & Support

**Project Owner:** ARUN SA WAD Hostel  
**Location:** Yaowarat, Bangkok  
**Target Launch:** TBD

---

*Document Version: 1.0*  
*Last Updated: January 2025*
