"use client";

import React, { useEffect, useRef, useState } from "react";

import { createMessage, getMessages } from "@/services/ai";
import { Message, User } from "@/constants/interfaces";
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import { getMe } from "@/services/user";
import Input from "@/components/form/ui/input/InputField";

export default function ChatBox() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await getMessages();
        setMessages(data);
        const user = await getMe();
        setUser(user);

        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };
    fetchMessages();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || loadingAI || !user) return;

    const tempUserMessage: Message = {
      id: Date.now(),
      content: message,
      role: user.role,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, tempUserMessage]);
    setMessage("");
    setLoadingAI(true);

    try {
      const { aiMessage } = await createMessage({ message });

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages((prev) => prev.filter((m) => m.id !== tempUserMessage.id));
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="p-4 md:p-6 flex flex-col items-center justify-between max-w-full">
      <div className="max-w-full sm:w-3/4 flex flex-col gap-5 mb-28">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={
              `${msg.role === "AI"
                ? "overflow-x-auto custom-scrollbar self-start w-full rounded-lg border appearance-none p-4 text-md shadow-theme-xs bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-transparent dark:text-white/90 dark:focus:border-brand-800"
                : "self-end max-w-[600px] rounded-lg border appearance-none p-4 text-md shadow-theme-xs bg-black/5 text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90 dark:focus:border-brand-800"
              }`
            }
          >
            <Markdown remarkPlugins={[remarkGfm]}>
              {msg.content}
            </Markdown>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="p-4 md:p-6 w-full sm:w-[65%] fixed bottom-0 gap-2"
      >
        <Input
          type="text"
          placeholder="Ask anything"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="h-[60px] bg-white"
          disabled={loadingAI}
        />
      </form>
    </div>
  );
}
