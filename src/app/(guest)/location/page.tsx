import { LocationMapSection } from "./LocationMapSection";
import { LocationContent } from "./LocationContent";

export const metadata = {
  title: "ตำแหน่งและวิธีเดินทาง | ARUN SA WAD",
  description: "ตำแหน่งโรงแรมอรุณสวัสดิ์ใจกลางเยาวราช พร้อมวิธีเดินทางและสถานที่ใกล้เคียง",
};

export default function LocationPage() {
  return <LocationContent mapSection={<LocationMapSection />} />;
}
