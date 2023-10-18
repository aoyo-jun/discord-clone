import { ChannelType, Server } from "@prisma/client";
import { create } from "zustand";

// Explanation on Zustand: https://refine.dev/blog/zustand-react-state/#getting-started-with-zustand

// This hook is used to control all modals

export type ModalType = "createServer" | "invite" | "editServer" | "members" | "createChannel" | "leaveServer" | "deleteServer";

interface ModalData {
    server?: Server;
    channelType?: ChannelType;
}

// Explanation on interface: https://www.typescriptlang.org/docs/handbook/interfaces.html
interface ModalStore {
    type: ModalType | null;
    // Checks if the modal is Open
    isOpen: boolean;
    // Potential items to send in a modal
    data: ModalData;
    // Directs what type of modal should be opened
    onOpen: (type: ModalType, data?: ModalData) => void;
    // Closes the modal
    onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
    // The type is null at first
    type: null,
    // Data prop empty by default
    data: {},
    // Is not open at first
    isOpen: false,
    // On open, it accepts a type, opens the modal and changes it's type according
    onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
    // On close, closes and resets the modal to null
    onClose: () => set({ type: null, isOpen: false })
}))