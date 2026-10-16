import { render } from "@testing-library/react";
import React from "react";

import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { IncentivizePoolCardInfoWithPriceGrade } from "@models/pool/info/pool-card-info";

import IncentivizedPoolCardList, { IncentivizedPoolCardListProps } from "./IncentivizedPoolCardList";

jest.mock("./incentivized-pool-card/IncentivizedPoolCard", () => ({
  __esModule: true,
  default: () => <div data-testid="pool-card" />,
}));

const pool = {} as IncentivizePoolCardInfoWithPriceGrade;

const renderList = (width: number) => {
  const props: IncentivizedPoolCardListProps = {
    incentivizedPools: [pool],
    loadMore: false,
    isPoolFetched: true,
    currentIndex: 1,
    routeItem: jest.fn(),
    mobile: width <= 920,
    page: 1,
    themeKey: "dark",
    divRef: React.createRef<HTMLDivElement>(),
    onScroll: jest.fn(),
    showPagination: width <= 920,
    width,
    isLoading: false,
  };

  render(
    <GnoswapThemeProvider>
      <IncentivizedPoolCardList {...props} />
    </GnoswapThemeProvider>,
  );
  return props.divRef.current;
};

describe("IncentivizedPoolCardList", () => {
  it.each([390, 920])("does not include blank cards in the scroll track at %ipx", width => {
    const track = renderList(width);
    expect(track?.children).toHaveLength(1);
  });

  it("keeps the three-column tablet grid filled above the carousel breakpoint", () => {
    const track = renderList(921);
    expect(track?.children).toHaveLength(3);
  });

  it("preserves desktop blank cards to fill the grid", () => {
    const track = renderList(1440);
    expect(track?.children).toHaveLength(4);
  });
});
