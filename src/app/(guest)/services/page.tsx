"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ServiceCard } from "@/components/products/ServiceCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Product } from "@prisma/client";

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch("/api/products");
        const products = await res.json();
        // Filter only FOOD, SERVICE, MERCH
        const filtered = products.filter((p: Product) =>
          ["FOOD", "SERVICE", "MERCH"].includes(p.type)
        );
        setServices(filtered);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  const handleAddToCart = (product: Product) => {
    // For now, redirect to booking with the product
    router.push(`/booking?service=${product.id}`);
  };

  const foodItems = services.filter((s) => s.type === "FOOD");
  const serviceItems = services.filter((s) => s.type === "SERVICE");
  const merchItems = services.filter((s) => s.type === "MERCH");

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">บริการเสริม</h1>
        <p className="text-muted-foreground">
          เพิ่มความสะดวกให้ทริปเยาวราชของคุณด้วยบริการพิเศษ
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">ทั้งหมด ({services.length})</TabsTrigger>
          <TabsTrigger value="food">อาหาร ({foodItems.length})</TabsTrigger>
          <TabsTrigger value="service">บริการ ({serviceItems.length})</TabsTrigger>
          <TabsTrigger value="merch">ของฝาก ({merchItems.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {services.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">ไม่พบบริการ</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="food">
          {foodItems.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {foodItems.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">ไม่พบรายการอาหาร</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="service">
          {serviceItems.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {serviceItems.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">ไม่พบบริการ</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="merch">
          {merchItems.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {merchItems.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">ไม่พบของฝาก</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
