import "@testing-library/jest-dom";

import { render, screen, waitFor } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";

import IconStar from "@components/common/icons/IconStar";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { formatRate } from "@utils/new-number-utils";

import { QuickPoolInfoWrapper } from "./QuickPoolInfo.styles";

const renderAprValues = (feeApr: string, stakingApr: string) =>
  render(
    <JotaiProvider>
      <GnoswapThemeProvider>
        <QuickPoolInfoWrapper>
          <div className="pool-info">
            <div>
              <div className="label">Fee APR</div>
              <div className="value">
                <span className="fee-apr-value" data-testid="fee-apr">
                  {feeApr}
                </span>
              </div>
            </div>
            <div>
              <div className="label">Staking APR</div>
              <div className="value">
                <span className="staking-apr-value" data-testid="staking-apr">
                  <IconStar size={20} />
                  {stakingApr}
                </span>
              </div>
            </div>
          </div>
        </QuickPoolInfoWrapper>
      </GnoswapThemeProvider>
    </JotaiProvider>,
  );

describe("formatRate output length for APR values", () => {
  it.each([
    [0, "0%"],
    [0.001, "<0.01%"],
    [9.99, "9.99%"],
    [12.5, "12.50%"],
    [123.4, "123.40%"],
    [1234.5, "1,234.50%"],
  ])("formats %p as %p", (value, expected) => {
    expect(formatRate(value)).toBe(expected);
  });
});

describe("QuickPoolInfoWrapper APR value width", () => {
  // staking-apr renders the >100% state, where IconStar (20px) sits before the rate
  it.each(["fee-apr", "staking-apr"])("keeps %s width stable when the value changes", async testId => {
    renderAprValues(formatRate(99.99), formatRate(100));

    await waitFor(() => expect(screen.getByTestId(testId)).toBeInTheDocument());
    const value = screen.getByTestId(testId);

    // sanity: emotion styles are applied in jsdom
    expect(value).toHaveStyle({ "justify-content": "flex-end" });

    expect(value).toHaveStyle({ "font-variant-numeric": "tabular-nums" });
    expect(value).toHaveStyle({ "min-width": "calc(7.5ch + 20px)" });
  });
});
