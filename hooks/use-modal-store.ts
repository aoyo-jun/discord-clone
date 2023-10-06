import { create } from "zustand";

// Explanation on Zustand: https://refine.dev/blog/zustand-react-state/#getting-started-with-zustand

// This hook is used to control all modals

export type ModalType = "createServer";

// Explanation on interface: https://www.typescriptlang.org/docs/handbook/interfaces.html
interface ModalStore {
    type: ModalType | null;
    // Checks if the modal is Open
    isOpen: boolean;
    // Directs what type of modal should be opened
    onOpen: (type: ModalType) => void;
    // Closes the modal
    onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
    // The type is null at first
    type: null,
    // Is not open at first
    isOpen: false,
    // On open, it accepts a type, opens the modal and changes it's type according
    onOpen: (type) => set({ isOpen: true, type }),
    // On close, closes and resets the modal to null
    onClose: () => set({ type: null, isOpen: false })
}))