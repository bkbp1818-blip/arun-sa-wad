"use client";

import { MessageCircle, X } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { ChatWindow } from "./ChatWindow";

export function ChatWidget() {
  const { isOpen, toggleChat } = useChat();

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <>
          {/* Mobile: full screen */}
          <div className="fixed inset-0 z-50 bg-background flex flex-col md:hidden">
            <ChatWindow />
          </div>

          {/* Desktop: popup */}
          <div className="hidden md:flex fixed bottom-20 right-4 z-50 w-[380px] h-[520px] bg-background border rounded-xl shadow-2xl flex-col overflow-hidden">
            <ChatWindow />
          </div>
        </>
      )}

      {/* Floating Button */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-4 right-4 z-50 h-14 w-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? "bg-muted text-muted-foreground hidden md:flex"
            : "bg-primary text-primary-foreground hover:scale-105 animate-pulse hover:animate-none"
        }`}
        aria-label={isOpen ? "ปิดแชท" : "เปิดแชท"}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </button>
    </>
  );
}
