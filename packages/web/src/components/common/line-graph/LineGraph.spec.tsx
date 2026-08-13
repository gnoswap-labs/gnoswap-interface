import { render, waitFor } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import LineGraph, { LineGraphProps } from "./LineGraph";

describe("LineGraph Component", () => {
  it("LineGraph render", () => {
    const args: LineGraphProps = {
      color: "#FFFFFF",
      datas: [],
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <LineGraph {...args} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });

  it("renders a horizontal line for a single data point when requested", async () => {
    const args: LineGraphProps = {
      color: "#FFFFFF",
      datas: [{ value: "0.1", time: "2026-08-12T00:00:00.000Z" }],
      width: 400,
      height: 200,
      renderSinglePointAsLine: true,
    };

    const { container } = render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <LineGraph {...args} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );

    await waitFor(() => {
      const path = container.querySelector("path[stroke='#FFFFFF']");
      expect(path?.getAttribute("d")).toMatch(/^M [^,]+,[^ ]+ L [^,]+,[^ ]+$/);
    });
  });
});
