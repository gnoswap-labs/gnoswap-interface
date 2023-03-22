import { render } from "@testing-library/react";
import { RecoilRoot } from "recoil";
import GnoswapThemeProvider from "@/providers/gnoswap-theme-provider/GnoswapThemeProvider";
import WalletBalanceDetailInfo from "./WalletBalanceDetailInfo";

describe("WalletBalanceDetailInfo Component", () => {
  it("WalletBalanceDetailInfo render", () => {
    const mockProps = {
      connected: true,
      title: "Available Balance",
      value: "1.00%"
    };

    render(
      <RecoilRoot>
        <GnoswapThemeProvider>
          <WalletBalanceDetailInfo {...mockProps} />
        </GnoswapThemeProvider>
      </RecoilRoot>
    );
  });
});
