import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Users, Wifi, Wind, Tv, Bath } from "lucide-react";

interface RoomDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: RoomDetailPageProps) {
  const { id } = await params;
  const room = await prisma.product.findUnique({ where: { id } });

  if (!room) {
    return { title: "ไม่พบห้องพัก" };
  }

  return {
    title: `${room.nameTh} | ARUN SA WAD`,
    description: room.descTh || room.description,
  };
}

const amenityIcons: Record<string, React.ReactNode> = {
  WiFi: <Wifi className="h-5 w-5" />,
  "Air Conditioning": <Wind className="h-5 w-5" />,
  TV: <Tv className="h-5 w-5" />,
  "Private Bathroom": <Bath className="h-5 w-5" />,
};

export default async function RoomDetailPage({ params }: RoomDetailPageProps) {
  const { id } = await params;

  const room = await prisma.product.findUnique({
    where: { id, type: "ROOM" },
  });

  if (!room) {
    notFound();
  }

  const price = Number(room.price);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        href="/rooms"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        กลับไปหน้าห้องพัก
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-muted rounded-lg overflow-hidden">
          {room.images[0] ? (
            <img
              src={room.images[0]}
              alt={room.nameTh}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex items-start justify-between mb-4">
            <div>
              {room.roomNumber && (
                <Badge variant="secondary" className="mb-2">
                  ห้อง {room.roomNumber}
                </Badge>
              )}
              <h1 className="text-3xl font-bold">{room.nameTh}</h1>
              <p className="text-muted-foreground">{room.name}</p>
            </div>
          </div>

          {/* Capacity */}
          {room.capacity && (
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-muted-foreground" />
              <span>รองรับ {room.capacity} คน</span>
            </div>
          )}

          {/* Description */}
          <p className="text-muted-foreground mb-6">
            {room.descTh || room.description}
          </p>

          {/* Amenities */}
          {room.amenities.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">สิ่งอำนวยความสะดวก</h3>
              <div className="grid grid-cols-2 gap-3">
                {room.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-2 text-sm"
                  >
                    {amenityIcons[amenity] || (
                      <div className="h-5 w-5 rounded-full bg-primary/10" />
                    )}
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Price & Booking Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-3xl font-bold text-primary">
                    {price.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground"> ฿/คืน</span>
                </div>
              </div>

              <Button size="lg" className="w-full" asChild>
                <Link href={`/booking?room=${room.id}`}>
                  จองห้องนี้
                </Link>
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-3">
                ยังไม่ถูกเรียกเก็บเงิน จนกว่าจะยืนยันการจอง
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
