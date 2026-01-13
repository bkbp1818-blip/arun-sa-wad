import { prisma } from "@/lib/prisma";
import { RoomCard } from "@/components/products/RoomCard";

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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">ห้องพัก</h1>
        <p className="text-muted-foreground">
          เลือกห้องพักที่เหมาะกับคุณ พร้อมสิ่งอำนวยความสะดวกครบครัน
        </p>
      </div>

      {/* Room Grid */}
      {rooms.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">ไม่พบห้องพัก</p>
        </div>
      )}
    </div>
  );
}
