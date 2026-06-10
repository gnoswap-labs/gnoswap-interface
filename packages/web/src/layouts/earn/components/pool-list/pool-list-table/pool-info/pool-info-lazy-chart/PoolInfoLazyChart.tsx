import React, { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { LIQUIDITY_GRAPH_BIN_COUNT, LIQUIDITY_GRAPH_DEFAULT_VISIBLE_TICK_RANGE } from "@constants/graph.constant";

import type { PoolGraphProps } from "@components/common/pool-graph/PoolGraph";
import { SkeletonItem } from "@components/common/table-skeleton/TableSkeleton.styles";
import { POOL_INFO, pulseSkeletonStyle } from "@constants/skeleton.constant";
import { cx } from "@emotion/css";
import { useTheme } from "@emotion/react";
import { usePoolLiquiditySegmentsByPath } from "@hooks/pool/data/use-pool-liquidity-segments-by-path";
import { PoolListInfo } from "@models/pool/info/pool-list-info";

import { PoolInfoLazyChartWrapper } from "./PoolInfoLazyChart.styles";

export interface PoolInfoLazyChartProps {
  width: number;
  pool: PoolListInfo;
}

const SKELETON_OPTION = POOL_INFO.list[POOL_INFO.list.length - 1];

const PoolGraph = dynamic<PoolGraphProps>(() => import("@components/common/pool-graph/PoolGraph"), {
  ssr: false,
});

const PoolInfoLazyChart: React.FC<PoolInfoLazyChartProps> = ({ pool, width }) => {
  const { tokenA, tokenB, currentTick, price } = pool;
  const { themeKey } = useTheme();

  const observerRef = useRef<HTMLDivElement | null>(null);
  const [display, setDisplay] = useState(false);

  const { liquiditySegments, isFetched } = usePoolLiquiditySegmentsByPath(
    pool.poolId,
    {
      currentTick,
      currentPrice: price,
      tokenA,
      tokenB,
      includeTokenAmounts: true,
      visibleTickRange: LIQUIDITY_GRAPH_DEFAULT_VISIBLE_TICK_RANGE,
      binCount: LIQUIDITY_GRAPH_BIN_COUNT,
    },
    {
      enabled: display,
    },
  );

  const isHideBar = useMemo(() => {
    return liquiditySegments.length === 0;
  }, [liquiditySegments.length]);

  const visibleSkeleton = useMemo(() => {
    return !display || !isFetched;
  }, [display, isFetched]);

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
          currentPrice={price}
          liquiditySegments={liquiditySegments}
          mouseover
          disabled={isHideBar}
          themeKey={themeKey}
          position="top"
          nextSpacing={false}
        />
      )}
    </PoolInfoLazyChartWrapper>
  );
};

export default PoolInfoLazyChart;
