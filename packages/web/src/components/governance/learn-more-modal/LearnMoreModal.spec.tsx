import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import LearnMoreModal from "./LearnMoreModal";

describe("LearnMoreModal Component", () => {
  it("LearnMoreModal render", () => {
    const mockProps = {};

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <LearnMoreModal {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
