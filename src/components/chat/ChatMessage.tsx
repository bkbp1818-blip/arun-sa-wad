"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import type { ChatMessage as ChatMessageType } from "@/hooks/useChat";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
          isUser
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-muted rounded-bl-sm"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ href, children }) => {
                // Internal links use Next.js Link
                if (href?.startsWith("/")) {
                  return (
                    <Link
                      href={href}
                      className="text-primary underline font-medium"
                    >
                      {children}
                    </Link>
                  );
                }
                return (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    {children}
                  </a>
                );
              },
              p: ({ children }) => (
                <p className="mb-1 last:mb-0">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-4 mb-1">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-4 mb-1">{children}</ol>
              ),
              li: ({ children }) => <li className="mb-0.5">{children}</li>,
              strong: ({ children }) => (
                <strong className="font-semibold">{children}</strong>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}
