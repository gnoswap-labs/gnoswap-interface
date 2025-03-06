import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import SubMenuButton from "./SubMenuButton";

// Mock @adena-wallet/sdk
jest.mock("@adena-wallet/sdk", () => ({
  makeMsgCallMessage: jest.fn(),
  makeMsgSendMessage: jest.fn(),
  TransactionBuilder: jest.fn(),
}));

// Mock the navigation hook
jest.mock("../../../../hooks/common/use-navigation", () => ({
  useNavigation: () => ({
    handleNavigation: jest.fn(),
    shouldOpenInNewTab: jest.fn(),
  }),
}));

describe("SubMenuButton Component", () => {
  it("SubMenuButton render", () => {
    const args = {
      sideMenuToggle: false,
      onSideMenuToggle: () => {
        return;
      },
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <SubMenuButton {...args} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
