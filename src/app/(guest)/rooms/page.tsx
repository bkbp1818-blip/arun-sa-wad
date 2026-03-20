import { prisma } from "@/lib/prisma";
import { RoomsContent } from "./RoomsContent";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "ห้องพัก | ARUN SA WAD",
  description: "ห้องพักสไตล์โมเดิร์น กลางย่านเยาวราช",
};

export default async function RoomsPage() {
  const rooms = await prisma.product.findMany({
    where: {
      type: "ROOM",
      isActive: true,
    },
    orderBy: {
      price: "asc",
    },
  });

  return <RoomsContent rooms={rooms} />;
}
