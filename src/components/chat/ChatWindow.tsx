"use client";

import { useState, useRef, useEffect } from "react";
import { Send, X, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChat } from "@/hooks/useChat";
import { ChatMessage } from "./ChatMessage";

const QUICK_ACTIONS = [
  { label: "ดูห้องว่าง", message: "มีห้องว่างไหม ราคาเท่าไหร่บ้าง?" },
  { label: "ราคาทัวร์", message: "มีทัวร์อะไรบ้าง ราคาเท่าไหร่?" },
  { label: "วิธีเดินทาง", message: "จะเดินทางไปโรงแรมได้อย่างไร?" },
  { label: "ติดต่อโรงแรม", message: "ขอข้อมูลติดต่อโรงแรมหน่อย" },
];

export function ChatWindow() {
  const { messages, isLoading, sendMessage, clearHistory, toggleChat } =
    useChat();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    setInput("");
    await sendMessage(trimmed);
  };

  const handleQuickAction = async (message: string) => {
    if (isLoading) return;
    await sendMessage(message);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-primary text-primary-foreground rounded-t-xl">
        <div>
          <h3 className="font-semibold text-sm">ARUN Assistant</h3>
          <p className="text-xs opacity-80">ผู้ช่วยอัจฉริยะ พร้อมให้บริการ</p>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
              onClick={clearHistory}
              title="ล้างประวัติ"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
            onClick={toggleChat}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {messages.length === 0 ? (
          <div className="space-y-4">
            {/* Welcome message */}
            <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm max-w-[85%]">
              <p>
                สวัสดีค่ะ! ยินดีต้อนรับสู่ <strong>ARUN SA WAD</strong>{" "}
                มีอะไรให้ช่วยคะ?
              </p>
            </div>
            {/* Quick actions */}
            <div className="flex flex-wrap gap-2">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.label}
                  onClick={() => handleQuickAction(action.message)}
                  className="text-xs border rounded-full px-3 py-1.5 hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)
        )}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex justify-start mb-3">
            <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-2.5">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="พิมพ์ข้อความ..."
            className="flex-1 text-sm bg-muted rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-primary/20"
            disabled={isLoading}
            maxLength={1000}
          />
          <Button
            type="submit"
            size="icon"
            className="h-9 w-9 rounded-full shrink-0"
            disabled={!input.trim() || isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
