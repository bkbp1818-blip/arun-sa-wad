import { prisma } from "@/lib/prisma";
import { ToursContent } from "./ToursContent";

export const dynamic = "force-dynamic";

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

  return <ToursContent tours={tours} />;
}
