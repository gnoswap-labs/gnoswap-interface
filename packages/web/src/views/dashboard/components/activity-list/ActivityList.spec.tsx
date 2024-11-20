import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";

import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { dummyActivityData } from "@repositories/activity/responses/activity-responses";
import { ActivityType } from "@repositories/dashboard";
import { DEVICE_TYPE } from "@styles/media";

import ActivityList from "./ActivityList";

const dummyActivityList = [dummyActivityData];

describe("ActivityList Component", () => {
  it("ActivityList render", () => {
    const mockProps = {
      activities: dummyActivityList,
      isFetched: true,
      error: null,
      activityType: ActivityType.ALL,
      changeActivityType: () => null,
      currentPage: 0,
      totalPage: 10,
      movePage: () => {},
      isSortOption: () => true,
      breakpoint: DEVICE_TYPE.WEB,
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
