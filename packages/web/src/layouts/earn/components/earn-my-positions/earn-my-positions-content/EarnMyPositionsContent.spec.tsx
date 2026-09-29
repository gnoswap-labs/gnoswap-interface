import React from "react";
import { render, screen } from "@testing-library/react";

import EarnMyPositionsContent, { EarnMyPositionContentProps } from "./EarnMyPositionsContent";

jest.mock("./earn-my-positions-no-liquidity/EarnMyPositionNoLiquidity", () => ({
  __esModule: true,
  default: () => <div data-testid="no-liquidity" />,
}));

jest.mock("@components/common/my-position-card-list/MyPositionCardList", () => ({
  __esModule: true,
  default: () => <div data-testid="position-card-list" />,
}));

const emptyPositions = {
  ...({} as EarnMyPositionContentProps),
  connected: true,
  isOtherPosition: false,
  isSwitchNetwork: false,
  loading: false,
  positions: [],
  account: null,
  highestApr: 0,
};

describe("EarnMyPositionsContent", () => {
  it("does not claim the address is empty when the first request fails", () => {
    const { container } = render(<EarnMyPositionsContent {...emptyPositions} fetched={false} isError />);
    expect(container).toBeEmptyDOMElement();
  });

  it("retains a confirmed empty state when a background refresh fails", () => {
    render(<EarnMyPositionsContent {...emptyPositions} fetched isError />);
    expect(screen.getByTestId("no-liquidity")).toBeInTheDocument();
  });
});
