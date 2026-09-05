import { create } from "zustand";
import type { CreateNoteParams } from "../api";
import { persist } from "zustand/middleware";

interface NoteDraftStore {
  draft: CreateNoteParams;
  setDraft: (note: CreateNoteParams) => void;
  clearDraft: () => void;
}

const initialDraft: CreateNoteParams = {
  title: "",
  content: "",
  tag: "Todo",
};

export const useNoteStore = create<NoteDraftStore>()(
  persist(
    set => ({
      draft: initialDraft,
      setDraft: note => set(() => ({ draft: note })),
      clearDraft: () => set(() => ({ draft: initialDraft })),
    }),
    {
      // Ключ у localStorage
      name: "note-draft",
      // Зберігаємо лише властивість draft
      partialize: state => ({ draft: state.draft }),
    }
  )
);
