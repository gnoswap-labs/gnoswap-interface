import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";

import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { ActivityType } from "@repositories/dashboard";
import { DEVICE_TYPE } from "@styles/media";

import ActivityList from "./ActivityList";

const dummyTokenList = [
  {
    action: "Add GNOT and GNS",
    totalValue: "$12,090",
    tokenAmountOne: "100 ATOM",
    tokenAmountTwo: "19 GNS",
    account: "g129kua...ndsu12",
    time: "less than a minute ago",
    explorerUrl:
      "https://gnoscan.io/transactions/details?txhash=hNaBGE2oDb15Q08y68wpycjwwGaCcXcU2jnrRRfuUo0%3D",
  },
];

describe("ActivityList Component", () => {
  it("ActivityList render", () => {
    const mockProps = {
      activities: dummyTokenList,
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
