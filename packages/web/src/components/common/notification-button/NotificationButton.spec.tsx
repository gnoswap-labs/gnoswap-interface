import NotificationButton from "./NotificationButton";
import { render } from "@testing-library/react";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { Provider as JotaiProvider } from "jotai";

describe("NotificationButton Component", () => {
  it("Notification button", () => {
    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <NotificationButton />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
