import HeaderSideMenuModal from "./HeaderSideMenuModal";
import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { RecentdummyToken } from "@containers/header-container/HeaderContainer";

describe("HeaderSideMenuModal Component", () => {
  it("should render", () => {
    const mockProps = {
      onSideMenuToggle: () => null,
    };
    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <HeaderSideMenuModal {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
