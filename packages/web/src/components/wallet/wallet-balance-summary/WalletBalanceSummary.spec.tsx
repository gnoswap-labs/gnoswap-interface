import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import WalletBalanceSummary from "./WalletBalanceSummary";
import { DEVICE_TYPE } from "@styles/media";

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
      windowSize: 900,
      breakpoint: DEVICE_TYPE.WEB,
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <WalletBalanceSummary {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
