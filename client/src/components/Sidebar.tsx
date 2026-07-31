"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/services/api";
import { useChatSessionStore } from "@/store/chatSessionStore";
import { useChatStore } from "@/store/chatStore";

interface Chat {
  _id: string;
  title: string;
}

export default function Sidebar() {
  const [chats, setChats] = useState<Chat[]>([]);

  const [search, setSearch] = useState("");

  const router = useRouter();

  const { chatId, setChatId } = useChatSessionStore();
  const { clearMessages } = useChatStore();

  

  

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        const res = await api.get(`/chat/user/${user._id}`);

        setChats(res.data.chats);
      } catch (error) {
        console.log(error);
      }
    };

    fetchChats();
  }, [chatId]);



  
  const deleteChat = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this chat?")) {
  return;
}
  try {
    await api.delete(`/chat/${id}`);

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const res = await api.get(`/chat/user/${user._id}`);
    setChats(res.data.chats);

    if (chatId === id) {
      clearMessages();
      setChatId("");
    }
  } catch (error) {
    console.log(error);
  }
};



const renameChat = async (id: string) => {
  const title = window.prompt("Enter new chat title");

  if (!title) return;

  try {
    await api.put(`/chat/${id}/rename`, {
      title,
    });

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const res = await api.get(`/chat/user/${user._id}`);
    setChats(res.data.chats);
  } catch (error) {
    console.log(error);
  }
};

  const createNewChat = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const res = await api.post("/chat/create", {
      userId: user._id,
    });

    setChatId(res.data._id);
    clearMessages();

    // Sidebar refresh
    const chatsRes = await api.get(`/chat/user/${user._id}`);
    setChats(chatsRes.data.chats);

  } catch (error) {
    console.log(error);
  }
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  clearMessages();
  setChatId("");

  router.push("/login");
};

  return (
  <div className="w-72 h-screen bg-zinc-950 text-white p-5 flex flex-col border-r border-zinc-800">
    <h1 className="text-3xl font-bold text-center">
      🤖 DevFlow AI
    </h1>

    <button
      onClick={createNewChat}
      className="w-full mt-6 bg-blue-600 hover:bg-blue-700 p-3 rounded-xl"
    >
      ➕ New Chat
    </button>

    <input
      type="text"
      placeholder="🔍 Search chats..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full mt-5 p-3 rounded-xl bg-zinc-800 outline-none"
    />

    <div className="mt-6 flex-1 overflow-y-auto">
      <p className="text-gray-400 mb-3">Recent Chats</p>

      <div className="space-y-3">
        {chats
          .filter((chat) =>
            chat.title.toLowerCase().includes(search.toLowerCase())
          )
          .map((chat) => (
            <div
              key={chat._id}
              className={`rounded-xl p-3 ${
                chatId === chat._id
                  ? "bg-blue-600"
                  : "bg-zinc-800 hover:bg-zinc-700"
              }`}
            >
              <p
                onClick={() => setChatId(chat._id)}
                className="cursor-pointer truncate"
              >
                💬 {chat.title}
              </p>

              <div className="flex justify-end gap-3 mt-2">
                <button
                  onClick={() => renameChat(chat._id)}
                  className="hover:text-yellow-400"
                >
                  ✏️
                </button>

                <button
                  onClick={() => deleteChat(chat._id)}
                  className="hover:text-red-500"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}

        {chats.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            No chats yet 🚀
          </p>
        )}
      </div>
    </div>

    <button
      onClick={logout}
      className="mt-4 bg-red-600 hover:bg-red-700 p-3 rounded-xl"
    >
      🚪 Logout
    </button>
  </div>
);
}