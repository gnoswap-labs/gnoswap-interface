import { WalletState } from "@states/index";
import { useAtomValue } from "jotai";

export const useConnection = () => {
  const account = useAtomValue(WalletState.account);
  const connected = (account?.address?.length || 0) >= 1;

  return { connected };
};
