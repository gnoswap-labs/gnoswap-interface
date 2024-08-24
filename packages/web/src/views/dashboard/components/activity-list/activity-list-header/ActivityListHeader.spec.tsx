import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";

import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";

import ActivityListHeader, { ACTIVITY_TYPE } from "./ActivityListHeader";

describe("ActivityListHeader Component", () => {
  it("ActivityListHeader render", () => {
    const mockProps = {
      activityType: ACTIVITY_TYPE.ALL,
      changeActivityType: () => null,
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <ActivityListHeader {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
