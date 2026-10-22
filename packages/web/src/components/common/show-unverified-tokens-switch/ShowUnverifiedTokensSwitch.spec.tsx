import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";

import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";

import ShowUnverifiedTokensSwitch from "./ShowUnverifiedTokensSwitch";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const renderSwitch = (props: Partial<React.ComponentProps<typeof ShowUnverifiedTokensSwitch>> = {}) =>
  render(
    <JotaiProvider>
      <GnoswapThemeProvider>
        <ShowUnverifiedTokensSwitch checked={false} onChange={jest.fn()} {...props} />
      </GnoswapThemeProvider>
    </JotaiProvider>,
  );

describe("ShowUnverifiedTokensSwitch", () => {
  it("renders the common translation and invokes onChange", () => {
    const onChange = jest.fn();
    renderSwitch({ onChange });

    const toggle = screen.getByLabelText("common:tokenList.showUnverifiedTokens");

    expect(toggle).not.toBeChecked();
    fireEvent.click(toggle);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("keeps the verification tooltip available with the compact mobile label", async () => {
    const originalWidth = window.innerWidth;
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 375 });
    try {
      const { container } = renderSwitch({ compact: true });

      expect(screen.getByLabelText("common:tokenList.unverified")).toBeInTheDocument();
      const trigger = container.querySelector(".base-tooltip-wrapper");
      expect(trigger?.querySelector("svg")).not.toBeNull();
      fireEvent.mouseEnter(trigger!);

      expect(await screen.findByText("common:tokenList.unverifiedTokensTooltip")).toBeInTheDocument();
    } finally {
      Object.defineProperty(window, "innerWidth", { configurable: true, value: originalWidth });
    }
  });
});
