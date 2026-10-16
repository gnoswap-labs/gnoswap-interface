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

const renderList = (width: number, poolCount = 1) => {
  const props: IncentivizedPoolCardListProps = {
    incentivizedPools: Array.from({ length: poolCount }, () => pool),
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
  it.each([390, 920, 921, 1440])("renders only the actual pool at %ipx", width => {
    const track = renderList(width);
    expect(track?.children).toHaveLength(1);
  });

  it("does not fill the last desktop row when there are five pools", () => {
    const track = renderList(1440, 5);
    expect(track?.children).toHaveLength(5);
  });
});
