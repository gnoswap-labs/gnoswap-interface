import {
  DEV_CHAIN_ID,
  DEV_GNOSCAN_URL,
  GNOSCAN_URL,
} from "@constants/environment.constant";
import { WalletState } from "@states/index";
import { useAtomValue } from "jotai";

export enum GnoscanDataType {
  Blocks = "/blocks",
  Transactions = "/transactions",
  Realms = "/realms",
  Tokens = "/tokens",
  Accounts = "/accounts",
}

const TEMP_RPC_URL = "https%3A%2F%2Fdev.rpc.gnoswap.io";
const TEMP_INDEXER_URL = "https%3A%2F%2Findexer-gnoswap.in.onbloc.xyz";

export const useGnoscanUrl = () => {
  const account = useAtomValue(WalletState.account);

  const getGnoscanUrl = (
    type: GnoscanDataType | "" = "",
    params = "",
  ): string => {
    const chainId = account?.chainId || "";
    const baseUrl = chainId === DEV_CHAIN_ID ? DEV_GNOSCAN_URL : GNOSCAN_URL;
    let chainParams = "";
    if (["portal-loop", "test3"].includes(chainId)) {
      chainParams = `chainId=${chainId}`;
    } else {
      chainParams = "type=custom";
      if (TEMP_RPC_URL)
        chainParams = chainParams.concat(`&rpcUrl=${TEMP_RPC_URL}`);
      if (TEMP_INDEXER_URL)
        chainParams = chainParams.concat(`&indexerUrl=${TEMP_INDEXER_URL}`);
    }
    chainParams = `${params?.includes("?") ? "&" : "?"}${chainParams}`;

    const targetUrl = `${baseUrl}${type || ""}/${params}${chainParams}`;

    return targetUrl;
  };

  const getTxUrl = (txHash: string) => {
    return getGnoscanUrl(GnoscanDataType.Transactions, `details?txhash=${txHash}`);
  };

  const getRealmUrl = (realmPath: string) => {
    return getGnoscanUrl(GnoscanDataType.Realms, `details?path=${realmPath}`);
  };

  const getTokenUrl = (tokenPath: string) => {
    return getGnoscanUrl(GnoscanDataType.Tokens, `${tokenPath}`);
  };

  const getAccountUrl = (address: string) => {
    return getGnoscanUrl(GnoscanDataType.Accounts, `${address}`);
  };

  return {
    getGnoscanUrl,
    getTxUrl,
    getRealmUrl,
    getTokenUrl,
    getAccountUrl,
  };
};
