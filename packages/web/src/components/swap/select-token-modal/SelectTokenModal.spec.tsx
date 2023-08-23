import SearchMenuModal from "./SelectTokenModal";
import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { coinList } from "@containers/swap-container/SwapContainer";

describe("SearchMenuModal Component", () => {
  it("should render", () => {
    const mockProps = {
      search: () => null,
      keyword: "",
      onSelectTokenModal: () => null,
      coinList: coinList(),
      changeToken: () => null,
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
