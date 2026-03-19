# ARUN SA WAD - Implementation Plan

## Project Overview

**ชื่อโปรเจค:** ARUN SA WAD (อรุณสวัสดิ์)
**ประเภท:** Hostel Booking + Upsell + Affiliate Marketing Platform
**Production URL:** https://sale-cyan.vercel.app
**GitHub Repo:** https://github.com/bkbp1818-blip/arun-sa-wad

---

## Tech Stack (Actual)

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.1.1 | Framework (App Router + Turbopack) |
| TypeScript | 5.x | Type Safety |
| Tailwind CSS | 4.x | Styling |
| Shadcn UI | Latest | UI Components |
| Prisma | 5.22.0 | ORM |
| PostgreSQL | Neon | Database |
| NextAuth.js | v5 (Beta) | Authentication |
| Zustand | 5.x | State Management (Cart) |
| Recharts | 2.x | Admin Charts |
| promptpay-qr | 3.x | PromptPay QR Generation |
| Leaflet + react-leaflet | 1.9 / 4.2 | Maps (OpenStreetMap - Free) |
| @anthropic-ai/sdk | Latest | AI Chat (Claude API) |
| Vercel | - | Hosting & Deployment |

---

## Implementation Status

### Phase 1: Foundation - COMPLETED

| Task | Status | Files |
|------|--------|-------|
| Initialize Next.js project | Done | `package.json`, `next.config.ts` |
| Setup Prisma + PostgreSQL | Done | `prisma/schema.prisma` |
| NextAuth with Credentials | Done | `src/lib/auth.ts` |
| Google OAuth | Done | Vercel env vars configured (Testing mode) |
| LINE OAuth | Pending | Button removed, need LINE Developer Console |
| Basic UI Layout | Done | `src/components/shared/` |
| Shadcn UI Components | Done | `src/components/ui/` |

### Phase 2: Core Booking (Guest Flow) - COMPLETED

| Task | Status | Files |
|------|--------|-------|
| Homepage | Done | `src/app/(guest)/page.tsx` |
| Rooms Listing | Done | `src/app/(guest)/rooms/page.tsx` |
| Room Detail | Done | `src/app/(guest)/rooms/[id]/page.tsx` |
| Tours Listing | Done | `src/app/(guest)/tours/page.tsx` |
| Tour Detail | Done | `src/app/(guest)/tours/[id]/page.tsx` |
| Services Page | Done | `src/app/(guest)/services/page.tsx` |
| Cart System (Zustand) | Done | `src/hooks/useCart.ts` |
| Booking Page | Done | `src/app/(guest)/booking/page.tsx` |
| Booking Confirmation | Done | `src/app/(guest)/booking/confirmation/page.tsx` |
| My Bookings | Done | `src/app/(guest)/my-bookings/page.tsx` |

### Phase 3: Admin Panel - COMPLETED

| Task | Status | Files |
|------|--------|-------|
| Admin Layout | Done | `src/app/admin/layout.tsx` |
| Admin Sidebar | Done | `src/components/admin/AdminSidebar.tsx` |
| Dashboard + Charts | Done | `src/app/admin/page.tsx` |
| Product CRUD | Done | `src/app/admin/products/page.tsx` |
| Booking Management | Done | `src/app/admin/bookings/page.tsx` |
| Affiliate Management | Done | `src/app/admin/affiliates/page.tsx` |
| Withdrawal Approval | Done | `src/app/admin/withdrawals/page.tsx` |
| Coupon Management | Done | `src/app/admin/coupons/page.tsx` |

### Phase 4: Affiliate System (Agent) - COMPLETED

| Task | Status | Files |
|------|--------|-------|
| Agent Layout | Done | `src/app/agent/layout.tsx` |
| Agent Dashboard | Done | `src/app/agent/page.tsx` |
| Referral Link | Done | `src/app/agent/referral/page.tsx` |
| Earnings Report | Done | `src/app/agent/earnings/page.tsx` |
| Withdrawal Request | Done | `src/app/agent/withdraw/page.tsx` |
| Bank Account Setup | Done | `src/app/agent/withdraw/page.tsx` |
| Click Tracking | Done | `src/app/api/affiliates/track/route.ts` |

### Phase 5: Payment & Deployment - COMPLETED

| Task | Status | Files |
|------|--------|-------|
| PromptPay QR API | Done | `src/app/api/payment/promptpay/route.ts` |
| Payment Page | Done | `src/app/(guest)/payment/[bookingId]/page.tsx` |
| Deploy to Vercel | Done | https://sale-cyan.vercel.app |
| GitHub Auto-deploy | Done | Connected via Vercel |
| Environment Variables | Done | All configured in Vercel |

### Phase 6: v1.2.0 Features - COMPLETED

| Task | Status | Files |
|------|--------|-------|
| AI Chat Widget | Done | `src/components/chat/`, `src/app/api/chat/route.ts` |
| Maps (Leaflet/OpenStreetMap) | Done | `src/components/maps/`, `src/app/(guest)/location/` |
| Category System | Done | `src/app/admin/categories/`, `src/app/api/admin/categories/` |
| Product Edit Page | Done | `src/app/admin/products/[id]/page.tsx` |
| Image Upload (Base64) | Done | `src/components/admin/ImageUpload.tsx` |
| Admin Products Filter (isActive) | Done | `src/app/api/admin/products/route.ts` |
| Dynamic Rendering (Guest Pages) | Done | `force-dynamic` on tours/rooms pages |
| EN Name First on Tour Cards | Done | `src/components/products/TourCard.tsx` |
| Navbar Map Link | Done | `src/components/shared/Navbar.tsx` |
| Homepage Map Section | Done | `src/app/(guest)/HomeMapSection.tsx` |
| Tour Meeting Point Map | Done | `src/app/(guest)/tours/[id]/TourMeetingPointSection.tsx` |

### Phase 7: v1.4.0 - Explore Yaowarat - COMPLETED

| Task | Status | Files |
|------|--------|-------|
| Explore Page (Guest) | Done | `src/app/(guest)/explore/page.tsx`, `ExploreContent.tsx` |
| Explore Map Component | Done | `src/components/maps/ExploreMap.tsx` |
| Explore Data (Static) | Done | `src/lib/constants/explore-places.ts` |
| ExplorePlace DB Model | Done | `prisma/schema.prisma` (ExplorePlace + ExplorePlaceType) |
| Admin Explore CRUD | Done | `src/app/admin/explore/page.tsx` |
| Admin API (CRUD) | Done | `src/app/api/admin/explore-places/route.ts`, `[id]/route.ts` |
| Public API | Done | `src/app/api/explore-places/route.ts` |
| Navbar "สำรวจ" Menu | Done | `src/components/shared/Navbar.tsx` |
| Admin Sidebar "สถานที่สำรวจ" | Done | `src/components/admin/AdminSidebar.tsx` |
| Image Gallery (5 per card) | Done | Auto-cycle on hover like TourCard |
| Horizontal Carousel Layout | Done | LINE-style swipe cards grouped by category |
| Seed Script | Done | `scripts/seed-explore-places.ts` (21 places) |

---

## Recent Updates

### v1.4.0 (March 2026)

#### New Features
| Feature | Description |
|---------|-------------|
| Explore Yaowarat Page | หน้าสำรวจสถานที่ท่องเที่ยว วัด ร้านอาหาร ตลาด เทศกาล รอบเยาวราช |
| ExplorePlace DB Model | Prisma model พร้อม enum 6 ประเภท (TEMPLE, FOOD, MARKET, LANDMARK, MUSEUM, EVENT) |
| Admin Explore CRUD | Admin เพิ่ม/แก้ไข/ลบสถานที่ได้จาก `/admin/explore` พร้อมอัปโหลดรูป |
| Horizontal Carousel | แสดงการ์ดเลื่อนซ้าย-ขวาแบบ LINE card message แบ่งตามหมวด |
| Image Auto-Cycle | แต่ละการ์ดมี 5 รูป สลับอัตโนมัติเมื่อ hover (เหมือน TourCard) |
| Interactive Map | Leaflet map แสดง markers สีตามประเภท + วงกลมรัศมี 2.5km |
| Google Maps Navigation | ปุ่ม "นำทาง" เปิด Google Maps directions |
| DB + Static Fallback | ดึงข้อมูลจาก DB ก่อน ถ้าไม่มีจะ fallback ใช้ static data |

### v1.1.0 (January 2026)

#### Bug Fixes
| Issue | Fix | Status |
|-------|-----|--------|
| Invalid product type returns 500 | Added type validation in `/api/products` | Fixed |
| OAuth providers crash without credentials | Made providers conditional in `auth.ts` | Fixed |
| Duplicate products in database | Created cleanup script, removed 22 duplicates | Fixed |

#### Authentication Updates
| Provider | Status | Notes |
|----------|--------|-------|
| Email/Password | Working | Test account: test@test.com / admin123 |
| Google OAuth | Working | Testing mode - requires test user |
| LINE OAuth | Pending | Button removed from login page |

### v1.2.0 (March 2026)

#### New Features
| Feature | Description |
|---------|-------------|
| AI Chat Widget | Claude-powered chatbot สำหรับ guest ถามข้อมูลโรงแรม/ทัวร์ |
| Maps (Free) | Leaflet + OpenStreetMap แทน Google Maps (ไม่เสียค่า API) |
| Category System | Admin สามารถสร้างและจัดการหมวดหมู่สินค้าได้ |
| Image Upload | Admin อัปโหลดรูปสินค้าได้ (base64, resize client-side max 800px) |
| Product Edit Page | หน้าแก้ไขสินค้าแยกต่างหาก (`/admin/products/[id]`) |
| Location Page | หน้าแผนที่แสดงที่ตั้งโรงแรม + สถานที่ใกล้เคียง |

#### Bug Fixes
| Issue | Fix | Status |
|-------|-----|--------|
| Admin showing deleted (inactive) products | Added `isActive: true` filter to admin GET API | Fixed |
| Guest pages not showing uploaded images | Added `force-dynamic` to tours/rooms pages | Fixed |
| Tour card showing Thai name first | Changed to show EN name first, TH name second | Fixed |

---

## API Endpoints

### Public APIs
| Method | Endpoint | Status | Description |
|--------|----------|--------|-------------|
| GET | `/api/products` | Done | List all products |
| GET | `/api/products?type=ROOM` | Done | List rooms only |
| GET | `/api/products?type=TOUR` | Done | List tours only |
| GET | `/api/products?type=SERVICE` | Done | List services only |
| GET | `/api/products/[id]` | Done | Product detail |
| GET | `/api/categories` | Done | List active categories |
| GET | `/api/affiliates/track?ref=CODE` | Done | Track referral click |
| POST | `/api/chat` | Done | AI chat (Claude API) |
| GET | `/api/explore-places` | Done | List active explore places |

### Protected APIs (Authenticated)
| Method | Endpoint | Status | Description |
|--------|----------|--------|-------------|
| POST | `/api/bookings` | Done | Create booking |
| GET | `/api/bookings/my` | Done | User's bookings |
| GET | `/api/agent/me` | Done | Agent info |
| POST | `/api/agent/bank` | Done | Update bank info |
| POST | `/api/agent/withdraw` | Done | Request withdrawal |
| POST | `/api/payment/promptpay` | Done | Generate QR code |

### Admin APIs
| Method | Endpoint | Status | Description |
|--------|----------|--------|-------------|
| GET | `/api/admin/dashboard` | Done | Dashboard stats |
| GET | `/api/admin/bookings` | Done | All bookings |
| PATCH | `/api/admin/bookings/[id]` | Done | Update status |
| GET/POST | `/api/admin/products` | Done | Product CRUD |
| PATCH/DELETE | `/api/admin/products/[id]` | Done | Product CRUD |
| GET/POST | `/api/admin/coupons` | Done | Coupon CRUD |
| PATCH/DELETE | `/api/admin/coupons/[id]` | Done | Coupon CRUD |
| GET | `/api/admin/affiliates` | Done | All affiliates |
| GET | `/api/admin/withdrawals` | Done | All withdrawals |
| PATCH | `/api/admin/withdrawals/[id]` | Done | Approve/Reject |
| GET/POST | `/api/admin/categories` | Done | Category CRUD |
| PUT/DELETE | `/api/admin/categories/[id]` | Done | Category CRUD |
| GET/POST | `/api/admin/explore-places` | Done | Explore Place CRUD |
| GET/PUT/DELETE | `/api/admin/explore-places/[id]` | Done | Explore Place CRUD |

---

## File Structure (Current)

```
src/
├── app/
│   ├── (auth)/
│   │   └── login/page.tsx
│   ├── (guest)/
│   │   ├── page.tsx                    # Homepage (+ Map Section)
│   │   ├── HomeMapSection.tsx          # Homepage map component
│   │   ├── location/page.tsx           # Location page with map
│   │   ├── rooms/
│   │   │   ├── page.tsx                # Room listing (force-dynamic)
│   │   │   └── [id]/page.tsx           # Room detail
│   │   ├── tours/
│   │   │   ├── page.tsx                # Tour listing (force-dynamic)
│   │   │   ├── [id]/page.tsx           # Tour detail
│   │   │   └── [id]/TourMeetingPointSection.tsx
│   │   ├── services/page.tsx           # Services listing
│   │   ├── explore/
│   │   │   ├── page.tsx                # Explore Yaowarat (server)
│   │   │   └── ExploreContent.tsx      # Carousel + cards (client)
│   │   ├── booking/
│   │   │   ├── page.tsx                # Cart/Checkout
│   │   │   └── confirmation/page.tsx
│   │   ├── payment/
│   │   │   └── [bookingId]/page.tsx    # PromptPay QR
│   │   └── my-bookings/page.tsx
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Dashboard
│   │   ├── products/
│   │   │   ├── page.tsx               # Product list + create
│   │   │   └── [id]/page.tsx          # Product edit
│   │   ├── categories/page.tsx        # Category CRUD
│   │   ├── explore/page.tsx           # Explore Place CRUD
│   │   ├── bookings/page.tsx
│   │   ├── affiliates/page.tsx
│   │   ├── withdrawals/page.tsx
│   │   └── coupons/page.tsx
│   ├── agent/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Dashboard
│   │   ├── referral/page.tsx
│   │   ├── earnings/page.tsx
│   │   └── withdraw/page.tsx
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       ├── products/
│       │   ├── route.ts
│       │   └── [id]/route.ts
│       ├── bookings/
│       │   ├── route.ts
│       │   └── my/route.ts
│       ├── payment/
│       │   └── promptpay/route.ts
│       ├── chat/route.ts              # AI Chat API (Claude)
│       ├── explore-places/route.ts    # Public explore places
│       ├── categories/route.ts        # Public categories
│       ├── affiliates/
│       │   └── track/route.ts
│       ├── agent/
│       │   ├── me/route.ts
│       │   ├── bank/route.ts
│       │   └── withdraw/route.ts
│       └── admin/
│           ├── dashboard/route.ts
│           ├── products/
│           ├── bookings/
│           ├── categories/            # Admin category CRUD
│           ├── explore-places/       # Admin explore CRUD
│           ├── coupons/
│           ├── affiliates/route.ts
│           └── withdrawals/
├── components/
│   ├── ui/                             # Shadcn UI
│   ├── shared/
│   │   ├── Navbar.tsx                  # + แผนที่ link
│   │   └── Footer.tsx
│   ├── admin/
│   │   ├── AdminSidebar.tsx
│   │   └── ImageUpload.tsx            # Image upload (base64 + resize + cover select)
│   ├── chat/                          # AI Chat widget
│   │   ├── ChatWidget.tsx
│   │   └── ChatWidgetLoader.tsx
│   ├── maps/                          # Leaflet + OpenStreetMap
│   │   ├── HotelMap.tsx
│   │   ├── ExploreMap.tsx             # Explore places map
│   │   ├── TourMeetingPointMap.tsx
│   │   └── MapProvider.tsx
│   └── products/
│       ├── RoomCard.tsx               # Mobile responsive + image count badge
│       ├── TourCard.tsx               # EN name first + hover image cycling
│       ├── ServiceCard.tsx
│       └── ImageGallery.tsx           # Gallery with thumbnails (tour/room detail)
├── hooks/
│   ├── useCart.ts                      # Zustand store
│   └── useChat.ts                     # Chat state management
├── lib/
│   ├── prisma.ts
│   ├── auth.ts                         # Conditional OAuth providers
│   ├── utils.ts
│   ├── chat/
│   │   ├── system-prompt.ts           # AI chat system prompt
│   │   └── rate-limiter.ts
│   └── constants/
│       ├── nearby-places.ts           # สถานที่ใกล้เคียง data
│       └── explore-places.ts          # Explore places static fallback
└── types/
    └── next-auth.d.ts

prisma/
├── schema.prisma                       # + Category, ExplorePlace models
├── seed.ts
└── cleanup-duplicates.ts               # Database cleanup script

scripts/
└── seed-explore-places.ts              # Seed 21 explore places to DB

TESTING/
├── TEST_REPORT.md                      # E2E test results
├── MASTER_TEST_PROMPTS.md              # Test prompts
└── ARUN_SAWAD_E2E_TEST_PROMPTS.md      # Comprehensive test cases
```

---

## Environment Variables

### Local Development (.env)
```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
PROMPTPAY_ID="0812345678"
ANTHROPIC_API_KEY="sk-ant-..."
```

### Production (Vercel)
| Variable | Status |
|----------|--------|
| DATABASE_URL | Configured |
| AUTH_SECRET | Configured |
| NEXTAUTH_URL | Configured (https://sale-cyan.vercel.app) |
| PROMPTPAY_ID | Configured |
| GOOGLE_CLIENT_ID | Configured |
| GOOGLE_CLIENT_SECRET | Configured |
| ANTHROPIC_API_KEY | Needs Configuration |
| LINE_CLIENT_ID | Pending |
| LINE_CLIENT_SECRET | Pending |

---

## Test Results (Latest)

### Summary
| Metric | Value |
|--------|-------|
| Total Tests | 52 |
| Passed | 46 |
| Failed | 0 |
| Needs Browser | 4 |
| Pass Rate | **88.5%** |

### Test Coverage
```
Guest Flow:       ████████████ 95%
Authentication:   ██████████░░ 85%
Booking System:   ███████░░░░░ 60%
Admin Panel:      ███████████░ 90%
Agent Panel:      ███████████░ 90%
API Endpoints:    ████████████ 100%
Security:         ████████████ 100%
Edge Cases:       ██████████░░ 85%
```

---

## Remaining Tasks

### High Priority
| Task | Status | Notes |
|------|--------|-------|
| LINE Login | Pending | Need LINE Developer Console setup |
| Payment Confirmation | Pending | Admin mark as PAID after transfer |
| Email Notifications | Not Started | Booking confirmation emails |
| ANTHROPIC_API_KEY on Vercel | Pending | ต้องเพิ่มใน Vercel env vars เพื่อให้ Chat ทำงาน |

### Nice to Have
| Task | Status | Notes |
|------|--------|-------|
| Facebook Login | Not Started | Low priority for Thai users |
| Stripe Integration | Not Started | PromptPay is sufficient |
| Multi-language | Not Started | Currently Thai only |
| Room Filter/Search | Not Started | Currently no search in /rooms |
| External Image Storage | Not Started | ปัจจุบันใช้ base64 (อาจช้าถ้ารูปเยอะ) |

---

## Testing Checklist

### Guest Flow
- [x] View rooms listing
- [x] View room detail
- [x] View tours listing
- [x] View tour detail
- [x] View services
- [x] Add to cart
- [x] Create booking
- [x] Generate PromptPay QR
- [x] View my bookings

### Admin Flow
- [x] View dashboard stats
- [x] CRUD products
- [x] Upload product images
- [x] Edit products (separate page)
- [x] CRUD categories
- [x] Manage bookings
- [x] Manage affiliates
- [x] Approve withdrawals
- [x] CRUD coupons

### Agent Flow
- [x] View dashboard
- [x] Get referral link
- [x] View earnings
- [x] Setup bank account
- [x] Request withdrawal

### Security
- [x] XSS Prevention
- [x] SQL Injection Prevention
- [x] Protected Routes
- [x] API Authentication

---

## Deployment Info

| Environment | URL | Auto-deploy |
|-------------|-----|-------------|
| Production | https://sale-cyan.vercel.app | Yes (from master) |
| GitHub | https://github.com/bkbp1818-blip/arun-sa-wad | - |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Jan 2025 | Initial release with all core features |
| 1.1.0 | Jan 2026 | Bug fixes, Google OAuth, database cleanup, E2E testing |
| 1.2.0 | Mar 2026 | AI Chat, Maps, Categories, Image Upload, Product Edit |
| 1.3.0 | Mar 2026 | Image Gallery, Cover Photo, Mobile Responsive |
| 1.4.0 | Mar 2026 | Explore Yaowarat, Admin CRUD, Carousel Layout |

### v1.4.0 Changes
- Added Explore Yaowarat page (`/explore`) with 21 places + 3 festivals
- Added ExplorePlace Prisma model with ExplorePlaceType enum (6 types)
- Added Admin explore management page (`/admin/explore`) with full CRUD
- Added public + admin API routes for explore places
- Added horizontal carousel layout (LINE-style swipe cards) grouped by category
- Added image auto-cycle on hover (5 images per card) matching TourCard pattern
- Added interactive Leaflet map with colored markers + 2.5km radius circle
- Added "นำทาง" button (Google Maps directions) + "โทร" button on each card
- Added "สำรวจ" menu in guest Navbar + "สถานที่สำรวจ" in Admin Sidebar
- Guest page fetches from DB with static data fallback
- Seed script for initial 21 places (`scripts/seed-explore-places.ts`)

### v1.3.0 Changes
- Added Image Gallery on tour/room detail pages (main image + thumbnail grid)
- Added "Set as cover" button on ImageUpload (admin can choose cover photo)
- Added auto-cycling images on TourCard hover with dot indicators
- Added image count badge on TourCard/RoomCard
- Added ImageGallery component (`src/components/products/ImageGallery.tsx`)
- Changed admin products list to show EN name first, TH name below
- Mobile responsive: All guest pages (reduced text sizes, stacked layouts, larger touch targets)
- Mobile responsive: All admin pages (card layout on mobile instead of tables, no horizontal scroll)
- Admin layout: fixed hamburger menu overlap, reduced padding, overflow-x prevention

### v1.2.0 Changes
- Added AI Chat Widget (Claude API) สำหรับ guest ถามข้อมูล
- Added Maps with Leaflet + OpenStreetMap (free, ไม่ต้องใช้ API key)
- Added Category system (Admin CRUD + Product categorization)
- Added Image Upload for products (base64, client-side resize)
- Added Product Edit page (`/admin/products/[id]`)
- Added Location page with nearby places map
- Added Homepage map section + Tour meeting point map
- Fixed admin products API to filter inactive products
- Fixed guest pages caching (force-dynamic rendering)
- Changed TourCard to display EN name before TH name
- Added Navbar link to แผนที่ page
- Updated Prisma schema: Category model, new Product fields (categoryId, availableFrom, availableTo)

### v1.1.0 Changes
- Fixed product type validation (400 instead of 500)
- Made OAuth providers conditional
- Removed LINE login button (pending setup)
- Cleaned up 22 duplicate products
- Added comprehensive E2E test suite
- Updated NEXTAUTH_URL for production

---

*Last Updated: March 19, 2026 (v1.4.0)*
