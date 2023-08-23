import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import ActivityListTable from "./ActivityListTable";
import { dummyTokenList } from "@containers/dashboard-activities-container/DashboardActivitiesContainer";
import { DEVICE_TYPE } from "@styles/media";

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
