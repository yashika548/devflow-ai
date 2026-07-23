import { create } from "zustand";

interface ChatSessionStore {
  chatId: string;
  setChatId: (id: string) => void;
}

export const useChatSessionStore = create<ChatSessionStore>((set) => ({
  chatId: "",
  setChatId: (id) => set({ chatId: id }),
}));