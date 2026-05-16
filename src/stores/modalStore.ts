import { create } from "zustand";

import type { ModalPayload, ModalType } from "@/types/modal";

type ModalStore = {
  activeModal: ModalType | null;
  payload?: ModalPayload;
  openModal: (type: ModalType, payload?: ModalPayload) => void;
  closeModal: () => void;
};

export const useModalStore = create<ModalStore>((set) => ({
  activeModal: null,
  payload: undefined,
  openModal: (type, payload) => set({ activeModal: type, payload }),
  closeModal: () => set({ activeModal: null, payload: undefined }),
}));
