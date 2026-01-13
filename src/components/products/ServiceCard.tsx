"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import type { Product } from "@prisma/client";

interface ServiceCardProps {
  service: Product;
  onAddToCart?: (product: Product) => void;
}

export function ServiceCard({ service, onAddToCart }: ServiceCardProps) {
  const price = Number(service.price);

  const typeLabels: Record<string, string> = {
    FOOD: "อาหาร",
    SERVICE: "บริการ",
    MERCH: "ของฝาก",
  };

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-muted">
        {service.images[0] ? (
          <img
            src={service.images[0]}
            alt={service.nameTh}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
        <Badge className="absolute top-2 left-2" variant="secondary">
          {typeLabels[service.type] || service.type}
        </Badge>
      </div>

      {/* Content */}
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1">{service.nameTh}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {service.descTh || service.description}
        </p>
      </CardContent>

      {/* Footer */}
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div>
          <span className="text-2xl font-bold text-primary">
            {price.toLocaleString()}
          </span>
          <span className="text-sm text-muted-foreground"> ฿</span>
        </div>
        <Button onClick={() => onAddToCart?.(service)}>
          <ShoppingCart className="h-4 w-4 mr-2" />
          เพิ่มในตะกร้า
        </Button>
      </CardFooter>
    </Card>
  );
}
