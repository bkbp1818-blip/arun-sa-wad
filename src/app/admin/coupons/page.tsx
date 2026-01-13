"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2, Ticket, Trash2 } from "lucide-react";

interface Coupon {
  id: string;
  code: string;
  partnerName: string;
  description: string;
  discountType: string;
  discountValue: string;
  validFrom: string;
  validUntil: string;
  maxUses: number | null;
  usedCount: number;
  isActive: boolean;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  async function fetchCoupons() {
    try {
      const res = await fetch("/api/admin/coupons");
      if (res.ok) {
        const data = await res.json();
        setCoupons(data);
      }
    } catch (error) {
      console.error("Failed to fetch coupons:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("ต้องการลบคูปองนี้หรือไม่?")) return;

    try {
      const res = await fetch(`/api/admin/coupons/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCoupons(coupons.filter((c) => c.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete coupon:", error);
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">คูปองพาร์ทเนอร์</h1>
          <p className="text-muted-foreground">จัดการคูปองส่วนลดจากพาร์ทเนอร์</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              เพิ่มคูปอง
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>เพิ่มคูปองใหม่</DialogTitle>
            </DialogHeader>
            <CouponForm
              onSuccess={() => {
                setIsCreateOpen(false);
                fetchCoupons();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {coupons.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Ticket className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">ยังไม่มีคูปอง</h3>
            <p className="text-muted-foreground">สร้างคูปองส่วนลดสำหรับพาร์ทเนอร์</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium">โค้ด</th>
                    <th className="text-left p-4 font-medium">พาร์ทเนอร์</th>
                    <th className="text-left p-4 font-medium">ส่วนลด</th>
                    <th className="text-left p-4 font-medium">ใช้แล้ว</th>
                    <th className="text-left p-4 font-medium">สถานะ</th>
                    <th className="text-right p-4 font-medium">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((coupon) => (
                    <tr key={coupon.id} className="border-t">
                      <td className="p-4 font-mono font-medium">{coupon.code}</td>
                      <td className="p-4">
                        <p className="font-medium">{coupon.partnerName}</p>
                        <p className="text-sm text-muted-foreground">
                          {coupon.description}
                        </p>
                      </td>
                      <td className="p-4">
                        {coupon.discountType === "PERCENT"
                          ? `${coupon.discountValue}%`
                          : `${Number(coupon.discountValue).toLocaleString()} ฿`}
                      </td>
                      <td className="p-4">
                        {coupon.usedCount}
                        {coupon.maxUses && ` / ${coupon.maxUses}`}
                      </td>
                      <td className="p-4">
                        <Badge variant={coupon.isActive ? "default" : "secondary"}>
                          {coupon.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => handleDelete(coupon.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Coupon Form Component
function CouponForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    partnerName: "",
    description: "",
    discountType: "PERCENT",
    discountValue: "",
    validFrom: "",
    validUntil: "",
    maxUses: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          discountValue: parseFloat(formData.discountValue),
          maxUses: formData.maxUses ? parseInt(formData.maxUses) : null,
        }),
      });

      if (res.ok) {
        onSuccess();
      } else {
        alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
      }
    } catch (error) {
      console.error("Error creating coupon:", error);
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium mb-2 block">โค้ดคูปอง</label>
          <Input
            value={formData.code}
            onChange={(e) =>
              setFormData({ ...formData, code: e.target.value.toUpperCase() })
            }
            placeholder="YAOWARAT20"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">ชื่อพาร์ทเนอร์</label>
          <Input
            value={formData.partnerName}
            onChange={(e) =>
              setFormData({ ...formData, partnerName: e.target.value })
            }
            required
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">รายละเอียด</label>
        <Input
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium mb-2 block">ประเภทส่วนลด</label>
          <Select
            value={formData.discountType}
            onValueChange={(value) =>
              setFormData({ ...formData, discountType: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PERCENT">เปอร์เซ็นต์ (%)</SelectItem>
              <SelectItem value="FIXED">จำนวนเงิน (฿)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">มูลค่าส่วนลด</label>
          <Input
            type="number"
            value={formData.discountValue}
            onChange={(e) =>
              setFormData({ ...formData, discountValue: e.target.value })
            }
            required
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium mb-2 block">เริ่มใช้ได้</label>
          <Input
            type="date"
            value={formData.validFrom}
            onChange={(e) =>
              setFormData({ ...formData, validFrom: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">หมดอายุ</label>
          <Input
            type="date"
            value={formData.validUntil}
            onChange={(e) =>
              setFormData({ ...formData, validUntil: e.target.value })
            }
            required
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">
          จำกัดการใช้ (เว้นว่างถ้าไม่จำกัด)
        </label>
        <Input
          type="number"
          value={formData.maxUses}
          onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
          placeholder="ไม่จำกัด"
        />
      </div>

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
