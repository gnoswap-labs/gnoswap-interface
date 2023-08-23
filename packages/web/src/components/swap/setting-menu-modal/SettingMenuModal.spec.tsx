import SettingMenuModal from "./SettingMenuModal";
import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { RecentdummyToken } from "@containers/header-container/HeaderContainer";

describe("SettingMenuModal Component", () => {
  it("should render", () => {
    const mockProps = {
      onSettingMenu: () => null,
      tolerance: "",
      changeTolerance: () => null,
    };
    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <SettingMenuModal {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
