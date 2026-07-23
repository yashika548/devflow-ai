"use client";

import { useState,useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";


import remarkGfm from "remark-gfm";
import { useChatSessionStore } from "@/store/chatSessionStore";
import api from "@/services/api";
import Sidebar from "@/components/Sidebar";
import { useChatStore } from "@/store/chatStore";


interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const {
  messages,
  addMessage,
  setMessages,
} = useChatStore();

const { chatId,setChatId } = useChatSessionStore();

useEffect(() => {
  if (chatId) return;

  const createChat = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (!user._id) return;

      const res = await api.post("/chat/create", {
        userId: user._id,
      });

      setChatId(res.data._id);
    } catch (error) {
      console.log(error);
    }
  };

  createChat();
}, [chatId]);



  

useEffect(() => {
     console.log("Current Chat ID:", chatId);
  const loadChat = async () => {
    if (!chatId) return;

    try {
      const res = await api.get(`/chat/${chatId}`);

      setMessages(res.data.chat.messages);
    } catch (error) {
      console.log(error);
    }
  };

  loadChat();
}, [chatId]);

useEffect(() => {
  messagesEndRef.current?.scrollIntoView({
    behavior: "smooth",
  });
}, [messages]);

  

  const sendPrompt = async () => {
    if (!prompt.trim()) return;

      console.log("Current Chat ID:", chatId);

    const userMessage: Message = {
      role: "user",
      content: prompt,
    };

    addMessage(userMessage);
    console.log("After User:", useChatStore.getState().messages);

    setLoading(true);


    try {
      const res = await api.post("/ai/generate", {
        chatId,
        prompt,
      });

       console.log("API Response:", res.data);

      const fullText = res.data.response;

setStreamingText("");

for (let i = 0; i < fullText.length; i++) {
  setStreamingText((prev) => prev + fullText[i]);

  await new Promise((resolve) => setTimeout(resolve, 10));
}

const aiMessage: Message = {
  role: "assistant",
  content: fullText,
};

addMessage(aiMessage);
setMessages(res.data.chat.messages);
setStreamingText("");

      console.log("After AI:", useChatStore.getState().messages);
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }

    setPrompt("");
    setLoading(false);
  };
console.log("Current Messages:", messages);
  return (
  <div className="flex h-screen bg-zinc-950">

    <Sidebar />

    <div className="flex-1 flex flex-col text-white">

      <div className="flex-1 overflow-y-auto p-6">

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-5 ${
              msg.role === "user"
                ? "text-right"
                : "text-left"
            }`}
          >
            <div
              className={`inline-block p-4 rounded-xl max-w-2xl ${
                msg.role === "user"
                  ? "bg-blue-600"
                  : "bg-zinc-800"
              }`}
            >
              <div className="prose prose-invert max-w-none">
               <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.content}
                </ReactMarkdown>
              </div>   
            </div>
          </div>
        ))}


        {streamingText && (
  <div className="mb-5 text-left">
    <div className="inline-block p-4 rounded-xl max-w-2xl bg-zinc-800">
      
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {streamingText}
      </ReactMarkdown>
    </div>
  </div>
)}

        <div ref={messagesEndRef}></div>

        {loading && (
          <p className="text-gray-400">
            DevFlow AI is thinking...
          </p>
        )}

      </div>

      <div className="border-t border-zinc-800 p-5 flex gap-4">

        <input
  value={prompt}
  onChange={(e) => setPrompt(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      sendPrompt();
    }
  }}
  placeholder="Ask anything..."
  className="flex-1 bg-zinc-900 p-4 rounded-xl outline-none"
/>

        <button
  onClick={sendPrompt}
  disabled={loading}
  className="bg-blue-600 px-8 rounded-xl disabled:opacity-50"
>
  {loading ? "Thinking..." : "Send"}
</button>

      </div>

    </div>

  </div>
);
}