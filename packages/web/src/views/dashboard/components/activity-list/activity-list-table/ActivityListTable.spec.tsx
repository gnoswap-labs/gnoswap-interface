import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";

import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { dummyActivityData } from "@repositories/activity/responses/activity-responses";
import { DEVICE_TYPE } from "@styles/media";

import ActivityListTable from "./ActivityListTable";

const dummyTokenList = [dummyActivityData];

describe("ActivityListTable Component", () => {
  it("ActivityListTable render", () => {
    const mockProps = {
      activities: dummyTokenList,
      isFetched: true,
      isSortOption: () => true,
      breakpoint: DEVICE_TYPE.WEB,
      sort: () => {
        return;
      },
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <ActivityListTable {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
