import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin } from "lucide-react";
import type { Product } from "@prisma/client";

interface TourCardProps {
  tour: Product;
}

export function TourCard({ tour }: TourCardProps) {
  const price = Number(tour.price);

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-muted">
        {tour.images[0] ? (
          <img
            src={tour.images[0]}
            alt={tour.nameTh}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
        {tour.duration && (
          <Badge className="absolute top-2 left-2" variant="secondary">
            {tour.duration}
          </Badge>
        )}
      </div>

      {/* Content */}
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1">{tour.nameTh}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {tour.descTh || tour.description}
        </p>

        {/* Features */}
        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
          {tour.duration && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{tour.duration}</span>
            </div>
          )}
          {tour.meetingPoint && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{tour.meetingPoint}</span>
            </div>
          )}
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div>
          <span className="text-2xl font-bold text-primary">
            {price.toLocaleString()}
          </span>
          <span className="text-sm text-muted-foreground"> ฿/คน</span>
        </div>
        <Button asChild>
          <Link href={`/tours/${tour.id}`}>ดูรายละเอียด</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
