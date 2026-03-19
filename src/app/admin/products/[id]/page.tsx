"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import type { Product } from "@prisma/client";

interface Category {
  id: string;
  name: string;
  nameTh: string;
  slug: string;
  isActive: boolean;
}

interface ProductWithCategory extends Product {
  category: Category | null;
}

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    nameTh: "",
    description: "",
    descTh: "",
    type: "ROOM",
    price: "",
    isActive: true,
    roomNumber: "",
    capacity: "",
    amenities: "",
    duration: "",
    meetingPoint: "",
    categoryId: "",
    availableFrom: "",
    availableTo: "",
  });

  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, []);

  async function fetchProduct() {
    try {
      const res = await fetch(`/api/admin/products/${params.id}`);
      if (res.ok) {
        const product: ProductWithCategory = await res.json();
        setImages(product.images || []);
        setFormData({
          name: product.name,
          nameTh: product.nameTh,
          description: product.description || "",
          descTh: product.descTh || "",
          type: product.type,
          price: String(product.price),
          isActive: product.isActive,
          roomNumber: product.roomNumber || "",
          capacity: product.capacity ? String(product.capacity) : "",
          amenities: product.amenities?.join(", ") || "",
          duration: product.duration || "",
          meetingPoint: product.meetingPoint || "",
          categoryId: product.categoryId || "",
          availableFrom: product.availableFrom
            ? new Date(product.availableFrom).toISOString().split("T")[0]
            : "",
          availableTo: product.availableTo
            ? new Date(product.availableTo).toISOString().split("T")[0]
            : "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch product:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchCategories() {
    try {
      const res = await fetch("/api/admin/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data.filter((c: Category) => c.isActive));
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/products/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          images,
          price: parseFloat(formData.price),
          capacity: formData.capacity ? parseInt(formData.capacity) : null,
          amenities: formData.amenities
            ? formData.amenities.split(",").map((a) => a.trim())
            : [],
          categoryId: formData.categoryId || null,
          availableFrom: formData.availableFrom || null,
          availableTo: formData.availableTo || null,
        }),
      });

      if (res.ok) {
        router.push("/admin/products");
      } else {
        alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">แก้ไขสินค้า</h1>
          <p className="text-muted-foreground">{formData.nameTh}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ข้อมูลสินค้า</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium mb-2 block">ชื่อ (EN)</label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">ชื่อ (TH)</label>
                <Input
                  value={formData.nameTh}
                  onChange={(e) =>
                    setFormData({ ...formData, nameTh: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium mb-2 block">ประเภท</label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ROOM">ห้องพัก</SelectItem>
                    <SelectItem value="TOUR">ทัวร์</SelectItem>
                    <SelectItem value="FOOD">อาหาร</SelectItem>
                    <SelectItem value="SERVICE">บริการ</SelectItem>
                    <SelectItem value="MERCH">ของฝาก</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">ราคา (฿)</label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">หมวดหมู่</label>
              <Select
                value={formData.categoryId || "none"}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    categoryId: value === "none" ? "" : value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกหมวดหมู่" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">ไม่ระบุ</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.nameTh}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <ImageUpload images={images} onChange={setImages} />

            <div>
              <label className="text-sm font-medium mb-2 block">
                รายละเอียด (TH)
              </label>
              <Input
                value={formData.descTh}
                onChange={(e) =>
                  setFormData({ ...formData, descTh: e.target.value })
                }
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  วันที่เริ่มใช้งาน
                </label>
                <Input
                  type="date"
                  value={formData.availableFrom}
                  onChange={(e) =>
                    setFormData({ ...formData, availableFrom: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  วันที่สิ้นสุดใช้งาน
                </label>
                <Input
                  type="date"
                  value={formData.availableTo}
                  onChange={(e) =>
                    setFormData({ ...formData, availableTo: e.target.value })
                  }
                />
              </div>
            </div>

            {formData.type === "ROOM" && (
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="text-sm font-medium mb-2 block">เลขห้อง</label>
                  <Input
                    value={formData.roomNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, roomNumber: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">จำนวนคน</label>
                  <Input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) =>
                      setFormData({ ...formData, capacity: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    สิ่งอำนวยความสะดวก
                  </label>
                  <Input
                    value={formData.amenities}
                    onChange={(e) =>
                      setFormData({ ...formData, amenities: e.target.value })
                    }
                    placeholder="WiFi, Air Conditioning, TV"
                  />
                </div>
              </div>
            )}

            {formData.type === "TOUR" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium mb-2 block">ระยะเวลา</label>
                  <Input
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    placeholder="2 hours"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">จุดนัดพบ</label>
                  <Input
                    value={formData.meetingPoint}
                    onChange={(e) =>
                      setFormData({ ...formData, meetingPoint: e.target.value })
                    }
                  />
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="isActive" className="text-sm font-medium">
                เปิดใช้งาน
              </label>
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    กำลังบันทึก...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    บันทึก
                  </>
                )}
              </Button>
              <Link href="/admin/products">
                <Button variant="outline">ยกเลิก</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
