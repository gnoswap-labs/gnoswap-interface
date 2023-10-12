import { NetworkModel } from "@models/common/network-model";
import { DEVICE_TYPE } from "@styles/media";
import { atom } from "jotai";
import NetworkData from "@resources/chains.json";
import { atomWithStorage } from "jotai/utils";
import { DEFAULT_SLIPPAGE } from "@constants/option.constant";

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

export const network = atom<NetworkModel>(NetworkData[0]);

export const slippage = atomWithStorage<number>("slippage", DEFAULT_SLIPPAGE);
