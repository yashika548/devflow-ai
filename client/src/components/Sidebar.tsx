"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/services/api";
import { useChatSessionStore } from "@/store/chatSessionStore";
import { useChatStore } from "@/store/chatStore";
import toast from "react-hot-toast";

interface Chat {
  _id: string;
  title: string;
}

export default function Sidebar() {
  const [chats, setChats] = useState<Chat[]>([]);

  const [totalMessages, setTotalMessages] = useState(0);

  const [search, setSearch] = useState("");
  const [deleteChatId, setDeleteChatId] = useState<string | null>(null);

  const router = useRouter();
  const [user, setUser] = useState({
  name: "",
  email: "",
});

  const { chatId, setChatId } = useChatSessionStore();
  const { clearMessages } = useChatStore();

  

  

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        setUser({
        name: storedUser.name || "",
        email: storedUser.email || "",
      });
        const res = await api.get(`/chat/user/${storedUser._id}`);

        setChats(res.data.chats);

        let count = 0;

        res.data.chats.forEach((chat: any) => {
        count += chat.messages?.length || 0;
        });

        setTotalMessages(count);
      } catch (error) {
        console.log(error);
      }
    };

    fetchChats();
  }, [chatId]);



  
  const deleteChat = async (id: string) => {
  try {
    await api.delete(`/chat/${id}`);

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const res = await api.get(`/chat/user/${user._id}`);
    setChats(res.data.chats);

    if (chatId === id) {
      clearMessages();
      setChatId("");

      toast.success("Chat Deleted 🗑️");
    }
  } catch (error) {
    console.log(error);
    toast.error("Delete Failed");
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

     toast.success("Chat Renamed ✨");

  } catch (error) {
    console.log(error);

    toast.error("Rename Failed");
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

    toast.success("New Chat Created 🚀");

  } catch (error) {
    console.log(error);
  }
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  clearMessages();
  setChatId("");

  toast.success("Logged Out");

setTimeout(() => {
  router.push("/login");
}, 600);
};

  return (
  <div className="w-72 h-screen bg-zinc-950 text-white p-5 flex flex-col border-r border-zinc-800">
   <div className="flex items-center gap-3 mb-5">

  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-2xl shadow-lg">

    🤖

  </div>

  <div>

    <h1 className="text-2xl font-bold">
      DevFlow AI
    </h1>

    <p className="text-xs text-gray-400">
      Your Coding Assistant
    </p>

  </div>

</div>                              


    <div className="bg-zinc-800 rounded-2xl p-4 mt-5">

  <div className="flex items-center gap-3">

    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-xl font-bold">

      {user.name
        ? user.name.charAt(0).toUpperCase()
        : "U"}

    </div>

    <div>

      <p className="font-semibold text-white">
        {user.name}
      </p>

      <p className="text-xs text-gray-400">
        {user.email}
      </p>

    </div>

  </div>

</div>

    <button
      onClick={createNewChat}
      className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg"
    >
      ➕ New Chat
    </button>

    <input
      type="text"
      placeholder="🔍 Search chats..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full mt-5 p-3 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-blue-500 outline-none transition-all"
    />


    {/* 📊 Statistics Card */}
<div className="bg-gradient-to-r from-zinc-800 to-zinc-900 rounded-2xl p-4 mb-5 border border-zinc-700">

  <h3 className="font-semibold text-lg mb-3">
    📊 Statistics
  </h3>

  <div className="flex justify-between">

    <div className="text-center">

      <p className="text-2xl font-bold text-blue-400">
        {chats.length}
      </p>

      <p className="text-xs text-gray-400">
        Chats
      </p>

    </div>

    <div className="text-center">

      <p className="text-2xl font-bold text-green-400">
        {totalMessages}
      </p>

      <p className="text-xs text-gray-400">
        Messages
      </p>

    </div>

  </div>

</div>

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
            ? "bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg"
            : "bg-zinc-800 hover:bg-zinc-700 hover:scale-[1.02] transition-all duration-300"
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
                  onClick={() => setDeleteChatId(chat._id)}
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
      className="mt-5 bg-gradient-to-r from-red-600 to-pink-600 p-3 rounded-xl hover:scale-105 transition-all duration-300"
    >
      🚪 Logout
    </button>

    {deleteChatId && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div className="bg-zinc-900 p-6 rounded-xl w-96">
      <h2 className="text-xl font-bold mb-3">
        🗑️ Delete Chat
      </h2>

      <p className="text-gray-400 mb-6">
        This action cannot be undone.
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setDeleteChatId(null)}
          className="px-4 py-2 rounded-lg bg-zinc-700"
        >
          Cancel
        </button>

        <button
          onClick={() => {
          deleteChat(deleteChatId);
          setDeleteChatId(null);
          }}
          className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}
  </div>
);
}