import { Provider as JotaiProvider } from "jotai";
import { render, screen } from "@testing-library/react";

import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { DEVICE_TYPE } from "@styles/media";

import WalletBalanceDetailInfo from "./WalletBalanceDetailInfo";

const renderBalance = (value: string) =>
  render(
    <JotaiProvider>
      <GnoswapThemeProvider>
        <WalletBalanceDetailInfo
          title="Available Balance"
          value={value}
          loading={false}
          breakpoint={DEVICE_TYPE.WEB}
          connected
          isSwitchNetwork={false}
        />
      </GnoswapThemeProvider>
    </JotaiProvider>,
  );

describe("WalletBalanceDetailInfo", () => {
  it("shows unavailable data as a dash instead of zero", () => {
    renderBalance("-");
    expect(screen.getByText("-")).toBeInTheDocument();
    expect(screen.queryByText("$0")).not.toBeInTheDocument();
  });

  it("still shows a known zero balance as zero", () => {
    renderBalance("0");
    expect(screen.getByText("$0")).toBeInTheDocument();
  });
});
