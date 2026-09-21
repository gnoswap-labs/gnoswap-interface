import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import SelectToken, { SelectTokenProps } from "./SelectToken";
import { DEVICE_TYPE } from "@styles/media";

jest.mock("@adena-wallet/sdk", () => ({
  makeMsgCallMessage: jest.fn(),
  makeMsgSendMessage: jest.fn(),
  TransactionBuilder: jest.fn(),
}));

describe("SelectToken Component", () => {
  it("SelectToken render", () => {
    const args: SelectTokenProps = {
      keyword: "",
      defaultTokens: [],
      tokens: [],
      tokenPrices: {},
      changeKeyword: () => {
        return;
      },
      changeToken: () => {
        return;
      },
      close: () => {
        return;
      },
      themeKey: "dark",
      breakpoint: DEVICE_TYPE.WEB,
      recents: [],
      isSwitchNetwork: false,
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <SelectToken {...args} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
