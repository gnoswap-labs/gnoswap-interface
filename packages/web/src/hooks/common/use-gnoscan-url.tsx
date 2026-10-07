import { useAtomValue } from "jotai";
import { useCallback, useMemo } from "react";

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

  const getGnoscanUrl = useCallback(
    (type: GnoscanDataType | "" = "", params = ""): string => {
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
    },
    [network.chainId, network.scannerUrl],
  );

  const getTxUrl = useCallback(
    (txHash: string) => {
      return getGnoscanUrl(GnoscanDataType.Transactions, `details?txhash=${encodeURIComponent(txHash)}`);
    },
    [getGnoscanUrl],
  );

  const getRealmUrl = useCallback(
    (realmPath: string) => {
      return getGnoscanUrl(GnoscanDataType.Realms, `details?path=${realmPath}`);
    },
    [getGnoscanUrl],
  );

  const getTokenUrl = useCallback(
    (tokenId: string) => {
      return getGnoscanUrl(GnoscanDataType.Tokens, `${tokenId}`);
    },
    [getGnoscanUrl],
  );

  const getAccountUrl = useCallback(
    (address: string) => {
      return getGnoscanUrl(GnoscanDataType.Account, `${address}`);
    },
    [getGnoscanUrl],
  );

  return useMemo(
    () => ({
      getGnoscanUrl,
      getTxUrl,
      getRealmUrl,
      getTokenUrl,
      getAccountUrl,
    }),
    [getAccountUrl, getGnoscanUrl, getRealmUrl, getTokenUrl, getTxUrl],
  );
};
