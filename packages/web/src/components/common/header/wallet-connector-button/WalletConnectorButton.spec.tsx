import WalletConnectorButton from "./WalletConnectorButton";
import { render } from "@testing-library/react";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { Provider as JotaiProvider } from "jotai";
import { DEVICE_TYPE } from "@styles/media";

jest.mock("@adena-wallet/sdk", () => ({
  makeMsgCallMessage: jest.fn(),
  makeMsgSendMessage: jest.fn(),
  TransactionBuilder: jest.fn(),
}));

describe("WalletConnectorButton Component", () => {
  it("WalletConnectorButton render", () => {
    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <WalletConnectorButton
            connected={false}
            account={null}
            breakpoint={DEVICE_TYPE.WEB}
            connectAdenaClient={() => {}}
            themeKey="dark"
            disconnectWallet={() => {}}
            switchNetwork={() => {}}
            isSwitchNetwork={false}
            loadingConnect=""
            walletType={{ type: null, socialType: null }}
            displayAddress=""
            resetWeb3authSession={() => {}}
          />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
