import WalletConnector from "./WalletConnector";
import { render } from "@testing-library/react";
import GnoswapThemeProvider from "@/providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { RecoilRoot } from "recoil";

describe("WalletConnector Component", () => {
  it("WalletConnector render", () => {
    render(
      <RecoilRoot>
        <GnoswapThemeProvider>
          <WalletConnector isConnected={false} />
        </GnoswapThemeProvider>
      </RecoilRoot>,
    );
  });
});
