import { prisma } from "@/lib/prisma";
import { TourCard } from "@/components/products/TourCard";

export const metadata = {
  title: "ทัวร์เยาวราช | ARUN SA WAD",
  description: "สำรวจเสน่ห์ Chinatown กับไกด์ท้องถิ่น",
};

export default async function ToursPage() {
  const tours = await prisma.product.findMany({
    where: {
      type: "TOUR",
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
        <h1 className="text-3xl font-bold mb-2">ทัวร์เยาวราช</h1>
        <p className="text-muted-foreground">
          สำรวจเสน่ห์ Chinatown กับไกด์ท้องถิ่นที่รู้จักทุกซอกมุม
        </p>
      </div>

      {/* Tour Grid */}
      {tours.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">ไม่พบทัวร์</p>
        </div>
      )}
    </div>
  );
}
