import { readFileSync } from "fs";
import path from "path";

const readSource = (relativePath: string) => readFileSync(path.join(__dirname, relativePath), { encoding: "utf8" });

describe("earn token data optimization", () => {
  const priceOnlyConsumers = [
    "containers/earn-my-position-container/EarnMyPositionContainer.tsx",
    "containers/incentivized-pool-card-list-container/IncentivizedPoolCardListContainer.tsx",
    "containers/pool-list-container/PoolListContainer.tsx",
    "components/pool-list/pool-list-table/pool-info/PoolInfo.tsx",
    "../../components/common/pool-graph/PoolGraph.tsx",
  ];

  it("keeps price-only consumers off the full token data hook", () => {
    for (const relativePath of priceOnlyConsumers) {
      const source = readSource(relativePath);

      expect(source).toContain("useGetAllTokenPrices");
      expect(source).not.toContain("useTokenData");
    }
  });

  describe("bare useTokenData removal", () => {
    const bareRemoved = [
      "../../containers/trending-card-list-container/TrendingCardListContainer.tsx",
    ];

    it("removes bare useTokenData calls from consumers that did not destructure it", () => {
      for (const relativePath of bareRemoved) {
        const source = readSource(relativePath);

        expect(source).not.toContain("useTokenData");
      }
    });
  });

  describe("tokens-only consumers", () => {
    const tokensOnlyConsumers = [
      "../../layouts/swap/containers/swap-container/SwapContainer.tsx",
      "../../layouts/pool/pool-add/containers/additional-info-container/AdditionalInfoContainer.tsx",
      "../../layouts/pool/pool-add/components/additional-info/quick-pool-info/QuickPoolInfo.tsx",
      "../../layouts/pool/pool-incentivize/PoolIncentivize.tsx",
      "../../layouts/pool/pool-incentivize/components/pool-incentivize/incentive-creation-deposit/IncentiveCreationDeposit.tsx",
    ];

    it("uses useGetTokens instead of useTokenData", () => {
      for (const relativePath of tokensOnlyConsumers) {
        const source = readSource(relativePath);

        expect(source).toContain("useGetTokens");
        expect(source).not.toContain("useTokenData");
      }
    });
  });

  describe("token-prices-only consumers", () => {
    const pricesOnlyConsumers = [
      "../../layouts/pool/pool-detail/containers/pool-pair-information-container/PoolPairInformationContainer.tsx",
      "../../layouts/pool/pool-detail/components/staking/staking-content/staking-content-card/StakingContentCard.tsx",
      "../../layouts/pool/pool-stake/components/stake-position/select-stake-result/SelectStakeResult.tsx",
      "../../layouts/portfolio/containers/wallet-position-card-list-container/WalletPositionCardListContainer.tsx",
      "../../components/common/launchpad-modal/launchpad-claim-all-modal/launchpad-claim-amount-field/LaunchpadClaimAmountField.tsx",
    ];

    it("uses useGetAllTokenPrices instead of useTokenData", () => {
      for (const relativePath of pricesOnlyConsumers) {
        const source = readSource(relativePath);

        expect(source).toContain("useGetAllTokenPrices");
        expect(source).not.toContain("useTokenData");
      }
    });
  });

  describe("governance pricing consumers", () => {
    const governanceConsumers = [
      "../../layouts/governance/components/governance-summary/GovernanceSummary.tsx",
      "../../layouts/governance/components/my-delegation/MyDelegation.tsx",
    ];

    it("uses useTokenPricing instead of useTokenData", () => {
      for (const relativePath of governanceConsumers) {
        const source = readSource(relativePath);

        expect(source).toContain("useTokenPricing");
        expect(source).not.toContain("useTokenData");
      }
    });
  });

  describe("useLoading", () => {
    const loadingPaths = [
      "../../hooks/common/use-loading.tsx",
    ];

    it("uses useGetTokens and useGetAllTokenPrices directly instead of useTokenData", () => {
      for (const relativePath of loadingPaths) {
        const source = readSource(relativePath);

        expect(source).toContain("useGetTokens");
        expect(source).toContain("useGetAllTokenPrices");
        expect(source).not.toContain("useTokenData");
      }
    });
  });
});
