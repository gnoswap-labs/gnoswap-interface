import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";

import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { ActivityType } from "@repositories/dashboard";

import ActivityListHeader from "./ActivityListHeader";

describe("ActivityListHeader Component", () => {
  it("ActivityListHeader render", () => {
    const mockProps = {
      activityType: ActivityType.ALL,
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
