import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ExploreContent } from "./ExploreContent";

export const metadata = {
  title: "สำรวจเยาวราช | ARUN SA WAD",
  description:
    "สำรวจสถานที่ท่องเที่ยว วัด ร้านอาหาร ตลาด และเทศกาลรอบเยาวราช ใกล้โรงแรมอรุณสวัสดิ์",
};

export default function ExplorePage() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-10 sm:py-12">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4">
            <MapPin className="h-3 w-3 mr-1" />
            Explore Yaowarat
          </Badge>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            สำรวจเยาวราช
          </h1>
          <p className="mt-2 text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
            วัด ร้านอาหาร ตลาด สถานที่ท่องเที่ยว และเทศกาลรอบโรงแรมอรุณสวัสดิ์
            ในรัศมี 3 กม.
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <ExploreContent />
      </div>
    </div>
  );
}
