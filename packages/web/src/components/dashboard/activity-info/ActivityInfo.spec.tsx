import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import ActivityInfo from "./ActivityInfo";

describe("ActivityInfo Component", () => {
  it("ActivityInfo render", () => {
    const mockProps = {
      item: {
        action: "IBC Deposit ATOM",
        totalValue: "$12,090",
        tokenAmountOne: "100 ATOM",
        tokenAmountTwo: "19 GNOS",
        account: "g129kua...ndsu12",
        time: "less than a minute ago",
      },
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
