import { WalletState } from "@states/index";
import { useAtomValue } from "jotai";

export const useConnection = () => {
  const account = useAtomValue(WalletState.account);
  const conneted = (account?.address?.length || 0) >= 1;

  return { conneted };
};
