import { render, screen } from "@testing-library/react";
import { createInstance } from "i18next";
import { I18nextProvider } from "react-i18next";

import { STORY_DCA_ORDER_SUMMARY } from "@components/order/common/order-story-fixtures";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";

import enSwap from "../../../../public/locales/en/Swap.json";
import DcaOrderSentence from "./DcaOrderSentence";

const renderSentence = (summary = STORY_DCA_ORDER_SUMMARY) => {
  const i18n = createInstance();
  i18n.init({ lng: "en", initImmediate: false, resources: { en: { Swap: enSwap } } });

  return render(
    <I18nextProvider i18n={i18n}>
      <GnoswapThemeProvider>
        <DcaOrderSentence summary={summary} />
      </GnoswapThemeProvider>
    </I18nextProvider>,
  );
};

describe("DcaOrderSentence", () => {
  it.each([
    { amount: "1.079988", decimals: 6 },
    { amount: "1.079988123456789012", decimals: 18 },
  ])("shows the total input amount with $decimals token decimals", ({ amount, decimals }) => {
    renderSentence({
      ...STORY_DCA_ORDER_SUMMARY,
      inputToken: { ...STORY_DCA_ORDER_SUMMARY.inputToken, decimals },
      sellAmount: amount,
    });

    expect(screen.getByText(amount).closest(".token-label")).toHaveTextContent(`${amount}GNS`);
  });

  it("shows the actual deposit rather than the typed amount when rounds require rounding down", () => {
    renderSentence({
      ...STORY_DCA_ORDER_SUMMARY,
      sellAmount: "1",
      actualSellAmount: "0.999999",
      amountPerOrder: "0.333333",
      executionCount: 3,
    });

    expect(screen.getByText("0.999999").closest(".token-label")).toHaveTextContent("0.999999GNS");
  });
});
