import { render, screen } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";

import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";

import EarnDescription from "./EarnDescription";

jest.mock("react-i18next", () => ({
  Trans: ({ values }: { values: { apr: string } }) => <span>{values.apr}</span>,
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock("@components/common/icons/IconArrowRight", () => {
  const IconArrowRight = () => <span data-testid="arrow-right" />;
  return IconArrowRight;
});

const renderEarnDescription = () =>
  render(
    <JotaiProvider>
      <GnoswapThemeProvider>
        <EarnDescription
          highestAprInfo={{
            apr: 123,
            path: "gno.land/r/gnoland/wugnot:gno.land/r/gnoswap/gns:3000",
          }}
        />
      </GnoswapThemeProvider>
    </JotaiProvider>,
  );

describe("EarnDescription", () => {
  it("links the Go to Stake action to the stake position page", () => {
    renderEarnDescription();

    const stakeLink = screen.getByRole("link", { name: "Earn:earnInstruction.stake.goto" });

    expect(stakeLink).toHaveAttribute("href", "/earn/pool/stake");
  });
});
