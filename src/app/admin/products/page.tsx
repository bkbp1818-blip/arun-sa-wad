"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Loader2, Search } from "lucide-react";
import type { Product } from "@prisma/client";

const typeLabels: Record<string, string> = {
  ROOM: "ห้องพัก",
  TOUR: "ทัวร์",
  FOOD: "อาหาร",
  SERVICE: "บริการ",
  MERCH: "ของฝาก",
};

const typeColors: Record<string, string> = {
  ROOM: "bg-blue-100 text-blue-800",
  TOUR: "bg-green-100 text-green-800",
  FOOD: "bg-orange-100 text-orange-800",
  SERVICE: "bg-purple-100 text-purple-800",
  MERCH: "bg-pink-100 text-pink-800",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await fetch("/api/admin/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("ต้องการลบสินค้านี้หรือไม่?")) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.nameTh.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || product.type === typeFilter;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">สินค้า/บริการ</h1>
          <p className="text-muted-foreground">จัดการห้องพัก ทัวร์ และบริการต่างๆ</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              เพิ่มสินค้า
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>เพิ่มสินค้าใหม่</DialogTitle>
            </DialogHeader>
            <ProductForm
              onSuccess={() => {
                setIsCreateOpen(false);
                fetchProducts();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ค้นหาสินค้า..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="ประเภท" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทั้งหมด</SelectItem>
            <SelectItem value="ROOM">ห้องพัก</SelectItem>
            <SelectItem value="TOUR">ทัวร์</SelectItem>
            <SelectItem value="FOOD">อาหาร</SelectItem>
            <SelectItem value="SERVICE">บริการ</SelectItem>
            <SelectItem value="MERCH">ของฝาก</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium">สินค้า</th>
                  <th className="text-left p-4 font-medium">ประเภท</th>
                  <th className="text-left p-4 font-medium">ราคา</th>
                  <th className="text-left p-4 font-medium">สถานะ</th>
                  <th className="text-right p-4 font-medium">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      ไม่พบสินค้า
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="border-t">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded bg-muted flex items-center justify-center overflow-hidden">
                            {product.images[0] ? (
                              <img
                                src={product.images[0]}
                                alt={product.nameTh}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                No img
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{product.nameTh}</p>
                            <p className="text-sm text-muted-foreground">
                              {product.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                            typeColors[product.type]
                          }`}
                        >
                          {typeLabels[product.type]}
                        </span>
                      </td>
                      <td className="p-4 font-medium">
                        {Number(product.price).toLocaleString()} ฿
                      </td>
                      <td className="p-4">
                        <Badge variant={product.isActive ? "default" : "secondary"}>
                          {product.isActive ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/products/${product.id}`}>
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Product Form Component
function ProductForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    nameTh: "",
    description: "",
    descTh: "",
    type: "ROOM",
    price: "",
    roomNumber: "",
    capacity: "",
    amenities: "",
    duration: "",
    meetingPoint: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          capacity: formData.capacity ? parseInt(formData.capacity) : null,
          amenities: formData.amenities
            ? formData.amenities.split(",").map((a) => a.trim())
            : [],
        }),
      });

      if (res.ok) {
        onSuccess();
      } else {
        alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium mb-2 block">ชื่อ (EN)</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">ชื่อ (TH)</label>
          <Input
            value={formData.nameTh}
            onChange={(e) => setFormData({ ...formData, nameTh: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium mb-2 block">ประเภท</label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value })}
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
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">รายละเอียด (TH)</label>
        <Input
          value={formData.descTh}
          onChange={(e) => setFormData({ ...formData, descTh: e.target.value })}
        />
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
            <label className="text-sm font-medium mb-2 block">สิ่งอำนวยความสะดวก</label>
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

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            กำลังบันทึก...
          </>
        ) : (
          "บันทึก"
        )}
      </Button>
    </form>
  );
}
