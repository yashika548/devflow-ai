"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import toast from "react-hot-toast";

interface Props {
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
}

export default function MessageBubble({
  role,
  content,
}: Props) {
  const copyMessage = async () => {
    await navigator.clipboard.writeText(content);
    toast.success("Copied 📋");
  };

  return (
    <div
  className={`mb-5 animate-[fadeIn_.3s_ease] ${
    role === "user"
      ? "text-right"
      : "text-left"
  }`}
>
      <div
        className={`inline-block p-5 rounded-2xl shadow-lg max-w-3xl ${
          role === "user"
            ? "bg-blue-600"
            : "bg-zinc-800"
        }`}
      >
        <div className="font-semibold mb-2">
          {role === "user"
            ? "👤 You"
            : "🤖 DevFlow AI"}
        </div>

        <div className="prose prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </div>

        {role === "assistant" && (
          <div className="flex justify-end mt-3">
            <button
              onClick={copyMessage}
              className="text-xs bg-zinc-700 hover:bg-zinc-600 px-3 py-1 rounded-lg"
            >
              📋 Copy
            </button>
          </div>
        )}

        <p className="text-[10px] text-gray-500 mt-2 text-right">
  {new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}
</p>
      </div>
    </div>
  );
}