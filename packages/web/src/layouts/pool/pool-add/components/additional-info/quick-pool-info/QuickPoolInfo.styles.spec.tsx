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
          <div className="pool-info" data-testid="pool-info">
            <div>
              <div className="label">Fee APR</div>
              <div className="value apr" data-testid="fee-apr">
                <span className="logo" />
                <span className="fee-apr-value">{feeApr}</span>
              </div>
            </div>
            <div>
              <div className="label">Staking APR</div>
              <div className="value apr" data-testid="staking-apr">
                <span className="logo" />
                <span className="staking-apr-value">
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
    [3284655.48, "3,284,655.48%"],
  ])("formats %p as %p", (value, expected) => {
    expect(formatRate(value)).toBe(expected);
  });
});

describe("QuickPoolInfoWrapper APR logo position", () => {
  // jsdom has no layout, so this pins the rules that keep the logos fixed:
  // the rows share one grid whose label column fits the widest (translated) label,
  // and each APR value area fills the second column with the rate pushed to its right edge.
  it("lays the rows out on a shared label column", async () => {
    renderAprValues(formatRate(99.99), formatRate(3284655.48));

    await waitFor(() => expect(screen.getByTestId("pool-info")).toBeInTheDocument());
    const poolInfo = screen.getByTestId("pool-info");

    expect(poolInfo).toHaveStyle({ display: "grid", "grid-template-columns": "auto 1fr" });
    Array.from(poolInfo.children).forEach(row => expect(row).toHaveStyle({ display: "contents" }));
  });

  it.each(["fee-apr", "staking-apr"])("anchors the %s logo regardless of the rate length", async testId => {
    renderAprValues(formatRate(99.99), formatRate(3284655.48));

    await waitFor(() => expect(screen.getByTestId(testId)).toBeInTheDocument());
    const value = screen.getByTestId(testId);

    expect(value).toHaveStyle({ "justify-self": "stretch", "justify-content": "space-between" });
  });
});
