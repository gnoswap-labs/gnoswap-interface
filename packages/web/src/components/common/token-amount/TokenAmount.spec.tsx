import { TokenModel } from "@models/token/token-model";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import TokenAmount, { TokenAmountProps } from "./TokenAmount";

// Mock @adena-wallet/sdk
jest.mock("@adena-wallet/sdk", () => ({
  makeMsgCallMessage: jest.fn(),
  makeMsgSendMessage: jest.fn(),
  TransactionBuilder: jest.fn(),
}));

const token: TokenModel = {
  chainId: "dev",
  createdAt: "2023-10-10T08:48:46+09:00",
  name: "Gnoswap",
  address: "g1sqaft388ruvsseu97r04w4rr4szxkh4nn6xpax",
  path: "gno.land/r/gns",
  tokenId: "gno.land/r/gns.GNS",
  decimals: 4,
  symbol: "GNS",
  displaySymbol: "GNS",
  logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_gns.svg",
  type: "GRC20",
  priceID: "gno.land/r/gns",
};

describe("TokenAmount Component", () => {
  it("TokenAmount render", () => {
    const args: TokenAmountProps = {
      token,
      amount: "12,211",
      usdPrice: "",
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <TokenAmount {...args} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
