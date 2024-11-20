import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";

import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { dummyActivityData } from "@repositories/activity/responses/activity-responses";

import ActivityInfo from "./ActivityInfo";

describe("ActivityInfo Component", () => {
  it("ActivityInfo render", () => {
    const mockProps = {
      item: dummyActivityData,
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <ActivityInfo {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
