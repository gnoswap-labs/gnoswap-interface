import SettingMenuModal from "./SettingMenuModal";
import { fireEvent, render, screen } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";

describe("SettingMenuModal Component", () => {
  it("should render", () => {
    const mockProps = {
      slippage: 0,
      changeSlippage: () => null,
      close: () => null,
    };
    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <SettingMenuModal {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });

  it("saves no more than the given maximum", () => {
    const changeSlippage = jest.fn();
    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <SettingMenuModal slippage={0.5} changeSlippage={changeSlippage} close={() => null} maxSlippage={10} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );

    const input = screen.getByPlaceholderText("0");
    fireEvent.change(input, { target: { value: "30" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(changeSlippage).toHaveBeenLastCalledWith(10);
  });

  it("restores zero with Auto for Limit instead of the shared swap tolerance", () => {
    const changeSlippage = jest.fn();
    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <SettingMenuModal slippage={1} defaultSlippage={0} changeSlippage={changeSlippage} close={() => null} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );

    const input = screen.getByPlaceholderText("0");
    fireEvent.click(screen.getByRole("button"));
    expect(input).toHaveValue("0");
    fireEvent.keyDown(input, { key: "Enter" });
    expect(changeSlippage).toHaveBeenLastCalledWith(0);
  });
});
