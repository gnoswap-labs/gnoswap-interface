import LoadMoreButton from "./LoadMoreButton";
import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";

describe("LoadMoreButton Component", () => {
  it("should render", () => {
    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <LoadMoreButton show={true} onClick={() => { }} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
