jest.mock("@constants/environment.constant", () => ({
  DEFAULT_CHAIN_ID: "test-chain",
  GNS_TOKEN_PATH: "gns_token_path",
  PACKAGE_GOVERNANCE_PATH: "governance_path",
  PACKAGE_GOVERNANCE_STAKER_ADDRESS: "governance_staker_address",
  PACKAGE_GOVERNANCE_STAKER_PATH: "governance_staker_path",
  PACKAGE_LAUNCHPAD_PATH: "launchpad_path",
  WRAPPED_GNOT_PATH: "wrapped_gnot_path",
}));

import { WalletClient } from "@common/clients/wallet-client";
import { AdenaClient } from "@common/clients/wallet-client/adena/adena-client";
import { GovernanceRepositoryImpl } from "./governance-repository-impl";

const createWalletClient = () => {
  const walletClient: WalletClient = new AdenaClient();

  walletClient.getAddress = jest.fn().mockResolvedValue("caller");
  walletClient.getWalletType = jest.fn().mockReturnValue("ADENA");
  walletClient.addEstablishedSite = jest.fn().mockResolvedValue({
    code: 0,
    status: "success",
    type: "CONNECTION_SUCCESS",
    message: "connected",
    data: {},
  });
  walletClient.sendTransaction = jest.fn().mockResolvedValue({
    code: 0,
    status: "success",
    type: "TRANSACTION_SUCCESS",
    message: "sent",
    data: { hash: "hash" },
  });

  return walletClient;
};

describe("GovernanceRepositoryImpl", () => {
  describe("sendCollectReward", () => {
    it("sends only collect protocol fee when governance rewards are not claimed", async () => {
      const walletClient = createWalletClient();
      const governanceRepository = new GovernanceRepositoryImpl(null, walletClient, null);

      await governanceRepository.sendCollectReward(false, true);

      expect(walletClient.sendTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: [
            expect.objectContaining({
              caller: "caller",
              pkg_path: "launchpad_path",
              func: "CollectProtocolFee",
              args: [],
            }),
          ],
        }),
      );
    });

    it("sends both collect reward and collect protocol fee when both are claimed", async () => {
      const walletClient = createWalletClient();
      const governanceRepository = new GovernanceRepositoryImpl(null, walletClient, null);

      await governanceRepository.sendCollectReward(true, true);

      expect(walletClient.sendTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: [
            expect.objectContaining({
              caller: "caller",
              pkg_path: "governance_staker_path",
              func: "CollectReward",
              args: [],
            }),
            expect.objectContaining({
              caller: "caller",
              pkg_path: "launchpad_path",
              func: "CollectProtocolFee",
              args: [],
            }),
          ],
        }),
      );
    });
  });
});
