import NotificationButton from "./NotificationButton";
import { render } from "@testing-library/react";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { RecoilRoot } from "recoil";

describe("NotificationButton Component", () => {
  it("Notification button", () => {
    render(
      <RecoilRoot>
        <GnoswapThemeProvider>
          <NotificationButton />
        </GnoswapThemeProvider>
      </RecoilRoot>,
    );
  });
});
