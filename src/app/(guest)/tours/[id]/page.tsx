import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Clock, MapPin, Calendar } from "lucide-react";

interface TourDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: TourDetailPageProps) {
  const { id } = await params;
  const tour = await prisma.product.findUnique({ where: { id } });

  if (!tour) {
    return { title: "ไม่พบทัวร์" };
  }

  return {
    title: `${tour.nameTh} | ARUN SA WAD`,
    description: tour.descTh || tour.description,
  };
}

export default async function TourDetailPage({ params }: TourDetailPageProps) {
  const { id } = await params;

  const tour = await prisma.product.findUnique({
    where: { id, type: "TOUR" },
  });

  if (!tour) {
    notFound();
  }

  const price = Number(tour.price);
  const schedule = tour.schedule as { days?: string[]; times?: string[] } | null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        href="/tours"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        กลับไปหน้าทัวร์
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-muted rounded-lg overflow-hidden">
          {tour.images[0] ? (
            <img
              src={tour.images[0]}
              alt={tour.nameTh}
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
          <div className="mb-4">
            {tour.duration && (
              <Badge variant="secondary" className="mb-2">
                {tour.duration}
              </Badge>
            )}
            <h1 className="text-3xl font-bold">{tour.nameTh}</h1>
            <p className="text-muted-foreground">{tour.name}</p>
          </div>

          {/* Info */}
          <div className="space-y-3 mb-6">
            {tour.duration && (
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span>ระยะเวลา: {tour.duration}</span>
              </div>
            )}
            {tour.meetingPoint && (
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span>จุดนัดพบ: {tour.meetingPoint}</span>
              </div>
            )}
          </div>

          {/* Schedule */}
          {schedule && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                ตารางเวลา
              </h3>
              {schedule.days && (
                <div className="mb-2">
                  <span className="text-sm text-muted-foreground">วัน: </span>
                  <span>{schedule.days.join(", ")}</span>
                </div>
              )}
              {schedule.times && (
                <div>
                  <span className="text-sm text-muted-foreground">เวลา: </span>
                  <span>{schedule.times.join(", ")}</span>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <p className="text-muted-foreground mb-6">
            {tour.descTh || tour.description}
          </p>

          {/* Price & Booking Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-3xl font-bold text-primary">
                    {price.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground"> ฿/คน</span>
                </div>
              </div>

              <Button size="lg" className="w-full" asChild>
                <Link href={`/booking?tour=${tour.id}`}>
                  จองทัวร์นี้
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
