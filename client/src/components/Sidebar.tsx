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
    <div className="w-72 bg-zinc-900 h-screen p-5 text-white">

      <h1 className="text-3xl font-bold">
        DevFlow AI
      </h1>

      <button onClick={createNewChat} className="w-full mt-8 bg-blue-600 p-3 rounded-lg">
        + New Chat
      </button>

      <button
  onClick={logout}
  className="w-full mt-3 bg-red-600 p-3 rounded-lg hover:bg-red-700"
>
  Logout
</button>


<input
  type="text"
  placeholder="Search chats..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="w-full p-2 rounded-lg bg-zinc-800 text-white mb-4 outline-none"
/>

      <div className="mt-10">

        <p className="text-gray-400 mb-4">
          Recent Chats
        </p>

        <div className="space-y-3">

          {chats
          .filter((chat) =>
          chat.title.toLowerCase().includes(search.toLowerCase()))
          .map((chat) => (
  <div
    key={chat._id}
    className="bg-zinc-800 rounded-lg p-3 flex justify-between items-center hover:bg-zinc-700"
  >
    <span
      onClick={() => setChatId(chat._id)}
      className="cursor-pointer flex-1"
    >
      {chat.title}
    </span>

    <button
      onClick={() => deleteChat(chat._id)}
      className="text-red-500 hover:text-red-700 ml-2"
    >
      🗑️
    </button>
  </div>
))}

        </div>

      </div>

      <button
  onClick={logout}
  className="w-full mt-6 bg-red-600 hover:bg-red-700 p-3 rounded-lg"
></button>

    </div>
  );
}