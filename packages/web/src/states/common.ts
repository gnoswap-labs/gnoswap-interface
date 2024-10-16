import { atomWithStorage } from "jotai/utils";
import { NetworkModel } from "@models/common/network-model";
import { DEVICE_TYPE } from "@styles/media";
import { atom } from "jotai";
import { DEFAULT_SLIPPAGE } from "@constants/option.constant";
import { NetworkData } from "@constants/chains.constant";

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

export const network = atom<NetworkModel>(NetworkData[0]);

export const slippage = atom<number>(DEFAULT_SLIPPAGE);

export type TransactionConfirmStatus =
  | "loading"
  | "rejected"
  | "success"
  | "error";

export const transactionModalData = atom<{
  status: TransactionConfirmStatus;
  description: string | null;
  txHash: string | null;
  callback?: () => void;
} | null>(null);

export const GNOSWAP_SESSION_ID_KEY = "session_id";
export const ACCOUNT_SESSION_INFO_KEY = "account_info";
export const GNOWSWAP_CONNECTED_KEY = "connected-wallet";

export const sessionId = atom<string>("");

export const NOTIFICATION_HASH = "notification_hash";

export const notificationHash = atomWithStorage<string>(NOTIFICATION_HASH, "");

export const pageScrollMap = atom<{ [key in string]: number }>({});

export const previousPageScroll = atom<{ page: string; height: number }>({
  page: "",
  height: 0,
});

export const unCommonTokenWarningStatus = atom<Array<string>>([]);

export const canScrollUpState = atom<boolean>(false);
export const currentSection = atom<string>("");
