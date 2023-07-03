import { render } from "@testing-library/react";
import { RecoilRoot } from "recoil";
import GnoswapThemeProvider from "@/providers/gnoswap-theme-provider/GnoswapThemeProvider";
import WalletBalanceSummaryInfo from "./WalletBalanceSummaryInfo";

describe("WalletBalanceSummaryInfo Component", () => {
  it("WalletBalanceSummaryInfo render", () => {
    const mockProps = {
      balanceSummaryInfo: {
        amount: "1,000.00",
        changeRate: "+1.10%",
      },
    };

    render(
      <RecoilRoot>
        <GnoswapThemeProvider>
          <WalletBalanceSummaryInfo {...mockProps} />
        </GnoswapThemeProvider>
      </RecoilRoot>,
    );
  });
});
