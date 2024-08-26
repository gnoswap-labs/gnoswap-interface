import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import DashboardInfoTitle from "./DashboardInfoTitle";
import { DEVICE_TYPE } from "@styles/media";

describe("DashboardInfoTitle Component", () => {
  it("DashboardInfoTitle render", () => {
    const mockProps = {
      dashboardTokenInfo: {
        gnosAmount: "$0.7425",
        gnotAmount: "$1.8852",
      },
      breakpoint: DEVICE_TYPE.WEB,
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <DashboardInfoTitle {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
