import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import WalletBalanceDetailInfo from "./WalletBalanceDetailInfo";

describe("WalletBalanceDetailInfo Component", () => {
  it("WalletBalanceDetailInfo render", () => {
    const mockProps = {
      connected: true,
      title: "Available Balance",
      value: "1.00%",
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <WalletBalanceDetailInfo {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
