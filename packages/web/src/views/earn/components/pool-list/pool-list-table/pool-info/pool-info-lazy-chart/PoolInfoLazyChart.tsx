import React, { useEffect, useMemo, useRef, useState } from "react";

import PoolGraph from "@components/common/pool-graph/PoolGraph";
import { SkeletonItem } from "@components/common/table-skeleton/TableSkeleton.styles";
import { POOL_INFO, pulseSkeletonStyle } from "@constants/skeleton.constant";
import { cx } from "@emotion/css";
import { useTheme } from "@emotion/react";
import { PoolListInfo } from "@models/pool/info/pool-list-info";
import { useGetSimpleBinsByPath } from "@query/pools";

import { PoolInfoLazyChartWrapper } from "./PoolInfoLazyChart.styles";

export interface PoolInfoLazyChartProps {
  width: number;
  pool: PoolListInfo;
}

const SKELETON_OPTION = POOL_INFO.list[POOL_INFO.list.length - 1];

const PoolInfoLazyChart: React.FC<PoolInfoLazyChartProps> = ({
  pool,
  width,
}) => {
  const { tokenA, tokenB, price, currentTick } = pool;
  const { themeKey } = useTheme();

  const observerRef = useRef<HTMLDivElement | null>(null);
  const [display, setDisplay] = useState(false);

  const { data: bins } = useGetSimpleBinsByPath(pool.poolId, display);

  const isHideBar = useMemo(() => {
    if (!bins) {
      return true;
    }
    const isAllReserveZeroBin = bins.every(
      item =>
        Number(item.reserveTokenA) === 0 && Number(item.reserveTokenB) === 0,
    );
    return isAllReserveZeroBin;
  }, [bins]);

  const visibleSkeleton = useMemo(() => {
    return !display || !bins;
  }, [display, bins]);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    if (observerRef.current && !display) {
      observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setDisplay(true);
        }
      });

      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        (observer as IntersectionObserver | null)?.unobserve(
          // eslint-disable-next-line react-hooks/exhaustive-deps
          observerRef.current,
        );
      }
    };
  }, [display, observerRef, pool.poolId]);

  return (
    <PoolInfoLazyChartWrapper ref={observerRef}>
      {visibleSkeleton ? (
        <SkeletonItem
          className={cx({
            left: SKELETON_OPTION.left,
          })}
          tdWidth={width}
        >
          <span
            css={pulseSkeletonStyle({
              w: width,
              type: SKELETON_OPTION.type,
            })}
          />
        </SkeletonItem>
      ) : (
        <PoolGraph
          width={100}
          height={45}
          tokenA={tokenA}
          tokenB={tokenB}
          currentTick={currentTick}
          bins={bins ?? []}
          mouseover
          disabled={isHideBar}
          themeKey={themeKey}
          position="top"
          nextSpacing={false}
          poolPrice={Number(price)}
        />
      )}
    </PoolInfoLazyChartWrapper>
  );
};

export default PoolInfoLazyChart;
