import { atom } from "jotai";

interface HeaderToggleProps {
  walletConnect: boolean;
  notification: boolean;
}

export const headerToggle = atom<HeaderToggleProps>({
  walletConnect: false,
  notification: false,
});
