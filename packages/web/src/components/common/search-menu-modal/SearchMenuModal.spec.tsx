import SearchMenuModal from "./SearchMenuModal";
import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import {
  RecentdummyToken,
  PopulardummyToken,
} from "@containers/header-container/HeaderContainer";
import { DEVICE_TYPE } from "@styles/media";

describe("SearchMenuModal Component", () => {
  it("should render", () => {
    const mockProps = {
      onSideMenuToggle: () => null,
      onSearchMenuToggle: () => null,
      search: () => null,
      keyword: "",
      isFetched: true,
      placeholder: "Search",
      tokens: [],
      breakpoint: DEVICE_TYPE.WEB,
      mostLiquidity: [],
      popularTokens: [],
      recents: [],
    };
    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <SearchMenuModal {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
