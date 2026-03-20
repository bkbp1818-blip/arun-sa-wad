"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Clock, MapPin, Calendar } from "lucide-react";
import { ImageGallery } from "@/components/products/ImageGallery";
import { TourMeetingPointSection } from "./TourMeetingPointSection";
import { useTranslation, getLocalizedName, getLocalizedDesc } from "@/lib/i18n";
import type { Product } from "@prisma/client";

export function TourDetailContent({ tour }: { tour: Product & { nameZh?: string | null; descZh?: string | null } }) {
  const price = Number(tour.price);
  const { t, locale } = useTranslation();
  const name = getLocalizedName(locale, tour);
  const desc = getLocalizedDesc(locale, tour);
  const schedule = tour.schedule as { days?: string[]; times?: string[] } | null;

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      {/* Back Button */}
      <Link
        href="/tours"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4 sm:mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        {t("tours.backToTours")}
      </Link>

      <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
        {/* Image Gallery */}
        <ImageGallery images={tour.images} alt={name} />

        {/* Details */}
        <div>
          <div className="mb-4">
            {tour.duration && (
              <Badge variant="secondary" className="mb-2">
                {tour.duration}
              </Badge>
            )}
            <h1 className="text-2xl sm:text-3xl font-bold">{name}</h1>
            {locale !== "th" && tour.nameTh && (
              <p className="text-sm sm:text-base text-muted-foreground">{tour.nameTh}</p>
            )}
            {locale === "th" && tour.name !== tour.nameTh && (
              <p className="text-sm sm:text-base text-muted-foreground">{tour.name}</p>
            )}
          </div>

          {/* Info */}
          <div className="space-y-3 mb-6">
            {tour.duration && (
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span>{t("tours.duration")}: {tour.duration}</span>
              </div>
            )}
            {tour.meetingPoint && (
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span>{t("tours.meetingPoint")}: {tour.meetingPoint}</span>
              </div>
            )}
          </div>

          {/* Schedule */}
          {schedule && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {t("tours.schedule")}
              </h3>
              {schedule.days && (
                <div className="mb-2">
                  <span className="text-sm text-muted-foreground">{t("tours.days")}: </span>
                  <span>{schedule.days.join(", ")}</span>
                </div>
              )}
              {schedule.times && (
                <div>
                  <span className="text-sm text-muted-foreground">{t("tours.times")}: </span>
                  <span>{schedule.times.join(", ")}</span>
                </div>
              )}
            </div>
          )}

          {/* Meeting Point Map */}
          {tour.meetingPoint && tour.latitude && tour.longitude && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {t("tours.meetingPointMap")}
              </h3>
              <TourMeetingPointSection
                meetingPointName={tour.meetingPoint}
                lat={tour.latitude}
                lng={tour.longitude}
              />
            </div>
          )}

          {/* Description */}
          <p className="text-muted-foreground mb-6">
            {desc}
          </p>

          {/* Price & Booking Card */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-2xl sm:text-3xl font-bold text-primary">
                    {price.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground"> {t("tours.perPerson")}</span>
                </div>
              </div>

              <Button size="lg" className="w-full h-12 text-base" asChild>
                <Link href={`/booking?tour=${tour.id}`}>
                  {t("tours.bookThisTour")}
                </Link>
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-3">
                {t("tours.noCharge")}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
