import { HomeMapSection } from "./HomeMapSection";
import { HomeContent } from "./HomeContent";

export default function HomePage() {
  return <HomeContent mapSection={<HomeMapSection />} />;
}
