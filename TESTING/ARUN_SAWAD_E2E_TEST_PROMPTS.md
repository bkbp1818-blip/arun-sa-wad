# ARUN SA WAD - Comprehensive E2E Test Prompts
## สำหรับ Claude AI ทดสอบระบบ Hostel Booking + Affiliate Platform

**Production URL:** https://sale-cyan.vercel.app  
**Test Date:** January 2025

---

## 📋 สารบัญ

1. [Guest Flow Tests](#1-guest-flow-tests)
2. [Authentication Tests](#2-authentication-tests)
3. [Booking & Cart Tests](#3-booking--cart-tests)
4. [Payment Tests](#4-payment-tests)
5. [Admin Panel Tests](#5-admin-panel-tests)
6. [Agent/Affiliate Tests](#6-agentaffiliate-tests)
7. [API Endpoint Tests](#7-api-endpoint-tests)
8. [Edge Cases & Error Handling](#8-edge-cases--error-handling)
9. [Performance & Security Tests](#9-performance--security-tests)

---

## 1. Guest Flow Tests

### 1.1 Homepage Testing

```
PROMPT สำหรับ Claude AI:

คุณคือ QA Tester ที่ต้องทดสอบ Homepage ของ https://sale-cyan.vercel.app

ทดสอบ:
1. เปิดหน้า Homepage - ตรวจสอบว่า load สำเร็จหรือไม่
2. ตรวจสอบ UI Components:
   - Navbar แสดงถูกต้อง (Logo, Menu items, Login button)
   - Hero Section แสดงภาพและข้อความ
   - Room Cards แสดงรายการห้องพัก
   - Tour Cards แสดงรายการทัวร์
   - Footer แสดงข้อมูลติดต่อ
3. ตรวจสอบ Responsive Design:
   - Desktop (1920x1080)
   - Tablet (768x1024)
   - Mobile (375x667)
4. ตรวจสอบ Links ทั้งหมดว่าไปยังหน้าที่ถูกต้อง

Expected Results:
- หน้าเว็บ load ภายใน 3 วินาที
- ไม่มี console errors
- ทุก link ใช้งานได้
- UI แสดงถูกต้องทุก breakpoint
```

### 1.2 Room Listing Testing

```
PROMPT สำหรับ Claude AI:

ทดสอบหน้า Rooms Listing ที่ /rooms

Test Cases:

TC-ROOM-001: แสดงรายการห้องพักทั้งหมด
- เปิด https://sale-cyan.vercel.app/rooms
- ตรวจสอบว่ามี Room Cards แสดง
- แต่ละ Card ต้องมี: รูปภาพ, ชื่อห้อง, ราคา, ปุ่ม "ดูรายละเอียด"

TC-ROOM-002: Filter ห้องพัก (ถ้ามี)
- ทดสอบ Filter by ประเภทห้อง
- ทดสอบ Sort by ราคา
- ตรวจสอบผลลัพธ์ถูกต้อง

TC-ROOM-003: Pagination (ถ้ามี)
- ถ้ามีห้องมากกว่า 10 ห้อง ต้องมี pagination
- ทดสอบเปลี่ยนหน้า

TC-ROOM-004: Empty State
- ถ้าไม่มีห้อง ต้องแสดงข้อความ "ไม่พบห้องพัก"

TC-ROOM-005: Loading State
- ระหว่าง fetch data ต้องแสดง loading indicator

Expected API Call:
GET /api/products?type=ROOM
Response: Array of room objects with id, name, price, images, description
```

### 1.3 Room Detail Testing

```
PROMPT สำหรับ Claude AI:

ทดสอบหน้า Room Detail ที่ /rooms/[id]

Test Cases:

TC-ROOMDETAIL-001: แสดงข้อมูลห้องถูกต้อง
- เปิดหน้า Room Detail ของห้องใดห้องหนึ่ง
- ตรวจสอบ:
  * ชื่อห้อง
  * รูปภาพ (Gallery/Carousel)
  * ราคาต่อคืน
  * รายละเอียด/Description
  * สิ่งอำนวยความสะดวก (Amenities)
  * ปุ่ม "เพิ่มลงตะกร้า" หรือ "จองเลย"

TC-ROOMDETAIL-002: เลือกวันเข้าพัก
- มี Date Picker สำหรับเลือก Check-in / Check-out
- ไม่สามารถเลือกวันในอดีตได้
- Check-out ต้องหลัง Check-in

TC-ROOMDETAIL-003: เลือกจำนวนคืน
- คำนวณราคารวมถูกต้อง (ราคา x จำนวนคืน)

TC-ROOMDETAIL-004: Add to Cart
- กดปุ่ม "เพิ่มลงตะกร้า"
- ตรวจสอบว่า item ถูกเพิ่มใน Cart (Badge ที่ Navbar)
- ตรวจสอบ Zustand state update

TC-ROOMDETAIL-005: Room Not Found
- เปิด /rooms/invalid-id
- ต้องแสดง 404 หรือ "ไม่พบห้องพัก"

Expected API Call:
GET /api/products/[id]
Response: Single room object with full details
```

### 1.4 Tour Listing & Detail Testing

```
PROMPT สำหรับ Claude AI:

ทดสอบหน้า Tours ที่ /tours และ /tours/[id]

Test Cases:

TC-TOUR-001: แสดงรายการทัวร์ทั้งหมด
- เปิด https://sale-cyan.vercel.app/tours
- ตรวจสอบ Tour Cards แสดงถูกต้อง
- แต่ละ Card: รูป, ชื่อทัวร์, ราคา, ระยะเวลา

TC-TOUR-002: Tour Detail Page
- เปิดหน้ารายละเอียดทัวร์
- ตรวจสอบ:
  * ชื่อทัวร์
  * รูปภาพ
  * ราคาต่อคน
  * ระยะเวลา (เช่น 3 ชั่วโมง, ครึ่งวัน)
  * รายละเอียดโปรแกรม
  * สิ่งที่รวม/ไม่รวม
  * จุดนัดพบ

TC-TOUR-003: เลือกวันที่ทัวร์
- Date Picker สำหรับเลือกวันทัวร์
- ไม่สามารถเลือกวันในอดีตได้

TC-TOUR-004: เลือกจำนวนคน
- Input สำหรับจำนวนผู้เข้าร่วม
- คำนวณราคารวม (ราคา x จำนวนคน)
- มี minimum/maximum ผู้เข้าร่วม (ถ้ากำหนด)

TC-TOUR-005: Add Tour to Cart
- เพิ่มทัวร์ลงตะกร้า
- ตรวจสอบ Cart state

Expected API:
GET /api/products?type=TOUR
GET /api/products/[id]
```

### 1.5 Services Page Testing

```
PROMPT สำหรับ Claude AI:

ทดสอบหน้า Services ที่ /services

Test Cases:

TC-SERVICE-001: แสดงบริการเสริมทั้งหมด
- เปิด https://sale-cyan.vercel.app/services
- ตรวจสอบรายการบริการ เช่น:
  * Airport Transfer
  * Laundry
  * Motorbike Rental
  * Massage/Spa
  * Food Delivery

TC-SERVICE-002: Service Card Components
- แต่ละ Service Card มี:
  * รูปภาพ
  * ชื่อบริการ
  * ราคา
  * คำอธิบายสั้น
  * ปุ่ม "จองบริการ" หรือ "เพิ่มลงตะกร้า"

TC-SERVICE-003: Add Service to Cart
- เพิ่มบริการลงตะกร้า
- ตรวจสอบ Cart update

Expected API:
GET /api/products?type=SERVICE
```

---

## 2. Authentication Tests

### 2.1 Login Testing

```
PROMPT สำหรับ Claude AI:

ทดสอบระบบ Login ที่ /login

Test Cases:

TC-AUTH-001: หน้า Login แสดงถูกต้อง
- เปิด https://sale-cyan.vercel.app/login
- ตรวจสอบ UI:
  * Form Email/Password
  * ปุ่ม "เข้าสู่ระบบ"
  * ปุ่ม "Login with Google"
  * Link "สมัครสมาชิก" (ถ้ามี)
  * Link "ลืมรหัสผ่าน" (ถ้ามี)

TC-AUTH-002: Login ด้วย Email/Password - สำเร็จ
- กรอก Email/Password ที่ถูกต้อง
- กด Login
- ตรวจสอบ redirect ไปหน้า Home หรือ Dashboard
- ตรวจสอบ session/cookie ถูกสร้าง
- Navbar แสดงชื่อผู้ใช้

TC-AUTH-003: Login - Email ผิด
- กรอก Email ที่ไม่มีในระบบ
- ต้องแสดง error "Email หรือ Password ไม่ถูกต้อง"

TC-AUTH-004: Login - Password ผิด
- กรอก Email ถูก แต่ Password ผิด
- ต้องแสดง error message

TC-AUTH-005: Login - ช่องว่าง
- กด Login โดยไม่กรอกข้อมูล
- ต้องแสดง validation error "กรุณากรอก Email"

TC-AUTH-006: Login - Email format ผิด
- กรอก Email format ผิด เช่น "test@"
- ต้องแสดง error "รูปแบบ Email ไม่ถูกต้อง"

TC-AUTH-007: Google OAuth Login
- กดปุ่ม "Login with Google"
- ตรวจสอบ redirect ไป Google OAuth
- เลือก Google Account
- ตรวจสอบ callback กลับมา login สำเร็จ

TC-AUTH-008: Protected Route - ไม่ได้ Login
- เปิด /my-bookings โดยไม่ได้ login
- ต้อง redirect ไปหน้า /login

TC-AUTH-009: Logout
- กดปุ่ม Logout
- ตรวจสอบ session ถูกลบ
- Redirect ไปหน้า Home
- Navbar แสดงปุ่ม Login

Expected API:
POST /api/auth/callback/credentials
POST /api/auth/callback/google
POST /api/auth/signout
```

### 2.2 Session & Authorization Testing

```
PROMPT สำหรับ Claude AI:

ทดสอบ Session และ Authorization

Test Cases:

TC-SESSION-001: Session Persistence
- Login สำเร็จ
- ปิด Browser แล้วเปิดใหม่
- ตรวจสอบยังคง Login อยู่ (Session persist)

TC-SESSION-002: Session Expiry
- ตรวจสอบ session timeout (ถ้ามีกำหนด)
- หลัง timeout ต้อง redirect ไป login

TC-AUTHZ-001: User Role - Guest
- Login ด้วย user ทั่วไป
- ไม่สามารถเข้า /admin/* ได้
- ไม่สามารถเข้า /agent/* ได้ (ถ้าไม่ใช่ Agent)

TC-AUTHZ-002: User Role - Admin
- Login ด้วย Admin account
- สามารถเข้า /admin/* ได้
- ตรวจสอบ Admin sidebar แสดง

TC-AUTHZ-003: User Role - Agent
- Login ด้วย Agent account
- สามารถเข้า /agent/* ได้
- ตรวจสอบ Agent dashboard แสดง

TC-AUTHZ-004: Unauthorized Access
- User ทั่วไปพยายามเข้า /admin/bookings
- ต้องแสดง 403 หรือ redirect ไป Home
```

---

## 3. Booking & Cart Tests

### 3.1 Cart System Testing (Zustand)

```
PROMPT สำหรับ Claude AI:

ทดสอบระบบ Cart ที่ใช้ Zustand State Management

Test Cases:

TC-CART-001: Add Item to Cart
- เพิ่มห้องพักลงตะกร้า
- ตรวจสอบ:
  * Cart badge แสดงจำนวน item
  * Cart state ใน Zustand update
  * LocalStorage persist (ถ้ามี)

TC-CART-002: Add Multiple Items
- เพิ่มห้องพัก 1 รายการ
- เพิ่มทัวร์ 2 รายการ
- เพิ่มบริการ 1 รายการ
- ตรวจสอบ Cart แสดงทั้งหมด 4 items

TC-CART-003: View Cart
- เปิดหน้า /booking (Cart page)
- ตรวจสอบแสดงรายการทั้งหมดถูกต้อง:
  * ชื่อ item
  * รูปภาพ
  * ราคา
  * จำนวน
  * ราคารวมต่อ item
  * ราคารวมทั้งหมด

TC-CART-004: Update Quantity
- เปลี่ยนจำนวน item ใน Cart
- ตรวจสอบราคารวม update ถูกต้อง

TC-CART-005: Remove Item from Cart
- กดปุ่มลบ item
- ตรวจสอบ item หายจาก Cart
- ตรวจสอบราคารวม update

TC-CART-006: Clear Cart
- กดปุ่ม "ล้างตะกร้า" (ถ้ามี)
- ตรวจสอบ Cart ว่างเปล่า

TC-CART-007: Cart Persistence
- เพิ่ม items ลง Cart
- Refresh หน้า
- ตรวจสอบ Cart ยังคงอยู่ (localStorage)

TC-CART-008: Empty Cart State
- Cart ว่าง
- ตรวจสอบแสดงข้อความ "ตะกร้าว่างเปล่า"
- แสดง link ไปหน้า Rooms/Tours

Zustand Store ที่ต้องทดสอบ:
- useCart.ts
- State: items, total
- Actions: addItem, removeItem, updateQuantity, clearCart
```

### 3.2 Booking Creation Testing

```
PROMPT สำหรับ Claude AI:

ทดสอบการสร้าง Booking ที่ /booking

Test Cases:

TC-BOOKING-001: Booking Page Layout
- เปิดหน้า /booking
- ตรวจสอบ UI:
  * Cart Summary (รายการที่จอง)
  * Guest Information Form
  * Contact Information
  * Special Requests (textarea)
  * Coupon Code Input
  * Order Summary (ราคารวม)
  * ปุ่ม "ยืนยันการจอง"

TC-BOOKING-002: Guest Information Form
- ตรวจสอบ required fields:
  * ชื่อ-นามสกุล
  * Email
  * เบอร์โทรศัพท์
  * (ถ้ามี: จำนวนผู้เข้าพัก, หมายเหตุ)

TC-BOOKING-003: Validation - Empty Fields
- กด "ยืนยันการจอง" โดยไม่กรอกข้อมูล
- ตรวจสอบ validation errors แสดง

TC-BOOKING-004: Validation - Invalid Email
- กรอก Email format ผิด
- ตรวจสอบ error message

TC-BOOKING-005: Validation - Invalid Phone
- กรอกเบอร์โทรผิด format
- ตรวจสอบ error message

TC-BOOKING-006: Apply Coupon - Valid
- กรอก Coupon code ที่ valid
- กดปุ่ม "ใช้คูปอง"
- ตรวจสอบส่วนลดแสดงถูกต้อง
- ราคารวมหลังส่วนลดถูกต้อง

TC-BOOKING-007: Apply Coupon - Invalid
- กรอก Coupon code ที่ไม่มีอยู่
- ตรวจสอบ error "ไม่พบคูปองนี้"

TC-BOOKING-008: Apply Coupon - Expired
- กรอก Coupon code ที่หมดอายุ
- ตรวจสอบ error "คูปองหมดอายุแล้ว"

TC-BOOKING-009: Create Booking - Success
- กรอกข้อมูลครบถ้วน
- กด "ยืนยันการจอง"
- ตรวจสอบ:
  * API POST /api/bookings ถูกเรียก
  * Redirect ไปหน้า Confirmation
  * Cart ถูก clear

TC-BOOKING-010: Create Booking - Guest (ไม่ได้ Login)
- ไม่ได้ Login แต่สร้าง Booking
- ตรวจสอบว่า redirect ไป login หรือสามารถจองได้เลย

TC-BOOKING-011: Affiliate Tracking
- เข้าเว็บผ่าน referral link ?ref=AGENT123
- สร้าง Booking
- ตรวจสอบ Booking มี affiliateCode ถูกต้อง

Expected API:
POST /api/bookings
Request Body: {
  items: [...],
  guestInfo: { name, email, phone },
  couponCode: "DISCOUNT10",
  affiliateCode: "AGENT123"
}
Response: { bookingId, status: "PENDING" }
```

### 3.3 Booking Confirmation Testing

```
PROMPT สำหรับ Claude AI:

ทดสอบหน้า Booking Confirmation ที่ /booking/confirmation

Test Cases:

TC-CONFIRM-001: Confirmation Page Layout
- หลังจาก Create Booking สำเร็จ
- ตรวจสอบหน้า Confirmation แสดง:
  * Booking Number/ID
  * รายละเอียดการจอง
  * ราคารวม
  * สถานะ "รอชำระเงิน"
  * ปุ่ม "ชำระเงิน" (ไปหน้า Payment)
  * ปุ่ม "ดูการจองของฉัน"

TC-CONFIRM-002: Booking Details Accuracy
- ตรวจสอบข้อมูลตรงกับที่กรอก:
  * ชื่อผู้จอง
  * รายการที่จอง
  * วันที่
  * ราคา
  * ส่วนลด (ถ้ามี)

TC-CONFIRM-003: Navigate to Payment
- กดปุ่ม "ชำระเงิน"
- Redirect ไปหน้า /payment/[bookingId]
```

---

## 4. Payment Tests

### 4.1 PromptPay QR Payment Testing

```
PROMPT สำหรับ Claude AI:

ทดสอบระบบ Payment ด้วย PromptPay QR ที่ /payment/[bookingId]

Test Cases:

TC-PAY-001: Payment Page Layout
- เปิดหน้า Payment ของ Booking
- ตรวจสอบ UI:
  * Booking Summary
  * ยอดที่ต้องชำระ
  * PromptPay QR Code
  * PromptPay ID (เบอร์โทร/เลขบัตร)
  * คำแนะนำการชำระเงิน
  * ปุ่ม "แจ้งชำระเงิน" (ถ้ามี)

TC-PAY-002: QR Code Generation
- ตรวจสอบ QR Code แสดงถูกต้อง
- Scan QR Code ด้วย Mobile Banking App
- ตรวจสอบยอดเงินตรงกับ Booking

TC-PAY-003: Amount Accuracy
- ยอดใน QR Code = ยอดรวม Booking
- ถ้ามีส่วนลด ยอดต้องเป็นราคาหลังส่วนลด

TC-PAY-004: Invalid Booking ID
- เปิด /payment/invalid-booking-id
- ตรวจสอบแสดง error หรือ 404

TC-PAY-005: Already Paid Booking
- เปิด Payment page ของ Booking ที่ชำระแล้ว
- ตรวจสอบแสดงสถานะ "ชำระเงินแล้ว"
- ไม่แสดง QR Code

TC-PAY-006: Payment Confirmation Upload (ถ้ามี)
- Upload สลิปการโอนเงิน
- กด "แจ้งชำระเงิน"
- ตรวจสอบสถานะเปลี่ยนเป็น "รอตรวจสอบ"

Expected API:
POST /api/payment/promptpay
Request: { bookingId, amount }
Response: { qrCode (base64), promptPayId }
```

### 4.2 My Bookings Testing

```
PROMPT สำหรับ Claude AI:

ทดสอบหน้า My Bookings ที่ /my-bookings

Test Cases:

TC-MYBOOKING-001: แสดงรายการ Bookings
- Login แล้วเปิด /my-bookings
- ตรวจสอบแสดงรายการ Bookings ทั้งหมดของ user

TC-MYBOOKING-002: Booking Card Information
- แต่ละ Booking แสดง:
  * Booking ID
  * วันที่จอง
  * รายการที่จอง
  * ยอดรวม
  * สถานะ (PENDING, CONFIRMED, PAID, CANCELLED)
  * Actions (ดูรายละเอียด, ชำระเงิน, ยกเลิก)

TC-MYBOOKING-003: Filter by Status
- Filter เฉพาะ Booking ที่ PENDING
- Filter เฉพาะ Booking ที่ CONFIRMED
- ตรวจสอบผลลัพธ์ถูกต้อง

TC-MYBOOKING-004: Booking Detail Modal/Page
- กดดูรายละเอียด Booking
- ตรวจสอบข้อมูลครบถ้วน

TC-MYBOOKING-005: Cancel Booking
- กดยกเลิก Booking (ถ้า status = PENDING)
- Confirm การยกเลิก
- ตรวจสอบสถานะเปลี่ยนเป็น CANCELLED

TC-MYBOOKING-006: Empty State
- User ไม่มี Booking
- ตรวจสอบแสดง "ยังไม่มีการจอง"
- Link ไปหน้า Rooms

TC-MYBOOKING-007: Unauthorized Access
- เปิด /my-bookings โดยไม่ได้ Login
- Redirect ไปหน้า Login

Expected API:
GET /api/bookings/my
Response: Array of user's bookings
```

---

## 5. Admin Panel Tests

### 5.1 Admin Dashboard Testing

```
PROMPT สำหรับ Claude AI:

ทดสอบ Admin Dashboard ที่ /admin

Test Cases:

TC-ADMIN-DASH-001: Access Control
- Login ด้วย Admin account
- เปิด /admin
- ตรวจสอบ Dashboard แสดง

TC-ADMIN-DASH-002: Dashboard Stats
- ตรวจสอบ Statistics แสดง:
  * Total Bookings
  * Total Revenue
  * Pending Bookings
  * Confirmed Bookings
  * Total Users/Guests
  * Total Affiliates

TC-ADMIN-DASH-003: Charts (Recharts)
- Revenue Chart (รายได้รายวัน/รายเดือน)
- Bookings Chart (จำนวนการจองรายวัน)
- ตรวจสอบ Chart render ถูกต้อง

TC-ADMIN-DASH-004: Recent Bookings List
- แสดง Bookings ล่าสุด 5-10 รายการ
- Quick action: View, Confirm, Cancel

TC-ADMIN-DASH-005: Admin Sidebar
- ตรวจสอบ Sidebar menu items:
  * Dashboard
  * Products
  * Bookings
  * Affiliates
  * Withdrawals
  * Coupons
- ทุก link ใช้งานได้

Expected API:
GET /api/admin/dashboard
Response: { stats, recentBookings, chartData }
```

### 5.2 Product CRUD Testing

```
PROMPT สำหรับ Claude AI:

ทดสอบ Product Management ที่ /admin/products

Test Cases:

TC-ADMIN-PROD-001: Product List
- เปิด /admin/products
- ตรวจสอบแสดงรายการ Products ทั้งหมด (Rooms, Tours, Services)
- แต่ละ row แสดง: รูป, ชื่อ, ประเภท, ราคา, สถานะ, Actions

TC-ADMIN-PROD-002: Filter Products
- Filter by type: ROOM, TOUR, SERVICE
- Search by name
- ตรวจสอบผลลัพธ์ถูกต้อง

TC-ADMIN-PROD-003: Create Product - Room
- กดปุ่ม "เพิ่ม Product"
- เลือกประเภท: ROOM
- กรอกข้อมูล:
  * ชื่อห้อง
  * คำอธิบาย
  * ราคาต่อคืน
  * จำนวนห้อง (inventory)
  * รูปภาพ (upload หรือ URL)
  * สิ่งอำนวยความสะดวก
- กด Save
- ตรวจสอบ Product ถูกสร้าง

TC-ADMIN-PROD-004: Create Product - Tour
- สร้างทัวร์ใหม่
- กรอกข้อมูลเฉพาะทัวร์: ระยะเวลา, จุดนัดพบ, โปรแกรม

TC-ADMIN-PROD-005: Create Product - Validation
- ไม่กรอกชื่อ → ต้องแสดง error
- ราคาเป็นลบ → ต้องแสดง error
- ไม่ใส่รูป → อาจใช้ default หรือ error

TC-ADMIN-PROD-006: Edit Product
- กดปุ่ม Edit ของ Product
- แก้ไขข้อมูล
- กด Save
- ตรวจสอบข้อมูล update ถูกต้อง

TC-ADMIN-PROD-007: Delete Product
- กดปุ่ม Delete
- Confirm dialog แสดง
- กด Confirm
- ตรวจสอบ Product หายจากรายการ

TC-ADMIN-PROD-008: Delete Product with Bookings
- ลบ Product ที่มี Booking อยู่
- ตรวจสอบ error หรือ soft delete

TC-ADMIN-PROD-009: Toggle Active/Inactive
- เปลี่ยน Product เป็น Inactive
- ตรวจสอบไม่แสดงใน Guest pages

Expected APIs:
GET /api/admin/products
POST /api/admin/products
PATCH /api/admin/products/[id]
DELETE /api/admin/products/[id]
```

### 5.3 Booking Management Testing

```
PROMPT สำหรับ Claude AI:

ทดสอบ Booking Management ที่ /admin/bookings

Test Cases:

TC-ADMIN-BOOK-001: Booking List
- เปิด /admin/bookings
- แสดงรายการ Bookings ทั้งหมด
- แต่ละ row: Booking ID, Customer, Date, Amount, Status, Actions

TC-ADMIN-BOOK-002: Filter Bookings
- Filter by status: PENDING, CONFIRMED, PAID, CANCELLED
- Filter by date range
- Search by customer name/email

TC-ADMIN-BOOK-003: View Booking Detail
- กดดูรายละเอียด Booking
- แสดงข้อมูลครบ:
  * Customer info
  * Items ที่จอง
  * ราคา
  * Coupon (ถ้ามี)
  * Affiliate (ถ้ามี)
  * Payment status

TC-ADMIN-BOOK-004: Update Status - Confirm
- เลือก Booking ที่ PENDING
- กดปุ่ม "Confirm"
- ตรวจสอบสถานะเปลี่ยนเป็น CONFIRMED

TC-ADMIN-BOOK-005: Update Status - Mark as Paid
- Admin ตรวจสอบการโอนเงินแล้ว
- กดปุ่ม "Mark as Paid"
- ตรวจสอบสถานะเปลี่ยนเป็น PAID

TC-ADMIN-BOOK-006: Cancel Booking
- กดปุ่ม Cancel Booking
- ตรวจสอบสถานะเปลี่ยนเป็น CANCELLED
- Inventory restore (ถ้ามี)

TC-ADMIN-BOOK-007: Export Bookings (ถ้ามี)
- Export to CSV/Excel
- ตรวจสอบข้อมูลครบถ้วน

Expected APIs:
GET /api/admin/bookings
PATCH /api/admin/bookings/[id]
```

### 5.4 Coupon Management Testing

```
PROMPT สำหรับ Claude AI:

ทดสอบ Coupon Management ที่ /admin/coupons

Test Cases:

TC-ADMIN-COUPON-001: Coupon List
- เปิด /admin/coupons
- แสดงรายการ Coupons ทั้งหมด
- แต่ละ row: Code, Discount, Type, Usage, Expiry, Status

TC-ADMIN-COUPON-002: Create Coupon - Percentage
- กดเพิ่ม Coupon
- Type: Percentage
- กรอก: Code, Discount (%), วันหมดอายุ, จำนวนครั้งที่ใช้ได้
- กด Save
- ตรวจสอบ Coupon ถูกสร้าง

TC-ADMIN-COUPON-003: Create Coupon - Fixed Amount
- Type: Fixed Amount
- กรอก: Code, Discount (฿), วันหมดอายุ
- กด Save

TC-ADMIN-COUPON-004: Coupon Validation
- Code ซ้ำ → error "Code นี้มีอยู่แล้ว"
- Discount > 100% → error
- Expiry date ในอดีต → error

TC-ADMIN-COUPON-005: Edit Coupon
- แก้ไข Coupon ที่มีอยู่
- ตรวจสอบ update ถูกต้อง

TC-ADMIN-COUPON-006: Delete Coupon
- ลบ Coupon
- ตรวจสอบหายจากรายการ

TC-ADMIN-COUPON-007: Deactivate Coupon
- Toggle Coupon เป็น Inactive
- ทดสอบใช้ Coupon ใน Booking → ต้อง error

Expected APIs:
GET /api/admin/coupons
POST /api/admin/coupons
PATCH /api/admin/coupons/[id]
DELETE /api/admin/coupons/[id]
```

### 5.5 Affiliate & Withdrawal Management Testing

```
PROMPT สำหรับ Claude AI:

ทดสอบ Affiliate Management ที่ /admin/affiliates และ /admin/withdrawals

Test Cases:

TC-ADMIN-AFF-001: Affiliates List
- เปิด /admin/affiliates
- แสดงรายการ Affiliates ทั้งหมด
- แต่ละ row: Name, Code, Clicks, Conversions, Earnings, Status

TC-ADMIN-AFF-002: View Affiliate Detail
- กดดูรายละเอียด Affiliate
- แสดง:
  * ข้อมูล Agent
  * Referral Code
  * Total Clicks
  * Total Conversions
  * Total Earnings
  * Booking history ที่เกิดจาก referral

TC-ADMIN-AFF-003: Approve/Reject Affiliate (ถ้ามี)
- Approve ผู้สมัครเป็น Agent
- Reject ผู้สมัคร

TC-ADMIN-WD-001: Withdrawal Requests List
- เปิด /admin/withdrawals
- แสดงรายการ Withdrawal Requests
- แต่ละ row: Agent, Amount, Bank Info, Date, Status

TC-ADMIN-WD-002: Approve Withdrawal
- เลือก Withdrawal ที่ PENDING
- กดปุ่ม "Approve"
- กรอก Transaction ID (ถ้าต้อง)
- ตรวจสอบสถานะเปลี่ยนเป็น APPROVED/PAID

TC-ADMIN-WD-003: Reject Withdrawal
- กดปุ่ม "Reject"
- กรอกเหตุผล
- ตรวจสอบสถานะเปลี่ยนเป็น REJECTED
- Earnings กลับไปยัง Agent balance

TC-ADMIN-WD-004: Withdrawal History
- ดูประวัติการถอนเงินทั้งหมด
- Filter by date, status, agent

Expected APIs:
GET /api/admin/affiliates
GET /api/admin/withdrawals
PATCH /api/admin/withdrawals/[id]
```

---

## 6. Agent/Affiliate Tests

### 6.1 Agent Dashboard Testing

```
PROMPT สำหรับ Claude AI:

ทดสอบ Agent Dashboard ที่ /agent

Test Cases:

TC-AGENT-DASH-001: Access Control
- Login ด้วย Agent account
- เปิด /agent
- ตรวจสอบ Dashboard แสดง

TC-AGENT-DASH-002: Dashboard Stats
- แสดงข้อมูล:
  * Total Earnings (รายได้ทั้งหมด)
  * Pending Earnings (รอจ่าย)
  * Available Balance (ถอนได้)
  * Total Clicks
  * Total Conversions
  * Conversion Rate

TC-AGENT-DASH-003: Earnings Summary
- แสดง Chart รายได้รายวัน/รายเดือน
- ตรวจสอบ data ถูกต้อง

TC-AGENT-DASH-004: Recent Referrals
- แสดงรายการ Bookings ที่เกิดจาก referral ล่าสุด

Expected API:
GET /api/agent/me
```

### 6.2 Referral Link Testing

```
PROMPT สำหรับ Claude AI:

ทดสอบ Referral Link ที่ /agent/referral

Test Cases:

TC-AGENT-REF-001: Display Referral Link
- เปิด /agent/referral
- แสดง Referral Link: https://sale-cyan.vercel.app?ref=AGENT_CODE

TC-AGENT-REF-002: Copy Referral Link
- กดปุ่ม "Copy"
- ตรวจสอบ link ถูก copy ไป clipboard
- แสดง toast "คัดลอกแล้ว"

TC-AGENT-REF-003: QR Code (ถ้ามี)
- แสดง QR Code ของ Referral Link
- Scan แล้วเปิดเว็บถูกต้อง

TC-AGENT-REF-004: Track Click
- เปิด Referral Link ในอีก browser
- ตรวจสอบ Click count เพิ่มขึ้น
- Cookie/Session บันทึก ref code

TC-AGENT-REF-005: Track Conversion
- เปิด Referral Link
- สร้าง Booking
- ตรวจสอบ Conversion count เพิ่มขึ้น
- Earnings ถูกคำนวณ

Expected API:
GET /api/affiliates/track?ref=CODE
```

### 6.3 Earnings & Withdrawal Testing

```
PROMPT สำหรับ Claude AI:

ทดสอบ Earnings Report ที่ /agent/earnings และ Withdrawal ที่ /agent/withdraw

Test Cases:

TC-AGENT-EARN-001: Earnings Report
- เปิด /agent/earnings
- แสดงรายการ Earnings ทั้งหมด
- แต่ละ row: Date, Booking ID, Amount, Commission, Status

TC-AGENT-EARN-002: Filter Earnings
- Filter by date range
- Filter by status

TC-AGENT-EARN-003: Earnings Calculation
- ตรวจสอบ Commission คำนวณถูกต้อง
- เช่น: Booking ฿1000, Commission 10% = ฿100

TC-AGENT-WD-001: Bank Account Setup
- เปิด /agent/withdraw
- ถ้ายังไม่มี Bank info → แสดง form ให้กรอก
- กรอก: ธนาคาร, เลขบัญชี, ชื่อบัญชี
- กด Save
- ตรวจสอบ Bank info บันทึก

TC-AGENT-WD-002: Bank Account Validation
- เลขบัญชีผิด format → error
- ไม่เลือกธนาคาร → error

TC-AGENT-WD-003: Request Withdrawal
- มี Available Balance
- กรอกจำนวนที่ต้องการถอน
- กด "ขอถอนเงิน"
- ตรวจสอบ Withdrawal request ถูกสร้าง

TC-AGENT-WD-004: Withdrawal Validation
- ถอนมากกว่า Available Balance → error
- ถอนน้อยกว่า Minimum → error

TC-AGENT-WD-005: Withdrawal History
- แสดงประวัติการถอนเงิน
- แต่ละ row: Date, Amount, Status, Transaction ID

TC-AGENT-WD-006: Withdrawal Status
- PENDING → รอ Admin อนุมัติ
- APPROVED → โอนเงินแล้ว
- REJECTED → ถูกปฏิเสธ (ดูเหตุผล)

Expected APIs:
POST /api/agent/bank
POST /api/agent/withdraw
GET /api/agent/me (includes earnings, withdrawals)
```

---

## 7. API Endpoint Tests

### 7.1 Public API Testing

```
PROMPT สำหรับ Claude AI:

ทดสอบ Public APIs โดยไม่ต้อง Authentication

Test Cases:

TC-API-PUB-001: GET /api/products
- Request: GET /api/products
- Expected: 200 OK
- Response: Array of all products
- ตรวจสอบ: มี id, name, price, type, images

TC-API-PUB-002: GET /api/products?type=ROOM
- Request: GET /api/products?type=ROOM
- Expected: 200 OK
- Response: Array of ROOM products only

TC-API-PUB-003: GET /api/products?type=TOUR
- Request: GET /api/products?type=TOUR
- Expected: 200 OK
- Response: Array of TOUR products only

TC-API-PUB-004: GET /api/products/[id]
- Request: GET /api/products/valid-id
- Expected: 200 OK
- Response: Single product object

TC-API-PUB-005: GET /api/products/[invalid-id]
- Request: GET /api/products/xxx
- Expected: 404 Not Found
- Response: { error: "Product not found" }

TC-API-PUB-006: GET /api/affiliates/track?ref=CODE
- Request: GET /api/affiliates/track?ref=AGENT123
- Expected: 200 OK
- Response: Click tracked, set cookie

TC-API-PUB-007: GET /api/affiliates/track - Invalid Code
- Request: GET /api/affiliates/track?ref=INVALID
- Expected: 200 OK (but no tracking)
- ไม่ error แต่ไม่ track
```

### 7.2 Protected API Testing

```
PROMPT สำหรับ Claude AI:

ทดสอบ Protected APIs ที่ต้อง Authentication

Test Cases:

TC-API-AUTH-001: POST /api/bookings - Without Auth
- Request: POST /api/bookings (no session)
- Expected: 401 Unauthorized

TC-API-AUTH-002: POST /api/bookings - With Auth
- Request: POST /api/bookings (with valid session)
- Body: { items: [...], guestInfo: {...} }
- Expected: 201 Created
- Response: { bookingId, status }

TC-API-AUTH-003: GET /api/bookings/my - Without Auth
- Request: GET /api/bookings/my (no session)
- Expected: 401 Unauthorized

TC-API-AUTH-004: GET /api/bookings/my - With Auth
- Request: GET /api/bookings/my (with session)
- Expected: 200 OK
- Response: Array of user's bookings

TC-API-AUTH-005: POST /api/payment/promptpay
- Request: POST /api/payment/promptpay
- Body: { bookingId, amount }
- Expected: 200 OK
- Response: { qrCode, promptPayId }

TC-API-AUTH-006: GET /api/agent/me - Non-Agent User
- Request: GET /api/agent/me (user ไม่ใช่ Agent)
- Expected: 403 Forbidden

TC-API-AUTH-007: GET /api/agent/me - Agent User
- Request: GET /api/agent/me (Agent account)
- Expected: 200 OK
- Response: Agent data
```

### 7.3 Admin API Testing

```
PROMPT สำหรับ Claude AI:

ทดสอบ Admin APIs ที่ต้อง Admin Role

Test Cases:

TC-API-ADMIN-001: GET /api/admin/dashboard - Non-Admin
- Request: GET /api/admin/dashboard (normal user)
- Expected: 403 Forbidden

TC-API-ADMIN-002: GET /api/admin/dashboard - Admin
- Request: GET /api/admin/dashboard (admin user)
- Expected: 200 OK
- Response: Dashboard stats

TC-API-ADMIN-003: POST /api/admin/products
- Create new product
- Expected: 201 Created

TC-API-ADMIN-004: PATCH /api/admin/products/[id]
- Update product
- Expected: 200 OK

TC-API-ADMIN-005: DELETE /api/admin/products/[id]
- Delete product
- Expected: 200 OK

TC-API-ADMIN-006: GET /api/admin/bookings
- List all bookings
- Expected: 200 OK

TC-API-ADMIN-007: PATCH /api/admin/bookings/[id]
- Update booking status
- Expected: 200 OK

TC-API-ADMIN-008: GET /api/admin/coupons
- List coupons
- Expected: 200 OK

TC-API-ADMIN-009: POST /api/admin/coupons
- Create coupon
- Expected: 201 Created

TC-API-ADMIN-010: PATCH /api/admin/withdrawals/[id]
- Approve/Reject withdrawal
- Expected: 200 OK
```

---

## 8. Edge Cases & Error Handling

### 8.1 Booking Edge Cases

```
PROMPT สำหรับ Claude AI:

ทดสอบ Edge Cases ของระบบ Booking

Test Cases:

TC-EDGE-BOOK-001: Double Booking
- จอง Room เดียวกันในวันเดียวกัน 2 ครั้งพร้อมกัน
- ตรวจสอบ: ไม่เกิด overbooking

TC-EDGE-BOOK-002: Inventory Exhausted
- Room มี 1 ห้อง, ถูกจองหมด
- User ใหม่พยายามจอง
- ตรวจสอบ: แสดง "ห้องเต็ม" หรือไม่สามารถจองได้

TC-EDGE-BOOK-003: Concurrent Cart Update
- 2 browser เปิด Cart page พร้อมกัน
- ทั้งคู่ update quantity
- ตรวจสอบ: ไม่มี race condition

TC-EDGE-BOOK-004: Expired Session During Booking
- Session หมดอายุระหว่างกรอก form
- กด Submit
- ตรวจสอบ: Redirect ไป login, ไม่ทำให้ data หาย

TC-EDGE-BOOK-005: Network Error During Booking
- ปิด network ระหว่าง submit
- ตรวจสอบ: แสดง error message เหมาะสม
- Retry mechanism (ถ้ามี)

TC-EDGE-BOOK-006: Long Booking Items
- เพิ่ม items จำนวนมากในตะกร้า (20+ items)
- ตรวจสอบ: Cart handle ได้
- Performance ไม่ช้า
```

### 8.2 Payment Edge Cases

```
PROMPT สำหรับ Claude AI:

ทดสอบ Edge Cases ของระบบ Payment

Test Cases:

TC-EDGE-PAY-001: Payment Timeout
- เปิดหน้า Payment นาน (ถ้ามี QR expiry)
- ตรวจสอบ: QR หมดอายุ? Regenerate?

TC-EDGE-PAY-002: Duplicate Payment
- ชำระเงินซ้ำสำหรับ Booking เดียว
- ตรวจสอบ: ระบบป้องกันได้

TC-EDGE-PAY-003: Invalid Amount
- QR amount ไม่ตรงกับ Booking
- ตรวจสอบ: Validation

TC-EDGE-PAY-004: Cancelled Booking Payment
- พยายามชำระเงิน Booking ที่ถูก cancel แล้ว
- ตรวจสอบ: ไม่สามารถชำระได้
```

### 8.3 Affiliate Edge Cases

```
PROMPT สำหรับ Claude AI:

ทดสอบ Edge Cases ของระบบ Affiliate

Test Cases:

TC-EDGE-AFF-001: Self-Referral
- Agent เปิด Referral link ตัวเอง
- สร้าง Booking
- ตรวจสอบ: ไม่ได้รับ Commission

TC-EDGE-AFF-002: Expired Referral Cookie
- เปิด Referral link
- รอ cookie หมดอายุ (ถ้ามี)
- สร้าง Booking
- ตรวจสอบ: ไม่ track

TC-EDGE-AFF-003: Multiple Referral Links
- เปิด Referral link ของ Agent A
- แล้วเปิด Referral link ของ Agent B
- สร้าง Booking
- ตรวจสอบ: Credit ไปที่ Agent ไหน (usually ล่าสุด)

TC-EDGE-AFF-004: Withdrawal More Than Balance
- Available Balance = ฿500
- Request Withdraw ฿1000
- ตรวจสอบ: Error message

TC-EDGE-AFF-005: Withdrawal Processing
- Request Withdraw ขณะมี Pending Withdrawal อื่น
- ตรวจสอบ: สามารถ request ได้หรือไม่
```

### 8.4 Form Validation Edge Cases

```
PROMPT สำหรับ Claude AI:

ทดสอบ Form Validation Edge Cases

Test Cases:

TC-EDGE-FORM-001: XSS Prevention
- กรอก script tag ในชื่อ: <script>alert('xss')</script>
- ตรวจสอบ: Input ถูก sanitize

TC-EDGE-FORM-002: SQL Injection Prevention
- กรอก SQL ใน input: '; DROP TABLE users; --
- ตรวจสอบ: ไม่มี error, ไม่ทำ DB

TC-EDGE-FORM-003: Very Long Input
- กรอกข้อความยาวมาก (10000+ characters)
- ตรวจสอบ: Validation หรือ truncate

TC-EDGE-FORM-004: Unicode Characters
- กรอก Emoji และ Unicode พิเศษ
- ตรวจสอบ: Handle ได้ถูกต้อง

TC-EDGE-FORM-005: Negative Numbers
- กรอกจำนวนติดลบในราคา
- ตรวจสอบ: Validation error

TC-EDGE-FORM-006: Decimal Precision
- กรอกราคา 100.999999
- ตรวจสอบ: Round ถูกต้อง
```

---

## 9. Performance & Security Tests

### 9.1 Performance Testing

```
PROMPT สำหรับ Claude AI:

ทดสอบ Performance ของระบบ

Test Cases:

TC-PERF-001: Page Load Time
- วัดเวลา load หน้า Homepage
- Target: < 3 วินาที (First Contentful Paint)

TC-PERF-002: API Response Time
- วัดเวลา response ของ /api/products
- Target: < 500ms

TC-PERF-003: Image Loading
- ตรวจสอบ Image optimization (Next.js Image)
- Lazy loading ทำงาน

TC-PERF-004: Cart Operations
- วัดเวลา Add/Remove item จาก Cart
- Target: < 100ms

TC-PERF-005: Search/Filter Performance
- Filter Products 100+ items
- Target: < 500ms

TC-PERF-006: Database Query
- ตรวจสอบ N+1 query problem
- ใช้ Prisma include/select เหมาะสม
```

### 9.2 Security Testing

```
PROMPT สำหรับ Claude AI:

ทดสอบ Security ของระบบ

Test Cases:

TC-SEC-001: Authentication Bypass
- เข้าถึง /admin โดยไม่ login
- ตรวจสอบ: Redirect หรือ 401

TC-SEC-002: Authorization Bypass
- User ปกติเข้าถึง Admin APIs
- ตรวจสอบ: 403 Forbidden

TC-SEC-003: CSRF Protection
- ส่ง POST request โดยไม่มี CSRF token
- ตรวจสอบ: ป้องกันได้

TC-SEC-004: Session Hijacking
- Copy session cookie ไปอีก browser
- ตรวจสอบ: Session validation

TC-SEC-005: Rate Limiting
- ส่ง request มากๆ ใน 1 วินาที
- ตรวจสอบ: Rate limit ทำงาน (ถ้ามี)

TC-SEC-006: Sensitive Data Exposure
- ตรวจสอบ API response ไม่มี password, secrets
- ตรวจสอบ Error messages ไม่เผย internal details

TC-SEC-007: HTTPS
- ตรวจสอบเว็บใช้ HTTPS
- HTTP redirect to HTTPS

TC-SEC-008: Cookie Security
- ตรวจสอบ cookie flags: HttpOnly, Secure, SameSite
```

---

## 📝 Test Execution Summary Template

```
=== ARUN SA WAD E2E Test Report ===

Date: [DATE]
Tester: Claude AI
Environment: Production (https://sale-cyan.vercel.app)

## Summary
- Total Test Cases: XXX
- Passed: XXX
- Failed: XXX
- Blocked: XXX
- Pass Rate: XX%

## Critical Issues Found
1. [Issue description]
2. [Issue description]

## Recommendations
1. [Recommendation]
2. [Recommendation]

## Test Details
[Detailed test results per section]
```

---

## 🚀 Quick Start Commands

```bash
# Run API tests with curl
curl https://sale-cyan.vercel.app/api/products
curl https://sale-cyan.vercel.app/api/products?type=ROOM
curl https://sale-cyan.vercel.app/api/products/[id]

# Test referral tracking
curl https://sale-cyan.vercel.app/api/affiliates/track?ref=AGENT123

# Check health
curl https://sale-cyan.vercel.app/api/health
```

---

*สร้างโดย Claude AI สำหรับ QA Testing ระบบ ARUN SA WAD*
*Last Updated: January 2025*
