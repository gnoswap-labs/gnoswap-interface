import { Provider as JotaiProvider } from "jotai";
import { render } from "@testing-library/react";

import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { DEVICE_TYPE } from "@styles/media";

import WalletBalanceDetailInfo from "./WalletBalanceDetailInfo";

describe("WalletBalanceDetailInfo Component", () => {
  it("WalletBalanceDetailInfo render", () => {
    const mockProps = {
      title: "Available Balance",
      value: "1.00%",
      loading: true,
      breakpoint: DEVICE_TYPE.WEB,
      connected: false,
      isSwitchNetwork: false,
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
