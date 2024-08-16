import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import ActivityListTable from "./ActivityListTable";
import { DEVICE_TYPE } from "@styles/media";

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
