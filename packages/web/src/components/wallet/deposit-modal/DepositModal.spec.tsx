import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import DepositModal, { DEFAULT_DEPOSIT_GNOT } from "./DepositModal";
import { DEVICE_TYPE } from "@styles/media";
import GnoswapServiceProvider from "@providers/gnoswap-service-provider/GnoswapServiceProvider";

describe("DepositModal Component", () => {
  it("DepositModal render", () => {
    const mockProps = {
      breakpoint: DEVICE_TYPE.WEB,
      depositInfo: DEFAULT_DEPOSIT_GNOT,
      changeToken: () => null,
      close: () => null,
      callback: () => null,
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <GnoswapServiceProvider>
            <DepositModal {...mockProps} />
          </GnoswapServiceProvider>
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
