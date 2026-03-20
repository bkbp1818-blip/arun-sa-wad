import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TourDetailContent } from "./TourDetailContent";

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

  return <TourDetailContent tour={tour} />;
}
