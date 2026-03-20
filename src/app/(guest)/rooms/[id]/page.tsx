import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { RoomDetailContent } from "./RoomDetailContent";

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

export default async function RoomDetailPage({ params }: RoomDetailPageProps) {
  const { id } = await params;

  const room = await prisma.product.findUnique({
    where: { id, type: "ROOM" },
  });

  if (!room) {
    notFound();
  }

  return <RoomDetailContent room={room} />;
}
