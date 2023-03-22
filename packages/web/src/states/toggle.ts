import { atom } from "recoil";

interface HeaderToggleProps {
  walletConnect: boolean;
  notification: boolean;
}

export const headerToggle = atom<HeaderToggleProps>({
  key: "header/dropdown-toggle",
  default: {
    walletConnect: false,
    notification: false,
  },
});
