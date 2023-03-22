import { render } from "@testing-library/react";
import { RecoilRoot } from "recoil";
import GnoswapThemeProvider from "@/providers/gnoswap-theme-provider/GnoswapThemeProvider";
import WalletBalanceSummary from "./WalletBalanceSummary";

describe("WalletBalanceSummary Component", () => {
  it("WalletBalanceSummary render", () => {
    const mockProps = {
      connected: true,
      balanceSummaryInfo: {
        amount: "1,000.00",
        changeRate: "+1.10%",
      },
      deposit: () => null,
      withdraw: () => null,
      earn: () => null,
    };

    render(
      <RecoilRoot>
        <GnoswapThemeProvider>
          <WalletBalanceSummary {...mockProps} />
        </GnoswapThemeProvider>
      </RecoilRoot>
    );
  });
});
