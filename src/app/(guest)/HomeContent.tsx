"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bed, Map, Utensils, Gift, MapPin } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import type { TranslationKey } from "@/lib/i18n/th";

const features: { icon: typeof Bed; titleKey: TranslationKey; descKey: TranslationKey; href: string }[] = [
  {
    icon: Bed,
    titleKey: "home.comfyRooms",
    descKey: "home.comfyRoomsDesc",
    href: "/rooms",
  },
  {
    icon: Map,
    titleKey: "home.chinatownTours",
    descKey: "home.chinatownToursDesc",
    href: "/tours",
  },
  {
    icon: Utensils,
    titleKey: "home.streetFood",
    descKey: "home.streetFoodDesc",
    href: "/services",
  },
  {
    icon: Gift,
    titleKey: "home.souvenirs",
    descKey: "home.souvenirsDesc",
    href: "/services",
  },
];

export function HomeContent({ mapSection }: { mapSection: React.ReactNode }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/10 to-background py-12 sm:py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4">
            {t("home.welcome")}
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-6xl">
            <span className="text-primary">{t("home.heroTitle")}</span>
          </h1>
          <p className="mx-auto mt-3 sm:mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg md:text-xl whitespace-pre-line">
            {t("home.heroSubtitle")}
          </p>
          <div className="mt-6 sm:mt-8 flex flex-col justify-center gap-3 sm:gap-4 sm:flex-row">
            <Button size="lg" className="h-12 text-base" asChild>
              <Link href="/rooms">{t("home.bookRoom")}</Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 text-base" asChild>
              <Link href="/tours">{t("home.viewTours")}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 sm:py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold">{t("home.ourServices")}</h2>
            <p className="mt-2 text-muted-foreground">
              {t("home.servicesSubtitle")}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.titleKey} className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <feature.icon className="h-10 w-10 text-primary mb-2 group-hover:scale-110 transition-transform" />
                  <CardTitle className="text-lg">{t(feature.titleKey)}</CardTitle>
                  <CardDescription>{t(feature.descKey)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="link" className="p-0" asChild>
                    <Link href={feature.href}>{t("home.viewMore")} &rarr;</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-10 sm:py-16 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold">{t("home.ctaTitle")}</h2>
          <p className="mt-4 text-primary-foreground/80">
            {t("home.ctaSubtitle")}
          </p>
          <Button size="lg" variant="secondary" className="mt-6 sm:mt-8 h-12 text-base" asChild>
            <Link href="/rooms">{t("home.ctaButton")}</Link>
          </Button>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-10 sm:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Badge variant="secondary" className="mb-3">
              <MapPin className="h-3 w-3 mr-1" />
              {t("home.locationBadge")}
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold">{t("home.ourLocation")}</h2>
            <p className="mt-2 text-muted-foreground">
              {t("home.locationDesc")}
            </p>
          </div>
          {mapSection}
          <div className="text-center mt-6">
            <Button variant="outline" asChild>
              <Link href="/location">
                {t("home.viewFullMap")} &rarr;
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-10 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-4 sm:gap-8">
            <div className="text-center">
              <h3 className="text-2xl sm:text-4xl font-bold text-primary">100+</h3>
              <p className="text-muted-foreground">{t("home.reviews")}</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl sm:text-4xl font-bold text-primary">24/7</h3>
              <p className="text-muted-foreground">{t("home.customerService")}</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl sm:text-4xl font-bold text-primary">{t("home.fiveMin")}</h3>
              <p className="text-muted-foreground">{t("home.fromMRT")}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
