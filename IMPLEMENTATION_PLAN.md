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
| Vercel | - | Hosting & Deployment |

---

## Implementation Status

### Phase 1: Foundation - COMPLETED

| Task | Status | Files |
|------|--------|-------|
| Initialize Next.js project | Done | `package.json`, `next.config.ts` |
| Setup Prisma + PostgreSQL | Done | `prisma/schema.prisma` |
| NextAuth with Credentials | Done | `src/lib/auth.ts` |
| Google OAuth | Done | Vercel env vars configured |
| LINE OAuth | Pending | Need LINE Developer Console setup |
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

---

## API Endpoints

### Public APIs
| Method | Endpoint | Status | Description |
|--------|----------|--------|-------------|
| GET | `/api/products` | Done | List all products |
| GET | `/api/products?type=ROOM` | Done | List rooms only |
| GET | `/api/products?type=TOUR` | Done | List tours only |
| GET | `/api/products/[id]` | Done | Product detail |
| GET | `/api/affiliates/track?ref=CODE` | Done | Track referral click |

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

---

## File Structure (Current)

```
src/
├── app/
│   ├── (auth)/
│   │   └── login/page.tsx
│   ├── (guest)/
│   │   ├── page.tsx                    # Homepage
│   │   ├── rooms/
│   │   │   ├── page.tsx                # Room listing
│   │   │   └── [id]/page.tsx           # Room detail
│   │   ├── tours/
│   │   │   ├── page.tsx                # Tour listing
│   │   │   └── [id]/page.tsx           # Tour detail
│   │   ├── services/page.tsx           # Services listing
│   │   ├── booking/
│   │   │   ├── page.tsx                # Cart/Checkout
│   │   │   └── confirmation/page.tsx
│   │   ├── payment/
│   │   │   └── [bookingId]/page.tsx    # PromptPay QR
│   │   └── my-bookings/page.tsx
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Dashboard
│   │   ├── products/page.tsx
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
│           ├── coupons/
│           ├── affiliates/route.ts
│           └── withdrawals/
├── components/
│   ├── ui/                             # Shadcn UI
│   ├── shared/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── admin/
│   │   └── AdminSidebar.tsx
│   └── products/
│       ├── RoomCard.tsx
│       ├── TourCard.tsx
│       └── ServiceCard.tsx
├── hooks/
│   └── useCart.ts                      # Zustand store
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   └── utils.ts
└── types/
    └── next-auth.d.ts
```

---

## Environment Variables

### Local Development (.env)
```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
PROMPTPAY_ID="0812345678"
```

### Production (Vercel)
| Variable | Status |
|----------|--------|
| DATABASE_URL | Configured |
| AUTH_SECRET | Configured |
| NEXTAUTH_URL | Configured |
| PROMPTPAY_ID | Configured |
| GOOGLE_CLIENT_ID | Configured |
| GOOGLE_CLIENT_SECRET | Configured |
| LINE_CLIENT_ID | Pending |
| LINE_CLIENT_SECRET | Pending |

---

## Remaining Tasks

### High Priority
| Task | Status | Notes |
|------|--------|-------|
| LINE Login | Pending | Need LINE Developer Console setup |
| Payment Confirmation | Pending | Admin mark as PAID after transfer |
| Email Notifications | Not Started | Booking confirmation emails |

### Nice to Have
| Task | Status | Notes |
|------|--------|-------|
| AI Chatbot | Not Started | Optional feature |
| Facebook Login | Not Started | Low priority for Thai users |
| Stripe Integration | Not Started | PromptPay is sufficient |
| Multi-language | Not Started | Currently Thai only |

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

---

## Deployment Info

| Environment | URL | Auto-deploy |
|-------------|-----|-------------|
| Production | https://sale-cyan.vercel.app | Yes (from main) |
| GitHub | https://github.com/bkbp1818-blip/arun-sa-wad | - |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Jan 2025 | Initial release with all core features |

---

*Last Updated: January 2025*
