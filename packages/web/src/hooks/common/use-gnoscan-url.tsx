import { useAtomValue } from "jotai";

import { CommonState } from "@states/index";
import { GNOSCAN_OFFICIAL_CHAIN_IDS } from "@constants/environment.constant";

export enum GnoscanDataType {
  Blocks = "/blocks",
  Transactions = "/transactions",
  Realms = "/realms",
  Tokens = "/tokens",
  Account = "/account",
}

const TEMP_RPC_URL = "https%3A%2F%2Fdev.rpc.gnoswap.io";
const TEMP_INDEXER_URL = "https%3A%2F%2Findexer-gnoswap.in.onbloc.xyz";

export const useGnoscanUrl = () => {
  const network = useAtomValue(CommonState.network);

  const getGnoscanUrl = (type: GnoscanDataType | "" = "", params = ""): string => {
    const chainId = network.chainId || "";
    const baseUrl = network.scannerUrl || "";
    let chainParams = "";
    if (GNOSCAN_OFFICIAL_CHAIN_IDS.includes(chainId)) {
      chainParams = `chainId=${chainId}`;
    } else {
      chainParams = "type=custom";
      if (TEMP_RPC_URL) chainParams = chainParams.concat(`&rpcUrl=${TEMP_RPC_URL}`);
      if (TEMP_INDEXER_URL) chainParams = chainParams.concat(`&indexerUrl=${TEMP_INDEXER_URL}`);
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

  const getTokenUrl = (tokenId: string) => {
    return getGnoscanUrl(GnoscanDataType.Tokens, `${tokenId}`);
  };

  const getAccountUrl = (address: string) => {
    return getGnoscanUrl(GnoscanDataType.Account, `${address}`);
  };

  return {
    getGnoscanUrl,
    getTxUrl,
    getRealmUrl,
    getTokenUrl,
    getAccountUrl,
  };
};
