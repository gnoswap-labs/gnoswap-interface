import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import SwapCardAutoRouter from "./SwapCardAutoRouter";

// Mock @adena-wallet/sdk
jest.mock("@adena-wallet/sdk", () => ({
  makeMsgCallMessage: jest.fn(),
  makeMsgSendMessage: jest.fn(),
  TransactionBuilder: jest.fn(),
}));

describe("SwapCard Component", () => {
  it("SwapCard render", () => {
    const mockProps = {
      swapRouteInfos: [],
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <SwapCardAutoRouter {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
