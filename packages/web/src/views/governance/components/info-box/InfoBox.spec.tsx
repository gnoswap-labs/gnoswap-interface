import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import InfoBox from "./InfoBox";

describe("InfoBox Component", () => {
  it("InfoBox render", () => {
    const mockProps = {
      title: "DefaultTooltip",
      value: "$1.10",
      tooltip: "Hello world",
      isLoading: false,
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <InfoBox {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>
    );
  });
});
