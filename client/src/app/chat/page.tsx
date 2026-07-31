"use client";

import { useState,useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { jsPDF } from "jspdf";
import toast from "react-hot-toast";
import MessageBubble from "@/components/chat/MessageBubble";

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

  const [listening, setListening] = useState(false);
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

const copyMessage = async (text: string) => {
  await navigator.clipboard.writeText(text);
  toast.success("Copied to Clipboard 📋");
};


const exportChat = () => {
  const doc = new jsPDF();

  let y = 20;

  doc.setFontSize(18);
  doc.text("DevFlow AI Chat", 20, y);

  y += 15;

  messages.forEach((msg) => {
    const role =
      msg.role === "user"
        ? "You"
        : "DevFlow AI";

    const lines = doc.splitTextToSize(
      `${role}: ${msg.content}`,
      170
    );

    doc.text(lines, 20, y);

    y += lines.length * 8 + 8;

    // New page if needed
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  });

  doc.save("DevFlowAI-Chat.pdf");

  toast.success("PDF Downloaded 📄");
};


const startListening = () => {
  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    toast.error("Speech Recognition is not supported in this browser");
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  setListening(true);

  recognition.start();

  recognition.onresult = (event: any) => {
    const text = event.results[0][0].transcript;
    setPrompt(text);
    setListening(false);
  };

  recognition.onerror = () => {
    setListening(false);
    toast.error("Voice Recognition Failed");
  };

  recognition.onend = () => {
    setListening(false);
  };
};
  

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

    <div className="flex-1 flex flex-col text-white bg-gradient-to-br from-black via-zinc-950  to-blue-950">

      <div className="flex-1 overflow-y-auto p-6">


{messages.length === 0 && (
  <div className="flex flex-col items-center justify-center h-[75vh] text-center">

    <div className="text-7xl animate-bounce">
      🤖
    </div>

    <h1 className="text-5xl font-bold mt-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
      DevFlow AI
    </h1>

    <p className="text-gray-400 mt-4 max-w-xl">
      Ask coding questions, generate code, debug errors,
      prepare for interviews and much more.
    </p>

    <div className="grid grid-cols-2 gap-4 mt-10">

      {[
        "Explain Binary Search",
        "React Interview Questions",
        "Generate Express API",
        "SQL Queries",
      ].map((item) => (
        <button
          key={item}
          onClick={() => setPrompt(item)}
          className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-xl p-4 transition"
        >
          {item}
        </button>
      ))}

    </div>

  </div>
)}

        {messages.map((msg, index) => (
  <MessageBubble
    key={index}
    role={msg.role}
    content={msg.content}
  />
))}


        {streamingText && (
  <div className="bg-zinc-800 p-5 rounded-2xl mt-5">
    <div className="font-semibold mb-2">
      🤖 DevFlow AI
    </div>

    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {streamingText}
    </ReactMarkdown>

    <span className="animate-pulse text-blue-400">
  ▋
</span>
  </div>
)}

        <div ref={messagesEndRef}></div>

       {loading && (
  <div className="flex items-center gap-3 text-gray-300 mt-4">

    <div className="text-2xl">
      🤖
    </div>

    <div className="bg-zinc-800 px-4 py-3 rounded-2xl flex gap-2">

      <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></span>

      <span
        className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
        style={{ animationDelay: "0.2s" }}
      ></span>

      <span
        className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
        style={{ animationDelay: "0.4s" }}
      ></span>

    </div>

  </div>
)}

      </div>


      <div className="flex justify-end mb-4">
  <button
    onClick={exportChat}
    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl"
  >
    📄 Export PDF
  </button>
</div>

      <div className="border-t border-zinc-800 p-5 flex gap-4">

        <textarea
  value={prompt}
  onChange={(e) => {
    setPrompt(e.target.value);

    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  }}
  onKeyDown={(e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendPrompt();
    }
  }}
  rows={1}
  placeholder="Ask anything..."
  className="flex-1 resize-none overflow-hidden bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition"
/>

<button
  onClick={startListening}
  className={`px-5 rounded-2xl transition ${
    listening
      ? "bg-red-600"
      : "bg-zinc-700 hover:bg-zinc-600"
  }`}
>
  {listening ? "🎙️" : "🎤"}
</button>


        <button
  onClick={sendPrompt}
  disabled={loading}
  className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-8 rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl"
>
  {loading ? "Thinking..." : " 🚀 Send"}
</button>

      </div>

    </div>

  </div>
);
}