"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface ChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  isLoading: boolean;
  toggleChat: () => void;
  sendMessage: (content: string) => Promise<void>;
  clearHistory: () => void;
}

export const useChat = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [],
      isOpen: false,
      isLoading: false,

      toggleChat: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      sendMessage: async (content: string) => {
        const userMessage: ChatMessage = {
          id: `user-${Date.now()}`,
          role: "user",
          content,
          timestamp: Date.now(),
        };

        set((state) => ({
          messages: [...state.messages, userMessage],
          isLoading: true,
        }));

        try {
          // Build history from existing messages (exclude system messages)
          const history = get()
            .messages.filter((m) => m.id !== userMessage.id)
            .map((m) => ({ role: m.role, content: m.content }));

          const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: content, history }),
          });

          const data = await response.json();

          const assistantMessage: ChatMessage = {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content: data.error || data.message,
            timestamp: Date.now(),
          };

          set((state) => ({
            messages: [...state.messages, assistantMessage],
            isLoading: false,
          }));
        } catch {
          const errorMessage: ChatMessage = {
            id: `error-${Date.now()}`,
            role: "assistant",
            content:
              "ขออภัย เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง",
            timestamp: Date.now(),
          };

          set((state) => ({
            messages: [...state.messages, errorMessage],
            isLoading: false,
          }));
        }
      },

      clearHistory: () => {
        set({ messages: [] });
      },
    }),
    {
      name: "arunsawad-chat",
      partialize: (state) => ({
        messages: state.messages,
      }),
      // Clear old messages (older than 1 hour)
      onRehydrateStorage: () => {
        return (state) => {
          if (state) {
            const oneHourAgo = Date.now() - 60 * 60 * 1000;
            state.messages = state.messages.filter(
              (m) => m.timestamp > oneHourAgo
            );
          }
        };
      },
    }
  )
);
