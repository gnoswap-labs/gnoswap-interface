import { DEVICE_TYPE } from "@styles/media";
import { atom } from "jotai";

interface HeaderToggleProps {
  walletConnect: boolean;
  notification: boolean;
}

export const headerToggle = atom<HeaderToggleProps>({
  walletConnect: false,
  notification: false,
});

export const openedModal = atom<boolean>(false);

export const modalContent = atom<React.ReactNode | null>(null);

export const breakpoint = atom<DEVICE_TYPE>(DEVICE_TYPE.WEB);
