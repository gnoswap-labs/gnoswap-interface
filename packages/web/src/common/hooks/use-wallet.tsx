import { AccountAtom } from "@atoms/index";
import { isErrorResponse } from "@utils/validationUtils";
import { useAtom } from "jotai";
import { useState } from "react";
import { useGnoswapContext } from "./use-gnoswap-context";

export const useWallet = () => {
  const { accountService } = useGnoswapContext();

  const [connected, setConnected] = useAtom(AccountAtom.connected);
  const [address, setAddress] = useAtom(AccountAtom.address);
  const [error, setError] = useState(null);

  const connectWallet = () => {
    connectToEstablishedSite().then(connectToGetAccountInfo).catch(setError);
  };

  const connectToEstablishedSite = () => {
    return accountService.connectAdenaWallet().then(response => {
      if (isErrorResponse(response)) {
        setConnected(false);
        return;
      }
      setConnected(response.isConnected);
    });
  };

  const connectToGetAccountInfo = () => {
    return accountService.getAccountInfo().then(response => {
      if (isErrorResponse(response)) {
        setAddress("");
        return;
      }
      setAddress(response.address);
    });
  };

  const disconnectWallet = () => {
    setAddress(null);
    setConnected(false);
  };

  return {
    address,
    connected,
    connectWallet,
    disconnectWallet,
    error,
  };
};
