import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import IncentivizedPoolCardList from "@components/earn/incentivized-pool-card-list/IncentivizedPoolCardList";
import { ValuesType } from "utility-types";
import useRouter from "@hooks/common/use-custom-router";
import { useAtomValue } from "jotai";
import { ThemeState } from "@states/index";
import { useWindowSize } from "@hooks/common/use-window-size";
import { usePositionData } from "@hooks/common/use-position-data";
import { useIncentivizePool } from "@hooks/pool/use-incentivize-pool";

export interface PoolListProps {
  logo: string[];
  name: string[];
  fee: string;
  liquidity: string;
  apr: string;
  volume24h: string;
  fees24h: string;
  currentTick: string;
}

export const POOL_CONTENT_TITLE = {
  TVL: "TVL",
  LIQUIDITY: "Liquidity",
  APR: "APR",
  VOLUME: "Trading Volume (24h)",
  FEE: "Fees (24h)",
} as const;

export type POOL_CONTENT_TITLE = ValuesType<typeof POOL_CONTENT_TITLE>;

const IncentivizedPoolCardListContainer: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [page, setPage] = useState(1);
  const router = useRouter();
  const [mobile, setMobile] = useState(false);
  const {
    data: incentivizePools = [],
    isFetched: isFetchedPools,
    isLoading: isLoadingPool,
  } = useIncentivizePool();
  const themeKey = useAtomValue(ThemeState.themeKey);
  const divRef = useRef<HTMLDivElement | null>(null);
  const { width } = useWindowSize();
  const { loading: isLoadingPosition, checkStakedPool } = usePositionData();

  const handleResize = () => {
    if (typeof window !== "undefined") {
      window.innerWidth < 920 ? setMobile(true) : setMobile(false);
    }
  };
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const loadMore = useMemo(() => {
    return incentivizePools.length > page * 8;
  }, [incentivizePools.length, page]);

  const routeItem = (id: string) => {
    router.push(`/earn/pool/${id}`);
  };

  const handleClickLoadMore = useCallback(() => {
    if (page === 1) {
      setPage(prev => prev + 1);
    } else {
      setPage(1);
    }
  }, [page]);

  const handleScroll = () => {
    if (divRef.current) {
      const itemGap = 12;
      const parentWidth = divRef.current.clientWidth;
      const children = divRef.current.children;
      const listChildWidth = divRef.current.children[0].clientWidth;
      const childrenLength = incentivizePools.length;

      const totalItemWidth = childrenLength * listChildWidth;
      const totalGapWidth = itemGap * (childrenLength - 1);

      const maxScrollWidth = totalItemWidth + totalGapWidth - parentWidth;
      const currentScrollX = divRef.current.scrollLeft;

      const maybeNextDisplayIndex =
        Math.floor(currentScrollX / (listChildWidth + itemGap)) + 2;

      const centerScreenX = document.body.clientWidth / 2;

      if (currentScrollX === 0) {
        setCurrentIndex(1);
        return;
      }

      if (maxScrollWidth === currentScrollX) {
        setCurrentIndex(childrenLength);
        return;
      }

      const getLengthFromElementCenterToScreenCenter = (
        element: Element | null,
      ) => {
        if (element)
          return Math.abs(
            element?.getBoundingClientRect().x +
              listChildWidth / 2 -
              centerScreenX,
          );

        return 0;
      };

      const checkValidElement = (index: number) => {
        if (index < childrenLength) {
          return children[index];
        }
        return null;
      };

      if (childrenLength >= 3) {
        const maybeNextIndex = maybeNextDisplayIndex - 1;

        const previous1Element = checkValidElement(maybeNextIndex - 1);
        const currentElement = checkValidElement(maybeNextIndex);
        const next1Element = checkValidElement(maybeNextIndex + 1);

        const previousElementCenterXToScreenCenterX =
          getLengthFromElementCenterToScreenCenter(previous1Element);
        const currentElementCenterXToScreenCenterX =
          getLengthFromElementCenterToScreenCenter(currentElement);
        const nextElementCenterXToScreenCenterX =
          getLengthFromElementCenterToScreenCenter(next1Element);

        const minLength = Math.min(
          ...[
            previousElementCenterXToScreenCenterX,
            currentElementCenterXToScreenCenterX,
            nextElementCenterXToScreenCenterX,
          ],
        );

        switch (minLength) {
          case previousElementCenterXToScreenCenterX:
            setCurrentIndex(maybeNextDisplayIndex - 1);
            break;
          case nextElementCenterXToScreenCenterX:
            setCurrentIndex(maybeNextDisplayIndex + 1);
            break;
          case currentElementCenterXToScreenCenterX:
            setCurrentIndex(maybeNextDisplayIndex);
            break;
        }
      }
    }
  };

  const showPagination = useMemo(() => {
    if (width > 920) {
      return false;
    } else {
      return true;
    }
  }, [width]);

  return (
    <IncentivizedPoolCardList
      incentivizedPools={incentivizePools}
      isPoolFetched={isFetchedPools}
      loadMore={!!loadMore}
      onClickLoadMore={handleClickLoadMore}
      currentIndex={currentIndex}
      routeItem={routeItem}
      mobile={mobile}
      page={page}
      themeKey={themeKey}
      divRef={divRef}
      onScroll={handleScroll}
      showPagination={showPagination}
      width={width}
      isLoading={isLoadingPool || isLoadingPosition}
      checkStakedPool={checkStakedPool}
    />
  );
};

export default IncentivizedPoolCardListContainer;
