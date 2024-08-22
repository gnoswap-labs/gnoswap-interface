import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as d3 from "d3";
import * as uuid from "uuid";

import { FloatingPosition } from "@hooks/common/use-floating-tooltip";
import { PoolBinModel } from "@models/pool/pool-bin-model";
import { TokenModel } from "@models/token/token-model";
import { formatTokenExchangeRate } from "@utils/stake-position-utils";
import { tickToPriceStr } from "@utils/swap-utils";
import FloatingTooltip from "../tooltip/FloatingTooltip";

import PoolGraphSVG from "./pool-graph-svg/PoolGraphSVG";
import PoolGraphTooltip from "./pool-graph-tooltip/PoolGraphTooltip";
import { PoolGraphWrapper } from "./PoolGraph.styles";
import { ReservedBin, TooltipInfo } from "./PoolGraph.types";

export interface PoolGraphProps {
  tokenA: TokenModel;
  tokenB: TokenModel;
  bins: PoolBinModel[];
  currentTick?: number | null;
  mouseover?: boolean;
  zoomable?: boolean;
  visibleLabel?: boolean;
  width: number;
  height: number;
  margin?: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
  themeKey: "dark" | "light";
  nextSpacing?: boolean;
  position?: FloatingPosition;
  offset?: number;
  maxTickPosition?: number | null;
  minTickPosition?: number | null;
  poolPrice: number;
  isPosition?: boolean;
  binsMyAmount?: PoolBinModel[];
  isReversed?: boolean;
  disabled?: boolean;
}

const PoolGraph: React.FC<PoolGraphProps> = ({
  tokenA,
  tokenB,
  bins = [],
  currentTick = null,
  mouseover,
  width,
  height,
  margin = {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  themeKey,
  nextSpacing = false,
  position,
  offset = 20,
  maxTickPosition = 0,
  minTickPosition = 0,
  poolPrice,
  isPosition = false,
  binsMyAmount = [],
  isReversed = false,
  disabled = true,
}) => {
  const graphIdRef = useRef(uuid.v4());
  const graphId = graphIdRef.current.toString();
  const getBinId = useCallback(
    (index: number) => `pool-graph-bin-${graphId}-${index}`,
    [graphId],
  );

  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const lastHoverBinIndexRef = useRef<number | undefined>();

  const boundsWidth = width - margin.right - margin.left;
  const boundsHeight = height - margin.top - margin.bottom;

  // D3 - Dimension Definition
  const defaultMinX = Math.min(...bins.map(bin => bin.minTick));
  const minX = d3.min(bins, bin => bin.minTick - defaultMinX) || 0;
  const maxX = d3.max(bins, bin => bin.maxTick - defaultMinX) || 0;

  const reservedBins: ReservedBin[] = useMemo(() => {
    const length = bins.length / 2;
    const fullLength = length * 2;

    const convertReserveBins = bins.map((item, index) => {
      const reserveTokenAMap =
        Number(item.reserveTokenB) / (Number(poolPrice) || 1);
      const reserveTokenBMap = Number(item.reserveTokenA);

      return {
        ...item,
        reserveTokenAMyAmount: binsMyAmount?.[index]?.reserveTokenA || 0,
        reserveTokenBMyAmount: binsMyAmount?.[index]?.reserveTokenB || 0,
        reserveTokenAMap: index < length ? reserveTokenAMap : reserveTokenBMap,
        index: index,
      };
    });

    const maxHeight =
      d3.max(convertReserveBins, bin => bin.reserveTokenAMap) || 0;

    const reserveBins = convertReserveBins
      .sort((b1, b2) => b1.minTick - b2.minTick)
      .map(bin => {
        return {
          ...bin,
          minTick: bin.minTick - defaultMinX,
          maxTick: bin.maxTick - defaultMinX,
          reserveTokenMap: (bin.reserveTokenAMap * boundsHeight) / maxHeight,
          minTickSwap: bin.minTick - defaultMinX,
          maxTickSwap: bin.maxTick - defaultMinX,
        };
      });

    if (!isReversed) {
      return reserveBins;
    }

    const reverseReserveBins = reserveBins.map((item, i) => ({
      ...reserveBins[length * 2 - i - 1],
      minTick: item.minTick,
      maxTick: item.maxTick,
      minTickSwap: reserveBins[fullLength - i - 1].minTick,
      maxTickSwap: reserveBins[fullLength - i - 1].maxTick,
    }));
    return reverseReserveBins;
  }, [bins, isReversed, poolPrice, binsMyAmount.length]);

  const maxHeight = d3.max(reservedBins, bin => bin.reserveTokenMap) || 0;

  // D3 - Scale Definition
  const defaultScaleX = d3
    .scaleLinear()
    .domain([0, maxX - minX])
    .range([margin.left, boundsWidth]);

  const scaleX = defaultScaleX.copy();

  const scaleY = useMemo(() => {
    return d3
      .scaleLinear()
      .domain([0, maxHeight || 0])
      .range([boundsHeight, 0]);
  }, [boundsHeight, maxHeight]);

  const [tickOfPrices, setTickOfPrices] = useState<{ [key in number]: string }>(
    {},
  );
  const [tooltipInfo, setTooltipInfo] = useState<TooltipInfo | null>(null);
  const [positionX, setPositionX] = useState<number | null>(null);
  const [positionY, setPositionY] = useState<number | null>(null);

  const binSpacing = useMemo(() => {
    if (reservedBins.length < 1) {
      return 0;
    }
    if (reservedBins.length === 2) {
      return 20;
    }
    const spacing =
      scaleX(reservedBins[1].minTick) - scaleX(reservedBins[0].minTick);
    if (spacing < 2) {
      return spacing;
    }
    return spacing;
  }, [reservedBins, scaleX]);

  const tooltipPosition = useMemo((): FloatingPosition => {
    if (position) {
      return position;
    }
    if (!positionX || !positionY) {
      return "top-start";
    }
    const isTop = positionY > height * 0.6;
    const isStart = positionX < width - 50;
    if (isTop) {
      return `top-${isStart ? "start" : "end"}`;
    }
    return `${isStart ? "right" : "left"}`;
  }, [width, height, positionX, positionY, position]);

  const onMouseMoveChartBin = useCallback(
    (event: MouseEvent) => {
      if (!mouseover || Object.keys(tickOfPrices).length === 0) {
        return;
      }
      const mouseX = event.offsetX;
      const mouseY = event.offsetY;
      const currentBin = reservedBins.find(bin => {
        if (mouseY < 0.000001 || mouseY > height) {
          return false;
        }
        if (bin.reserveTokenMap < 0 || !bin.reserveTokenMap) {
          return false;
        }
        const isHoveringCurrentBin = document
          .getElementById(getBinId(bin.index))
          ?.matches(":hover");

        const isHoveringPreviousBin = document
          .getElementById(getBinId(bin.index - 1))
          ?.matches(":hover");

        const isHoveringNextBin = document
          .getElementById(getBinId(bin.index + 1))
          ?.matches(":hover");

        const hoveredBinIndex = (() => {
          if (isHoveringCurrentBin) return bin.index;

          if (isHoveringPreviousBin) return bin.index - 1;

          if (isHoveringNextBin) return bin.index + 1;
        })();

        if (hoveredBinIndex !== 0 && !hoveredBinIndex) return false;

        return bin.index === hoveredBinIndex;
      });

      if (currentBin?.index) {
        if (currentBin.index !== lastHoverBinIndexRef.current) {
          lastHoverBinIndexRef.current = currentBin.index;
        } else {
          setPositionX(mouseX);
          setPositionY(mouseY);
          return;
        }
      }

      if (!currentBin) {
        setPositionX(null);
        setPositionY(null);
        if (!nextSpacing) {
          setTooltipInfo(null);
        }
        return;
      }

      if (
        Math.abs(height - mouseY - 0.0001) >
        boundsHeight -
          scaleY(currentBin.reserveTokenMap) +
          (scaleY(currentBin.reserveTokenMap) > height - 3 &&
          scaleY(currentBin.reserveTokenMap) !== height
            ? 3
            : 0)
      ) {
        setPositionX(null);
        setPositionY(null);
        setTooltipInfo(null);
        return;
      }
      const minTick = currentBin.minTick + defaultMinX;
      const maxTick = currentBin.maxTick + defaultMinX;

      const minTickSwap = currentBin.minTickSwap + defaultMinX;
      const maxTickSwap = currentBin.maxTickSwap + defaultMinX;

      const tokenARange = {
        min: tickOfPrices[!isReversed ? minTick : minTickSwap] || null,
        max: tickOfPrices[!isReversed ? maxTick : maxTickSwap] || null,
      };
      const tokenBRange = {
        min: tickOfPrices[!isReversed ? -minTick : -minTickSwap] || null,
        max: tickOfPrices[!isReversed ? -maxTick : -maxTickSwap] || null,
      };
      const index = currentBin.index;

      const tokenAAmountStr = currentBin.reserveTokenA;
      const tokenBAmountStr = currentBin.reserveTokenB;
      const depositTokenAAmountStr = currentBin?.reserveTokenAMyAmount;
      const depositTokenBAmountStr = currentBin?.reserveTokenBMyAmount;
      let disabledBin = !!(
        maxTickPosition &&
        minTickPosition &&
        (scaleX(currentBin.minTick) < minTickPosition - binSpacing ||
          scaleX(currentBin.minTick) > maxTickPosition)
      );
      if (isReversed) {
        disabledBin = !!(
          maxTickPosition &&
          minTickPosition &&
          (scaleX(currentBin.minTick) <
            scaleX(maxX) - maxTickPosition - binSpacing ||
            scaleX(currentBin.minTick) > scaleX(maxX) - minTickPosition)
        );
      }

      const tokenAAmount = tokenAAmountStr
        ? formatTokenExchangeRate(tokenAAmountStr.toString(), {
            maxSignificantDigits: 6,
            minLimit: 0.000001,
          })
        : "-";
      const tokenBAmount = tokenBAmountStr
        ? formatTokenExchangeRate(tokenBAmountStr.toString(), {
            maxSignificantDigits: 6,
            minLimit: 0.000001,
          })
        : "-";
      const depositTokenAAmount =
        index < 20
          ? "-"
          : index > 19 && `${currentBin.reserveTokenAMyAmount}` === "0"
          ? "<0.000001"
          : formatTokenExchangeRate(depositTokenAAmountStr.toString(), {
              maxSignificantDigits: 6,
              minLimit: 0.000001,
            }) || "-";
      const depositTokenBAmount =
        index > 19
          ? "-"
          : index < 20 && `${currentBin.reserveTokenBMyAmount}` === "0"
          ? "<0.000001"
          : formatTokenExchangeRate(depositTokenBAmountStr.toString(), {
              maxSignificantDigits: 6,
              minLimit: 0.000001,
            }) || "-";

      setTooltipInfo({
        tokenA,
        tokenB,
        tokenAAmount,
        tokenBAmount,
        depositTokenAAmount,
        depositTokenBAmount,
        tokenARange: tokenARange,
        tokenBRange: tokenBRange,
        tokenAPrice: tickOfPrices[currentTick || 0],
        tokenBPrice: tickOfPrices[-(currentTick || 0)],
        disabled: disabledBin,
      });
      setPositionX(mouseX);
      setPositionY(mouseY);
    },
    [mouseover, tickOfPrices, reservedBins, binSpacing, currentTick],
  );

  function onMouseOutChartBin() {
    setPositionX(null);
    setPositionY(null);
  }

  useEffect(() => {
    if (bins.length > 0) {
      new Promise<{ [key in number]: string }>(resolve => {
        const tickOfPrices = bins
          .flatMap(bin => {
            const minTick = bin.minTick;
            const maxTick = bin.maxTick;
            return [minTick, maxTick, -minTick, -maxTick];
          })
          .reduce<{ [key in number]: string }>((acc, current) => {
            if (!acc[current]) {
              const priceStr = tickToPriceStr(current, {
                decimals: 40,
                isFormat: false,
              });

              acc[current] = formatTokenExchangeRate(priceStr, {
                maxSignificantDigits: 6,
                minLimit: 0.000001,
                isInfinite: priceStr === "∞",
              });
            }
            return acc;
          }, {});
        resolve(tickOfPrices);
      }).then(setTickOfPrices);
    }
  }, [bins]);

  useEffect(() => {
    if (tooltipInfo) {
      window.addEventListener("scroll", onMouseOutChartBin);
      return () => window.removeEventListener("scroll", onMouseOutChartBin);
    }
  }, [tooltipInfo]);

  return (
    <PoolGraphWrapper>
      <FloatingTooltip
        className="chart-tooltip"
        isHiddenArrow
        position={tooltipPosition}
        offset={offset}
        content={
          !!tooltipInfo && !disabled ? (
            <div
              ref={tooltipRef}
              className={`tooltip-container ${themeKey}-shadow`}
            >
              <PoolGraphTooltip
                tooltipInfo={tooltipInfo}
                isPosition={isPosition}
                disabled={disabled}
              />
            </div>
          ) : null
        }
      >
        <PoolGraphSVG
          ref={svgRef}
          graphId={graphId}
          width={width}
          height={height}
          margin={margin}
          currentTick={currentTick}
          reservedBins={reservedBins}
          maxTickPosition={maxTickPosition}
          minTickPosition={minTickPosition}
          isReversed={isReversed}
          disabled={disabled}
          themeKey={themeKey}
          binSpacing={binSpacing}
          scaleX={scaleX}
          scaleY={scaleY}
          d3Position={{
            minX,
            maxX,
            defaultMinX,
          }}
          onMouseMove={onMouseMoveChartBin}
          onMouseOut={onMouseOutChartBin}
        />
      </FloatingTooltip>
    </PoolGraphWrapper>
  );
};

export default React.memo(PoolGraph);
