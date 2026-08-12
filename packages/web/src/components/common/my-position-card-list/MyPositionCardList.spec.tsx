import React from "react";
import { render, screen } from "@testing-library/react";

import MyPositionCardList from "./MyPositionCardList";
import { PoolPositionModel } from "@models/position/pool-position-model";

jest.mock("./MyPositionCardList.styles", () => ({
  CardListWrapper: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  BlankPositionCard: () => <div data-testid="blank-position-card" />,
}));

jest.mock("./my-position-card/MyPositionCard", () => ({
  __esModule: true,
  default: ({ position }: { position: PoolPositionModel }) => (
    <div data-testid="position-card">{position.lpTokenId}</div>
  ),
}));

jest.mock("../scroll-wrapper", () => {
  const HorizontalScrollWrapper = React.forwardRef<
    HTMLDivElement,
    { children: React.ReactNode; loading: boolean; onScroll?: () => void }
  >(({ children }, ref) => (
    <div data-testid="horizontal-scroll-wrapper" ref={ref}>
      {children}
    </div>
  ));
  HorizontalScrollWrapper.displayName = "HorizontalScrollWrapper";

  return { HorizontalScrollWrapper };
});

jest.mock("../pagination/Pagination", () => ({
  __esModule: true,
  default: () => <div data-testid="pagination" />,
}));

describe("MyPositionCardList", () => {
  it("fills only the current row on the last paginated page", () => {
    const positions = Array.from({ length: 3 }, (_, index) => ({
      lpTokenId: index + 1,
    })) as unknown as PoolPositionModel[];

    render(
      <MyPositionCardList
        isFetched
        isLoading={false}
        loadMore={false}
        positions={positions}
        currentIndex={1}
        maxDisplayCount={4}
        movePoolDetail={jest.fn()}
        mobile={false}
        showPositionIndicator={false}
        showLoadMore={false}
        width={1440}
        themeKey="light"
        tokenPrices={{}}
        currentPage={3}
        totalPage={3}
        movePage={jest.fn()}
        limit={20}
      />,
    );

    expect(screen.getAllByTestId("position-card")).toHaveLength(3);
    expect(screen.getAllByTestId("blank-position-card")).toHaveLength(1);
    expect(screen.getByTestId("pagination")).toBeInTheDocument();
  });
});
