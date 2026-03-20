"use client";

import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-primary">{t("footer.brand")}</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {t("footer.tagline")}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">{t("footer.quickLinks")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/rooms" className="hover:text-primary transition-colors">
                  {t("footer.rooms")}
                </Link>
              </li>
              <li>
                <Link href="/tours" className="hover:text-primary transition-colors">
                  {t("footer.tours")}
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-primary transition-colors">
                  {t("footer.services")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold">{t("footer.contact")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{t("footer.address")}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a href="tel:+6621234567" className="hover:text-primary">
                  02-123-4567
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:hello@arunsawad.com" className="hover:text-primary">
                  hello@arunsawad.com
                </a>
              </li>
            </ul>
          </div>

          {/* Social & Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold">{t("footer.moreInfo")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  {t("footer.about")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors">
                  {t("footer.terms")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  {t("footer.privacy")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {t("footer.copyright")}</p>
          <p className="mt-2 text-xs">Version 1.0.0 - Deployed via GitHub</p>
        </div>
      </div>
    </footer>
  );
}
