"use client";

import { useEffect, useState } from "react";
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
import { Plus, Pencil, Trash2, Loader2, Search, MapPin } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import type { ExplorePlace, ExplorePlaceType } from "@prisma/client";

const typeLabels: Record<string, string> = {
  TEMPLE: "วัด",
  FOOD: "ร้านอาหาร",
  MARKET: "ตลาด",
  LANDMARK: "สถานที่สำคัญ",
  MUSEUM: "พิพิธภัณฑ์",
  EVENT: "เทศกาล",
};

const typeColors: Record<string, string> = {
  TEMPLE: "bg-red-100 text-red-800",
  FOOD: "bg-green-100 text-green-800",
  MARKET: "bg-yellow-100 text-yellow-800",
  LANDMARK: "bg-purple-100 text-purple-800",
  MUSEUM: "bg-blue-100 text-blue-800",
  EVENT: "bg-pink-100 text-pink-800",
};

export default function AdminExplorePage() {
  const [places, setPlaces] = useState<ExplorePlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editPlace, setEditPlace] = useState<ExplorePlace | null>(null);

  useEffect(() => {
    fetchPlaces();
  }, []);

  async function fetchPlaces() {
    try {
      const res = await fetch("/api/admin/explore-places");
      if (res.ok) {
        const data = await res.json();
        setPlaces(data);
      }
    } catch (error) {
      console.error("Failed to fetch places:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("ต้องการลบสถานที่นี้หรือไม่?")) return;

    try {
      const res = await fetch(`/api/admin/explore-places/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setPlaces(places.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete place:", error);
    }
  }

  const filteredPlaces = places.filter((place) => {
    const matchesSearch =
      place.name.toLowerCase().includes(search.toLowerCase()) ||
      place.nameTh.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
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
          <h1 className="text-2xl sm:text-3xl font-bold">สถานที่สำรวจ</h1>
          <p className="text-muted-foreground">
            จัดการสถานที่ท่องเที่ยวในหน้า &quot;สำรวจเยาวราช&quot;
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              เพิ่มสถานที่
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>เพิ่มสถานที่ใหม่</DialogTitle>
            </DialogHeader>
            <PlaceForm
              onSuccess={() => {
                setIsCreateOpen(false);
                fetchPlaces();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="ค้นหาสถานที่..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Places by Type */}
      {Object.keys(typeLabels).map((type) => {
        const typePlaces = filteredPlaces.filter((p) => p.type === type);
        if (typePlaces.length === 0) return null;

        return (
          <Card key={type}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <span
                  className={`inline-flex px-2 py-1 rounded text-sm font-medium ${typeColors[type]}`}
                >
                  {typeLabels[type]}
                </span>
                <span className="text-muted-foreground text-sm font-normal">
                  ({typePlaces.length} รายการ)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {/* Desktop Table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-medium">สถานที่</th>
                      <th className="text-left p-4 font-medium">ระยะทาง</th>
                      <th className="text-left p-4 font-medium">เวลาเปิด</th>
                      <th className="text-left p-4 font-medium">สถานะ</th>
                      <th className="text-right p-4 font-medium">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {typePlaces.map((place) => (
                      <tr key={place.id} className="border-t">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded bg-muted flex items-center justify-center overflow-hidden shrink-0">
                              {place.images[0] ? (
                                <img
                                  src={place.images[0]}
                                  alt={place.nameTh}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <MapPin className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{place.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {place.nameTh}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-sm">{place.distance}</td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {place.openingHours || "-"}
                        </td>
                        <td className="p-4">
                          <Badge
                            variant={place.isActive ? "default" : "secondary"}
                          >
                            {place.isActive ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <Dialog
                              open={editPlace?.id === place.id}
                              onOpenChange={(open) => {
                                if (!open) setEditPlace(null);
                              }}
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setEditPlace(place)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              {editPlace?.id === place.id && (
                                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>แก้ไขสถานที่</DialogTitle>
                                  </DialogHeader>
                                  <PlaceForm
                                    initialData={editPlace}
                                    onSuccess={() => {
                                      setEditPlace(null);
                                      fetchPlaces();
                                    }}
                                  />
                                </DialogContent>
                              )}
                            </Dialog>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => handleDelete(place.id)}
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

              {/* Mobile Card List */}
              <div className="sm:hidden divide-y">
                {typePlaces.map((place) => (
                  <div key={place.id} className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-14 rounded bg-muted flex items-center justify-center overflow-hidden shrink-0">
                        {place.images[0] ? (
                          <img
                            src={place.images[0]}
                            alt={place.nameTh}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <MapPin className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{place.name}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {place.nameTh}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {place.distance} | {place.openingHours || "-"}
                        </p>
                      </div>
                      <Badge
                        variant={place.isActive ? "default" : "secondary"}
                        className="shrink-0"
                      >
                        {place.isActive ? "เปิด" : "ปิด"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-end gap-1">
                      <Dialog
                        open={editPlace?.id === place.id}
                        onOpenChange={(open) => {
                          if (!open) setEditPlace(null);
                        }}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9"
                          onClick={() => setEditPlace(place)}
                        >
                          <Pencil className="h-3.5 w-3.5 mr-1" />
                          แก้ไข
                        </Button>
                        {editPlace?.id === place.id && (
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>แก้ไขสถานที่</DialogTitle>
                            </DialogHeader>
                            <PlaceForm
                              initialData={editPlace}
                              onSuccess={() => {
                                setEditPlace(null);
                                fetchPlaces();
                              }}
                            />
                          </DialogContent>
                        )}
                      </Dialog>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 text-destructive border-destructive/30"
                        onClick={() => handleDelete(place.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {filteredPlaces.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            ไม่พบสถานที่
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Place Form Component
function PlaceForm({
  onSuccess,
  initialData,
}: {
  onSuccess: () => void;
  initialData?: ExplorePlace;
}) {
  const isEdit = !!initialData;
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    nameTh: initialData?.nameTh || "",
    type: initialData?.type || "TEMPLE",
    description: initialData?.description || "",
    latitude: initialData?.latitude?.toString() || "13.7407",
    longitude: initialData?.longitude?.toString() || "100.5086",
    distance: initialData?.distance || "",
    phone: initialData?.phone || "",
    website: initialData?.website || "",
    openingHours: initialData?.openingHours || "",
    admissionFee: initialData?.admissionFee || "",
    highlights: initialData?.highlights?.join(", ") || "",
    isActive: initialData?.isActive ?? true,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEdit
        ? `/api/admin/explore-places/${initialData.id}`
        : "/api/admin/explore-places";

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          images,
          highlights: formData.highlights
            ? formData.highlights.split(",").map((h) => h.trim())
            : [],
        }),
      });

      if (res.ok) {
        onSuccess();
      } else {
        alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
      }
    } catch (error) {
      console.error("Error saving place:", error);
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium mb-2 block">ชื่อ (EN) *</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Wat Mangkon Kamalawat"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">ชื่อ (TH) *</label>
          <Input
            value={formData.nameTh}
            onChange={(e) =>
              setFormData({ ...formData, nameTh: e.target.value })
            }
            placeholder="วัดมังกรกมลาวาส"
            required
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium mb-2 block">ประเภท *</label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value as ExplorePlaceType })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TEMPLE">วัด</SelectItem>
              <SelectItem value="FOOD">ร้านอาหาร</SelectItem>
              <SelectItem value="MARKET">ตลาด</SelectItem>
              <SelectItem value="LANDMARK">สถานที่สำคัญ</SelectItem>
              <SelectItem value="MUSEUM">พิพิธภัณฑ์</SelectItem>
              <SelectItem value="EVENT">เทศกาล</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">
            ระยะห่างจากโรงแรม *
          </label>
          <Input
            value={formData.distance}
            onChange={(e) =>
              setFormData({ ...formData, distance: e.target.value })
            }
            placeholder="200 ม. หรือ 2.5 กม."
            required
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">รายละเอียด *</label>
        <Input
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="คำอธิบายสถานที่..."
          required
        />
      </div>

      <ImageUpload images={images} onChange={setImages} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium mb-2 block">Latitude *</label>
          <Input
            type="number"
            step="any"
            value={formData.latitude}
            onChange={(e) =>
              setFormData({ ...formData, latitude: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Longitude *</label>
          <Input
            type="number"
            step="any"
            value={formData.longitude}
            onChange={(e) =>
              setFormData({ ...formData, longitude: e.target.value })
            }
            required
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium mb-2 block">เบอร์โทร</label>
          <Input
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            placeholder="02-222-3975"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">เว็บไซต์</label>
          <Input
            value={formData.website}
            onChange={(e) =>
              setFormData({ ...formData, website: e.target.value })
            }
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium mb-2 block">เวลาเปิด-ปิด</label>
          <Input
            value={formData.openingHours}
            onChange={(e) =>
              setFormData({ ...formData, openingHours: e.target.value })
            }
            placeholder="06:00–18:00 ทุกวัน"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">ค่าเข้าชม</label>
          <Input
            value={formData.admissionFee}
            onChange={(e) =>
              setFormData({ ...formData, admissionFee: e.target.value })
            }
            placeholder="ฟรี หรือ 200 บาท"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">
          จุดเด่น (คั่นด้วยคอมม่า)
        </label>
        <Input
          value={formData.highlights}
          onChange={(e) =>
            setFormData({ ...formData, highlights: e.target.value })
          }
          placeholder="Michelin Bib Gourmand, มรดกโลก, ฟรี"
        />
      </div>

      {isEdit && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) =>
              setFormData({ ...formData, isActive: e.target.checked })
            }
            className="rounded"
          />
          <label htmlFor="isActive" className="text-sm font-medium">
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
        ) : isEdit ? (
          "อัปเดต"
        ) : (
          "บันทึก"
        )}
      </Button>
    </form>
  );
}
