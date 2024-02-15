import { NetworkModel } from "@models/common/network-model";
import { DEVICE_TYPE } from "@styles/media";
import { atom } from "jotai";
import { DEFAULT_SLIPPAGE } from "@constants/option.constant";

interface HeaderToggleProps {
  walletConnect: boolean;
  notification: boolean;
  showLanguage: boolean;
}

export const headerToggle = atom<HeaderToggleProps>({
  walletConnect: false,
  notification: false,
  showLanguage: false,
});

export const openedModal = atom<boolean>(false);

export const openedTransactionModal = atom<boolean>(false);

export const modalContent = atom<React.ReactNode | null>(null);

export const transactionModalContent = atom<React.ReactNode | null>(null);

export const breakpoint = atom<DEVICE_TYPE>(DEVICE_TYPE.WEB);

export const currentWidth = atom<number>(0);

export const network = atom<NetworkModel | null>(null);

export const slippage = atom<string>(DEFAULT_SLIPPAGE);

export type TransactionConfirmStatus =
  | "loading"
  | "rejected"
  | "success"
  | "error";

export const transactionModalData = atom<{
  status: TransactionConfirmStatus;
  description: string | null;
  scannerURL: string | null;
  callback?: () => void;
} | null>(null);

export const GNOSWAP_SESSION_ID_KEY = "session_id";
export const ACCOUNT_SESSION_INFO_KEY = "account_info";
export const GNOWSWAP_CONNECTED_KEY = "connected-wallet";

export const sessionId = atom<string>("");
