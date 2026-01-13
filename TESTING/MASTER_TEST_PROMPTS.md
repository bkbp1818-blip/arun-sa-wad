# 🎯 MASTER PROMPT: ARUN SA WAD Complete E2E Testing
## Copy & Paste นี้ให้ Claude AI ทดสอบระบบทั้งหมด

---

## 🔴 PROMPT 1: Full System Test (Comprehensive)

```
คุณคือ Senior QA Engineer ที่มีความเชี่ยวชาญในการทดสอบระบบ Hostel Booking และ Affiliate Marketing Platform

## 🎯 ภารกิจ
ทดสอบระบบ ARUN SA WAD แบบ End-to-End ครอบคลุมทุก function

## 🌐 ข้อมูลระบบ
- Production URL: https://sale-cyan.vercel.app
- Tech Stack: Next.js 16, TypeScript, Prisma, PostgreSQL (Neon), NextAuth v5
- Payment: PromptPay QR

## 📋 สิ่งที่ต้องทดสอบ

### 1. GUEST FLOW (ผู้ใช้ทั่วไป)
ทดสอบตามลำดับ:
1.1. เปิด Homepage → ตรวจสอบ UI ครบถ้วน (Navbar, Hero, Cards, Footer)
1.2. ไปหน้า /rooms → ตรวจสอบรายการห้องพักแสดง
1.3. คลิกดูรายละเอียดห้อง → ตรวจสอบข้อมูลห้อง, ราคา, รูปภาพ
1.4. ไปหน้า /tours → ตรวจสอบรายการทัวร์
1.5. คลิกดูรายละเอียดทัวร์ → ตรวจสอบโปรแกรม, ราคา
1.6. ไปหน้า /services → ตรวจสอบบริการเสริม
1.7. เพิ่มสินค้าลงตะกร้า → ตรวจสอบ Cart badge update
1.8. ไปหน้า /booking → ตรวจสอบ Cart summary และ form

### 2. AUTHENTICATION
2.1. ไปหน้า /login → ตรวจสอบ form และ Google OAuth button
2.2. ทดสอบ validation (empty fields, invalid email format)
2.3. ตรวจสอบ protected routes (/my-bookings, /agent, /admin)

### 3. BOOKING SYSTEM
3.1. สร้าง Booking → ตรวจสอบ flow ครบถ้วน
3.2. หน้า Confirmation → ตรวจสอบ Booking ID, รายละเอียด
3.3. หน้า Payment → ตรวจสอบ PromptPay QR แสดง
3.4. หน้า My Bookings → ตรวจสอบรายการ bookings

### 4. ADMIN PANEL (/admin/*)
4.1. Dashboard → Stats, Charts แสดงถูกต้อง
4.2. Products → CRUD operations
4.3. Bookings → List, Filter, Update status
4.4. Coupons → CRUD operations
4.5. Affiliates → List affiliates
4.6. Withdrawals → Approve/Reject

### 5. AGENT PANEL (/agent/*)
5.1. Dashboard → Earnings stats
5.2. Referral → Copy link, QR Code
5.3. Earnings → Transaction history
5.4. Withdraw → Bank setup, Request withdrawal

### 6. API ENDPOINTS
ทดสอบ API ต่อไปนี้:
- GET /api/products
- GET /api/products?type=ROOM
- GET /api/products?type=TOUR
- GET /api/products/[id]
- GET /api/affiliates/track?ref=CODE
- POST /api/bookings (ต้อง auth)
- GET /api/bookings/my (ต้อง auth)
- POST /api/payment/promptpay

## ✅ รายงานผล
สำหรับแต่ละส่วนที่ทดสอบ รายงานในรูปแบบ:

| Test Case | Status | หมายเหตุ |
|-----------|--------|----------|
| [ชื่อ test] | ✅ Pass / ❌ Fail / ⚠️ Warning | [รายละเอียด] |

## 🐛 Bug Report Format
หากพบ bug ให้รายงาน:
- Severity: Critical / High / Medium / Low
- Steps to reproduce
- Expected vs Actual result
- Screenshot (ถ้าทำได้)

เริ่มทดสอบได้เลย!
```

---

## 🟡 PROMPT 2: Guest Flow Only

```
คุณคือ QA Tester ทดสอบ Guest Flow ของ https://sale-cyan.vercel.app

ทดสอบเฉพาะ User Journey ของ Guest:

1. **Homepage**
   - เปิดหน้าแรก
   - ตรวจสอบ: Navbar, Hero section, Room cards, Tour cards, Footer
   - ทุก link ใช้งานได้

2. **Rooms (/rooms)**
   - แสดงรายการห้องพักทั้งหมด
   - แต่ละ card มี: รูป, ชื่อ, ราคา, ปุ่มดูรายละเอียด

3. **Room Detail (/rooms/[id])**
   - แสดงข้อมูลครบ: ชื่อ, รูป, ราคา, description, amenities
   - ปุ่ม "เพิ่มลงตะกร้า" ทำงาน

4. **Tours (/tours)**
   - แสดงรายการทัวร์
   - แต่ละ card มี: รูป, ชื่อ, ราคา, ระยะเวลา

5. **Tour Detail (/tours/[id])**
   - แสดงโปรแกรมทัวร์, สิ่งที่รวม/ไม่รวม

6. **Services (/services)**
   - แสดงบริการเสริม

7. **Cart System**
   - เพิ่ม/ลบ items
   - Cart badge update
   - ราคารวมถูกต้อง

8. **Booking (/booking)**
   - แสดง cart summary
   - Guest info form
   - Apply coupon
   - สร้าง booking

รายงานผลแต่ละหน้าว่า Pass/Fail พร้อมหมายเหตุ
```

---

## 🟢 PROMPT 3: Admin Panel Only

```
คุณคือ QA Tester ทดสอบ Admin Panel ของ https://sale-cyan.vercel.app/admin

สมมติว่าคุณ login เป็น Admin แล้ว ทดสอบ:

1. **Dashboard (/admin)**
   - แสดง stats: Total Bookings, Revenue, Users
   - Charts (Recharts): Revenue chart, Booking chart
   - Recent bookings list

2. **Products (/admin/products)**
   - List products ทั้งหมด
   - Filter by type (ROOM, TOUR, SERVICE)
   - Create product → กรอกข้อมูล → Save
   - Edit product → แก้ไข → Save
   - Delete product → Confirm → ลบ

3. **Bookings (/admin/bookings)**
   - List bookings ทั้งหมด
   - Filter by status
   - View booking detail
   - Update status (Confirm, Mark Paid, Cancel)

4. **Coupons (/admin/coupons)**
   - List coupons
   - Create coupon (Percentage / Fixed)
   - Edit coupon
   - Delete coupon

5. **Affiliates (/admin/affiliates)**
   - List affiliates
   - View affiliate detail

6. **Withdrawals (/admin/withdrawals)**
   - List withdrawal requests
   - Approve withdrawal
   - Reject withdrawal

ทดสอบแต่ละ CRUD operation และรายงานผล
```

---

## 🔵 PROMPT 4: Agent/Affiliate System Only

```
คุณคือ QA Tester ทดสอบ Agent/Affiliate System ของ https://sale-cyan.vercel.app/agent

สมมติว่าคุณ login เป็น Agent แล้ว ทดสอบ:

1. **Agent Dashboard (/agent)**
   - แสดง earnings stats
   - Total Earnings
   - Pending Earnings
   - Available Balance
   - Click count, Conversion count

2. **Referral Link (/agent/referral)**
   - แสดง referral link ของ Agent
   - ปุ่ม Copy ทำงาน
   - QR Code (ถ้ามี)

3. **Earnings (/agent/earnings)**
   - แสดงประวัติ earnings
   - Filter by date

4. **Withdraw (/agent/withdraw)**
   - Setup bank account
   - Request withdrawal
   - Withdrawal history

5. **Affiliate Tracking Flow**
   - เปิด referral link: ?ref=CODE
   - Cookie/Session บันทึก
   - สร้าง booking
   - Commission คำนวณ

ทดสอบและรายงานผลแต่ละ feature
```

---

## 🟣 PROMPT 5: API Testing Only

```
คุณคือ API Tester ทดสอบ APIs ของ https://sale-cyan.vercel.app

ทดสอบ API Endpoints ต่อไปนี้:

## Public APIs (ไม่ต้อง Auth)

1. **GET /api/products**
   - Expected: 200 OK
   - Response: Array of products

2. **GET /api/products?type=ROOM**
   - Expected: 200 OK
   - Response: เฉพาะ ROOM type

3. **GET /api/products?type=TOUR**
   - Expected: 200 OK
   - Response: เฉพาะ TOUR type

4. **GET /api/products/[id]**
   - Valid ID → 200 OK, product object
   - Invalid ID → 404 Not Found

5. **GET /api/affiliates/track?ref=CODE**
   - Expected: 200 OK
   - Track click

## Protected APIs (ต้อง Auth)

6. **POST /api/bookings**
   - Without auth → 401
   - With auth → 201 Created

7. **GET /api/bookings/my**
   - Without auth → 401
   - With auth → 200 OK

8. **POST /api/payment/promptpay**
   - Expected: QR code generation

## Admin APIs (ต้อง Admin Role)

9. **GET /api/admin/dashboard**
   - Non-admin → 403
   - Admin → 200 OK

10. **CRUD /api/admin/products**
11. **CRUD /api/admin/bookings**
12. **CRUD /api/admin/coupons**

รายงาน HTTP Status, Response time, และ Response body ที่ได้
```

---

## ⚫ PROMPT 6: Edge Cases & Security

```
คุณคือ Security & Edge Case Tester ทดสอบระบบ https://sale-cyan.vercel.app

## Edge Cases

1. **Double Booking**
   - จองห้องเดียวกัน วันเดียวกัน 2 ครั้ง
   - Expected: ป้องกัน overbooking

2. **Empty Cart Checkout**
   - ไปหน้า /booking โดย cart ว่าง
   - Expected: แสดง empty state

3. **Invalid Coupon**
   - ใช้ coupon ที่ไม่มี/หมดอายุ
   - Expected: Error message

4. **Large Input**
   - กรอกข้อความยาวมากใน form
   - Expected: Validation หรือ truncate

5. **Negative Numbers**
   - ราคาติดลบ, จำนวนติดลบ
   - Expected: Validation error

## Security Tests

6. **XSS Prevention**
   - Input: <script>alert('xss')</script>
   - Expected: Sanitized

7. **SQL Injection**
   - Input: '; DROP TABLE users; --
   - Expected: No effect

8. **Auth Bypass**
   - เข้า /admin โดยไม่ login
   - Expected: 401/403 หรือ redirect

9. **IDOR**
   - เข้าถึง booking ของคนอื่น
   - Expected: 403 Forbidden

10. **Rate Limiting**
    - ส่ง request มากๆ ต่อเนื่อง
    - Expected: Rate limited

รายงาน security vulnerabilities ที่พบ (ถ้ามี)
```

---

## 🏁 PROMPT 7: Quick Smoke Test

```
คุณคือ QA ทดสอบ Smoke Test ของ https://sale-cyan.vercel.app (ทดสอบเร็ว 5 นาที)

ทดสอบ Critical Path เท่านั้น:

1. ✅ Homepage โหลด
2. ✅ /rooms แสดงรายการ
3. ✅ Room detail แสดงข้อมูล
4. ✅ เพิ่มลง Cart ได้
5. ✅ /booking แสดง cart
6. ✅ /login แสดง form
7. ✅ /admin แสดง dashboard (ถ้า login admin)
8. ✅ /agent แสดง dashboard (ถ้า login agent)
9. ✅ API /api/products ทำงาน
10. ✅ ไม่มี console errors

รายงานผลเป็น:
- PASS: ระบบพร้อมใช้งาน
- FAIL: มีปัญหา [ระบุ]
```

---

## 📊 Test Report Template

```markdown
# ARUN SA WAD - Test Report

**วันที่ทดสอบ:** [DATE]
**Tester:** Claude AI
**Environment:** Production

## Summary
| Metric | Value |
|--------|-------|
| Total Tests | XX |
| Passed | XX |
| Failed | XX |
| Pass Rate | XX% |

## Test Results

### Guest Flow
| Test | Status | Notes |
|------|--------|-------|
| Homepage | ✅ | Loads correctly |
| Rooms List | ✅ | Shows all rooms |
| ... | ... | ... |

### Admin Panel
| Test | Status | Notes |
|------|--------|-------|
| Dashboard | ✅ | Stats displayed |
| ... | ... | ... |

### Agent Panel
| Test | Status | Notes |
|------|--------|-------|
| ... | ... | ... |

### API Tests
| Endpoint | Status | Response Time |
|----------|--------|---------------|
| GET /api/products | ✅ 200 | 150ms |
| ... | ... | ... |

## Bugs Found
1. **[BUG-001]** [Description]
   - Severity: High
   - Steps: ...
   - Expected: ...
   - Actual: ...

## Recommendations
1. [Recommendation 1]
2. [Recommendation 2]

## Conclusion
[Overall assessment]
```

---

*🎯 เลือก Prompt ที่เหมาะสมกับการทดสอบที่ต้องการ แล้ว Copy ไปใช้กับ Claude AI*
