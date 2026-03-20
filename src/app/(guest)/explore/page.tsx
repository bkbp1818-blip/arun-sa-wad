import { ExploreHeader } from "./ExploreHeader";
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
      <ExploreHeader />

      {/* Content */}
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <ExploreContent />
      </div>
    </div>
  );
}
