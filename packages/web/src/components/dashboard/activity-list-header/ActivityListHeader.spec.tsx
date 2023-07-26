import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import ActivityListHeader from "./ActivityListHeader";
import { ACTIVITY_TYPE } from "@containers/dashboard-activities-container/DashboardActivitiesContainer";

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
