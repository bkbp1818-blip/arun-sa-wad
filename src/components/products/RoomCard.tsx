import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Wifi, Wind } from "lucide-react";
import type { Product } from "@prisma/client";

interface RoomCardProps {
  room: Product;
}

export function RoomCard({ room }: RoomCardProps) {
  const price = Number(room.price);

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-muted">
        {room.images[0] ? (
          <img
            src={room.images[0]}
            alt={room.nameTh}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
        {room.roomNumber && (
          <Badge className="absolute top-2 left-2" variant="secondary">
            ห้อง {room.roomNumber}
          </Badge>
        )}
      </div>

      {/* Content */}
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1">{room.nameTh}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {room.descTh || room.description}
        </p>

        {/* Features */}
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          {room.capacity && (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{room.capacity} คน</span>
            </div>
          )}
          {room.amenities.includes("WiFi") && (
            <div className="flex items-center gap-1">
              <Wifi className="h-4 w-4" />
            </div>
          )}
          {room.amenities.includes("Air Conditioning") && (
            <div className="flex items-center gap-1">
              <Wind className="h-4 w-4" />
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
          <span className="text-sm text-muted-foreground"> ฿/คืน</span>
        </div>
        <Button asChild>
          <Link href={`/rooms/${room.id}`}>ดูรายละเอียด</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
