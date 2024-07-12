import { NetworkModel } from "@models/common/network-model";
import NetworkJson from "@resources/chains.json";
import {
  DEFAULT_CHAIN_API_URL,
  DEFAULT_CHAIN_ID,
  DEFAULT_CHAIN_NAME,
  DEFAULT_CHAIN_ROUTER_URL,
  DEFAULT_CHAIN_RPC_URL,
  DEFAULT_CHAIN_SCANNER_URL,
  DEFAULT_CHAIN_WS_URL,
} from "./environment.constant";

const NetworkData: NetworkModel[] = [
  {
    name: DEFAULT_CHAIN_NAME,
    chainId: DEFAULT_CHAIN_ID,
    rpcUrl: DEFAULT_CHAIN_RPC_URL,
    wsUrl: DEFAULT_CHAIN_WS_URL,
    apiUrl: DEFAULT_CHAIN_API_URL,
    routerUrl: DEFAULT_CHAIN_ROUTER_URL,
    scannerUrl: DEFAULT_CHAIN_SCANNER_URL,
  },
  ...NetworkJson,
];

export { NetworkData };
