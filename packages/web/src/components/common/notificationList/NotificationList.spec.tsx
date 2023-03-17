import NotificationList from "./NotificationList";
import { render } from "@testing-library/react";
import { RecoilRoot } from "recoil";
import GnoswapThemeProvider from "@/providers/gnoswap-theme-provider/GnoswapThemeProvider";

describe("NotificationList Component", () => {
  it("should render", () => {
    render(
      <RecoilRoot>
        <GnoswapThemeProvider>
          <NotificationList />
        </GnoswapThemeProvider>
      </RecoilRoot>,
    );
  });
});
