import NotificationButton from "./NotificationButton";
import { render } from "@testing-library/react";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { Provider as JotaiProvider } from "jotai";
import { DEVICE_TYPE } from "@styles/media";
import GnoswapServiceProvider from "@providers/gnoswap-service-provider/GnoswapServiceProvider";

describe("NotificationButton Component", () => {
  it("Notification button", () => {
    const mockProps = {
      breakpoint: DEVICE_TYPE.WEB,
    };

    render(
      <JotaiProvider>
        <GnoswapServiceProvider>
          <GnoswapThemeProvider>
            <NotificationButton {...mockProps} />
          </GnoswapThemeProvider>
        </GnoswapServiceProvider>
      </JotaiProvider>,
    );
  });
});
