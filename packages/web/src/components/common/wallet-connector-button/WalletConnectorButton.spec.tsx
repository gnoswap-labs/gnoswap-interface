import WalletConnectorButton from "./WalletConnectorButton";
import { render } from "@testing-library/react";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { Provider as JotaiProvider } from "jotai";

describe("WalletConnectorButton Component", () => {
  it("WalletConnectorButton render", () => {
    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <WalletConnectorButton
            connected={false}
            account={null}
            connectAdenaClient={() => { }}
            disconnectWallet={() => { }}
          />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
