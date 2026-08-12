import { render, screen } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import EarnMyPositionsHeader, { EarnMyPositionsHeaderProps } from "./EarnMyPositionsHeader";

describe("EarnMyPositionsHeader Component", () => {
  it("EarnMyPositionsHeader render", () => {
    const args: EarnMyPositionsHeaderProps = {
      connected: false,
      visiblePositions: true,
      positionLength: 0,
      hasClosedPositions: true,
      isSwitchNetwork: false,
      availableStake: false,
      moveEarnAdd: () => {
        return;
      },
      moveEarnStake: () => {
        return;
      },
      isClosed: false,
      handleChangeClosed: () => {
        return;
      },
      positions: [],
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <EarnMyPositionsHeader {...args} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });

  it("hides both closed-position switches when no closed position exists", () => {
    const args: EarnMyPositionsHeaderProps = {
      connected: true,
      visiblePositions: true,
      positionLength: 2,
      hasClosedPositions: false,
      isSwitchNetwork: false,
      availableStake: false,
      moveEarnAdd: jest.fn(),
      moveEarnStake: jest.fn(),
      isClosed: false,
      handleChangeClosed: jest.fn(),
      positions: [],
      onOpenVideoGuide: jest.fn(),
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <EarnMyPositionsHeader {...args} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );

    expect(screen.queryAllByRole("checkbox")).toHaveLength(0);
  });

  it("renders both desktop and mobile closed-position switches when a closed position exists", () => {
    const args: EarnMyPositionsHeaderProps = {
      connected: true,
      visiblePositions: true,
      positionLength: 2,
      hasClosedPositions: true,
      isSwitchNetwork: false,
      availableStake: false,
      moveEarnAdd: jest.fn(),
      moveEarnStake: jest.fn(),
      isClosed: false,
      handleChangeClosed: jest.fn(),
      positions: [],
      onOpenVideoGuide: jest.fn(),
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <EarnMyPositionsHeader {...args} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );

    expect(screen.getAllByRole("checkbox")).toHaveLength(2);
  });
});
