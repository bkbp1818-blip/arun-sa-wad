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
import { Plus, Loader2, FolderOpen, Trash2, Pencil } from "lucide-react";

interface Category {
  id: string;
  name: string;
  nameTh: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
  _count: {
    products: number;
  };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const res = await fetch("/api/admin/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    const category = categories.find((c) => c.id === id);
    const message =
      category && category._count.products > 0
        ? `หมวดหมู่นี้มี ${category._count.products} สินค้า ต้องการลบหรือไม่? (สินค้าจะถูกตั้งเป็นไม่มีหมวดหมู่)`
        : "ต้องการลบหมวดหมู่นี้หรือไม่?";

    if (!confirm(message)) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCategories(categories.filter((c) => c.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete category:", error);
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
          <h1 className="text-3xl font-bold">หมวดหมู่สินค้า</h1>
          <p className="text-muted-foreground">จัดการหมวดหมู่สำหรับจัดกลุ่มสินค้า</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              เพิ่มหมวดหมู่
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>เพิ่มหมวดหมู่ใหม่</DialogTitle>
            </DialogHeader>
            <CategoryForm
              onSuccess={() => {
                setIsCreateOpen(false);
                fetchCategories();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {categories.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">ยังไม่มีหมวดหมู่</h3>
            <p className="text-muted-foreground">สร้างหมวดหมู่เพื่อจัดกลุ่มสินค้า</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium">ลำดับ</th>
                    <th className="text-left p-4 font-medium">ชื่อ (EN)</th>
                    <th className="text-left p-4 font-medium">ชื่อ (TH)</th>
                    <th className="text-left p-4 font-medium">สินค้า</th>
                    <th className="text-left p-4 font-medium">สถานะ</th>
                    <th className="text-right p-4 font-medium">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id} className="border-t">
                      <td className="p-4">{category.sortOrder}</td>
                      <td className="p-4 font-medium">{category.name}</td>
                      <td className="p-4">{category.nameTh}</td>
                      <td className="p-4">{category._count.products} รายการ</td>
                      <td className="p-4">
                        <Badge variant={category.isActive ? "default" : "secondary"}>
                          {category.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Dialog
                            open={editingCategory?.id === category.id}
                            onOpenChange={(open) =>
                              setEditingCategory(open ? category : null)
                            }
                          >
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>แก้ไขหมวดหมู่</DialogTitle>
                              </DialogHeader>
                              <CategoryForm
                                category={category}
                                onSuccess={() => {
                                  setEditingCategory(null);
                                  fetchCategories();
                                }}
                              />
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => handleDelete(category.id)}
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

// Category Form Component
function CategoryForm({
  category,
  onSuccess,
}: {
  category?: Category;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: category?.name || "",
    nameTh: category?.nameTh || "",
    isActive: category?.isActive ?? true,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const url = category
        ? `/api/admin/categories/${category.id}`
        : "/api/admin/categories";
      const method = category ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        onSuccess();
      } else {
        const data = await res.json();
        alert(data.error || "เกิดข้อผิดพลาด กรุณาลองใหม่");
      }
    } catch (error) {
      console.error("Error saving category:", error);
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">ชื่อ (ภาษาอังกฤษ)</label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Popular"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">ชื่อ (ภาษาไทย)</label>
        <Input
          value={formData.nameTh}
          onChange={(e) => setFormData({ ...formData, nameTh: e.target.value })}
          placeholder="ยอดนิยม"
          required
        />
      </div>

      {category && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) =>
              setFormData({ ...formData, isActive: e.target.checked })
            }
            className="h-4 w-4"
          />
          <label htmlFor="isActive" className="text-sm">
            เปิดใช้งาน
          </label>
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
