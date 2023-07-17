import { NetworkClient } from "@common/clients/network-client";
import { AxiosClient } from "@common/clients/network-client/axios-client";
import { RepositoryState } from "@states/index";
import { useAtom } from "jotai";

export const useNetworkClient = (): NetworkClient => {
  const [networkClient, setNetworkClient] = useAtom(RepositoryState.networkClient);

  function getNetworkClient() {
    if (!networkClient) {
      const createdNetworkClient = AxiosClient.createAxiosClient();
      setNetworkClient(createdNetworkClient);
      return createdNetworkClient;
    }
    return networkClient;
  }

  return getNetworkClient();
};
