import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { ReferralTracker } from "@/components/shared/ReferralTracker";
import { ChatWidgetLoader } from "@/components/chat/ChatWidgetLoader";

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <ReferralTracker />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <ChatWidgetLoader />
    </div>
  );
}
