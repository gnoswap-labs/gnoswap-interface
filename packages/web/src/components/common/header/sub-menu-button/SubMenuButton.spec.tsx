import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import SubMenuButton from "./SubMenuButton";

jest.mock("@adena-wallet/sdk", () => ({
  makeMsgCallMessage: jest.fn(),
  makeMsgSendMessage: jest.fn(),
  TransactionBuilder: jest.fn(),
}));

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
      isCollapseNav: false,
      onSideMenuToggle: () => {
        return;
      },
      onNavigation: () => {
        return;
      },
      getNavigationPath: () => "",
      isBottomNav: false,
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
