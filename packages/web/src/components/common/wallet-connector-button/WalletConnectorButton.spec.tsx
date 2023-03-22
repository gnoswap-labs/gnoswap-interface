import WalletConnectorButton from "./WalletConnectorButton";
import { render } from "@testing-library/react";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { RecoilRoot } from "recoil";

describe("WalletConnectorButton Component", () => {
  it("WalletConnectorButton render", () => {
    render(
      <RecoilRoot>
        <GnoswapThemeProvider>
          <WalletConnectorButton isConnected={false} />
        </GnoswapThemeProvider>
      </RecoilRoot>,
    );
  });
});
