"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ServiceCard } from "@/components/products/ServiceCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/lib/i18n";
import type { Product } from "@prisma/client";

export default function ServicesPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [services, setServices] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch("/api/products");
        const products = await res.json();
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
    router.push(`/booking?service=${product.id}`);
  };

  const foodItems = services.filter((s) => s.type === "FOOD");
  const serviceItems = services.filter((s) => s.type === "SERVICE");
  const merchItems = services.filter((s) => s.type === "MERCH");

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">{t("services.title")}</h1>
        <p className="text-muted-foreground">
          {t("services.subtitle")}
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6 w-full flex overflow-x-auto">
          <TabsTrigger value="all" className="flex-1 min-w-0">{t("services.all")} ({services.length})</TabsTrigger>
          <TabsTrigger value="food" className="flex-1 min-w-0">{t("services.food")} ({foodItems.length})</TabsTrigger>
          <TabsTrigger value="service" className="flex-1 min-w-0">{t("services.service")} ({serviceItems.length})</TabsTrigger>
          <TabsTrigger value="merch" className="flex-1 min-w-0">{t("services.merch")} ({merchItems.length})</TabsTrigger>
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
              <p className="text-muted-foreground">{t("services.notFound")}</p>
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
              <p className="text-muted-foreground">{t("services.notFoundFood")}</p>
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
              <p className="text-muted-foreground">{t("services.notFound")}</p>
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
              <p className="text-muted-foreground">{t("services.notFoundMerch")}</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
