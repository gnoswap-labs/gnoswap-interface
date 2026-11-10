import { render } from "@testing-library/react";
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
  it("describes the per-round amount, pair, interval and rounds", () => {
    const { container } = renderSentence({ ...STORY_DCA_ORDER_SUMMARY, executionCount: 1000 });

    expect(container.querySelector(".sentence")).toHaveTextContent(
      "You’re selling 1,200GNS to buy GNOT at market price every 1 minute for 1,000 rounds.",
    );
  });

  it("shows the market price with its USD value", () => {
    const { container } = renderSentence();

    expect(container.querySelector(".market-price")).toHaveTextContent("Market price: 1 GNS = 1.04 GNOT ($1.04)");
  });
});
