import { render, screen } from "@testing-library/react";
import { createInstance } from "i18next";
import { I18nextProvider } from "react-i18next";

import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";

import enSwap from "../../../../../../public/locales/en/Swap.json";
import LimitPriceWarning from "./LimitPriceWarning";

const i18n = createInstance();
i18n.init({ lng: "en", initImmediate: false, resources: { en: { Swap: enSwap } } });

const renderWarning = (value: string, marketPrice: string | null) =>
  render(
    <I18nextProvider i18n={i18n}>
      <GnoswapThemeProvider>
        <LimitPriceWarning value={value} marketPrice={marketPrice} />
      </GnoswapThemeProvider>
    </I18nextProvider>,
  );

describe("LimitPriceWarning", () => {
  it("warns when the trigger equals the market price", () => {
    renderWarning("100", "100");
    expect(screen.getByRole("status")).toHaveTextContent(i18n.t("Swap:limit.instantFillWarning"));
  });

  it("warns even when the trigger is far below the market price", () => {
    renderWarning("50", "100");
    expect(screen.getByRole("status")).toHaveTextContent(i18n.t("Swap:limit.belowMarketWarning"));
  });

  it.each([
    ["100.000001", "100"],
    ["100.5", "100"],
    ["101", "100"],
    ["101.000001", "100"],
    ["105", "100"],
    ["", "100"],
    ["0", "100"],
    ["-1", "100"],
    ["Infinity", "100"],
    ["100", null],
    ["100", "0"],
    ["100", "NaN"],
  ])("hides the warning for trigger %s and market %s", (value, marketPrice) => {
    renderWarning(value, marketPrice);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
