import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import ActivityList from "./ActivityList";
import {
  ACTIVITY_TYPE,
  dummyTokenList,
} from "@containers/dashboard-activities-container/DashboardActivitiesContainer";

describe("ActivityList Component", () => {
  it("ActivityList render", () => {
    const mockProps = {
      activities: dummyTokenList,
      isFetched: true,
      error: null,
      activityType: "All" as ACTIVITY_TYPE,
      changeActivityType: () => null,
      currentPage: 0,
      totalPage: 10,
      movePage: () => {},
      isSortOption: () => true,
      sort: () => {
        return;
      },
      sortOption: undefined,
    };
    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <ActivityList {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
