import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { PoolGraphTooltipWrapper, PoolGraphWrapper } from "./PoolGraph.styles";
import * as d3 from "d3";
import { PoolBinModel } from "@models/pool/pool-bin-model";
import { TokenModel } from "@models/token/token-model";
import { useColorGraph } from "@hooks/common/use-color-graph";
import { tickToPriceStr } from "@utils/swap-utils";
import FloatingTooltip from "../tooltip/FloatingTooltip";
import { FloatingPosition } from "@hooks/common/use-floating-tooltip";
import MissingLogo from "../missing-logo/MissingLogo";
import { formatTokenExchangeRate } from "@utils/stake-position-utils";
import { useTranslation } from "react-i18next";

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
  isSwap?: boolean;
  showBar?: boolean;
}

interface TooltipInfo {
  tokenA: TokenModel;
  tokenB: TokenModel;
  tokenAAmount: string | null;
  tokenBAmount: string | null;
  myTokenAAmount: string | null;
  myTokenBAmount: string | null;
  tokenARange: {
    min: string | null;
    max: string | null;
  };
  tokenBRange: {
    min: string | null;
    max: string | null;
  };
  tokenAPrice: string;
  tokenBPrice: string;
  isBlackBar: boolean;
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
  isSwap = false,
  showBar = true,
}) => {
  const graphIdRef = useRef(Math.random());
  const defaultMinX = Math.min(...bins.map(bin => bin.minTick));
  const svgRef = useRef<SVGSVGElement>(null);
  const chartRef = useRef(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const lastHoverBinIndexRef = useRef<number | undefined>();

  const { redColor, greenColor } = useColorGraph();

  const boundsWidth = width - margin.right - margin.left;
  const boundsHeight = height - margin.top - margin.bottom;

  const getBinId = useCallback(
    (index: number) => `pool-graph-bin-${graphIdRef.current}-${index}`,
    [],
  );

  // D3 - Dimension Definition
  const minX = d3.min(bins, bin => bin.minTick - defaultMinX) || 0;
  const maxX = d3.max(bins, bin => bin.maxTick - defaultMinX) || 0;

  const resolvedBins = useMemo(() => {
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
    const temp = convertReserveBins
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
    const revereTemp = temp.map((item, i) => ({
      ...temp[length * 2 - i - 1],
      minTick: item.minTick,
      maxTick: item.maxTick,
      minTickSwap: temp[fullLength - i - 1].minTick,
      maxTickSwap: temp[fullLength - i - 1].maxTick,
    }));
    return !isSwap ? temp : revereTemp;
  }, [bins, boundsHeight, defaultMinX, poolPrice, isSwap, binsMyAmount]);

  const maxHeight = d3.max(resolvedBins, bin => bin.reserveTokenMap) || 0;

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
  const centerX = currentTick ?? (minX && maxX ? (minX + maxX) / 2 : 0);

  const [tickOfPrices, setTickOfPrices] = useState<{ [key in number]: string }>(
    {},
  );
  const [tooltipInfo, setTooltipInfo] = useState<TooltipInfo | null>(null);
  const [positionX, setPositionX] = useState<number | null>(null);
  const [positionY, setPositionY] = useState<number | null>(null);

  function getTickSpacing() {
    if (resolvedBins.length < 1) {
      return 0;
    }
    if (resolvedBins.length === 2) {
      return 20;
    }
    const spacing =
      scaleX(resolvedBins[1].minTick) - scaleX(resolvedBins[0].minTick);
    if (spacing < 2) {
      return spacing;
    }
    return spacing;
  }

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
  const random = Math.random().toString();

  /** Update Chart by data */
  function updateChart() {
    const tickSpacing = getTickSpacing();
    const centerPosition = scaleX(centerX - defaultMinX) - tickSpacing / 2;

    // Retrieves the colour of the chart bar at the current tick.
    function fillByBin(bin: PoolBinModel) {
      let isBlackBar = !!(
        maxTickPosition &&
        minTickPosition &&
        (scaleX(bin.minTick) < minTickPosition - tickSpacing ||
          scaleX(bin.minTick) > maxTickPosition)
      );

      if (isSwap) {
        isBlackBar = !!(
          maxTickPosition &&
          minTickPosition &&
          (scaleX(bin.minTick) < scaleX(maxX) - maxTickPosition - tickSpacing ||
            scaleX(bin.minTick) > scaleX(maxX) - minTickPosition)
        );
      }
      if (isBlackBar) return themeKey === "dark" ? "#1C2230" : "#E0E8F4";
      if (currentTick && bin.minTick < Number(currentTick - defaultMinX)) {
        return `url(#gradient-bar-green-${random})`;
      }
      return `url(#gradient-bar-red-${random})`;
    }

    // Clean child elements.
    d3.select(chartRef.current).selectChildren().remove();

    // Create a chart bar.
    const rects = d3.select(chartRef.current);

    rects.attr("clip-path", "url(#clip)");

    // D3 - Draw Current tick (middle line)
    if (currentTick) {
      rects
        .append("line")
        .attr("x1", centerPosition + tickSpacing / 2)
        .attr("x2", centerPosition + tickSpacing / 2)
        .attr("y1", 0)
        .attr("y2", boundsHeight)
        .attr("stroke-dasharray", 3)
        .attr("stroke", `${themeKey === "dark" ? "#E0E8F4" : "#596782"}`)
        .attr("stroke-width", 1);
    }

    // D3 - Draw bins as bars
    if (showBar) {
      rects
        .selectAll("rects")
        .data(resolvedBins)
        .enter()
        .append("g")
        .attr("class", "bin-wrapper")
        .attr("id", bin => getBinId(bin.index))
        .each(function (bin) {
          d3.select(this)
            .append("rect")
            .style("fill", "transparent")
            .attr("class", "bin-inner")
            .style("stroke-width", "0")
            .attr("x", scaleX(bin.minTick))
            .attr("width", scaleX(bin.maxTick - bin.minTick))
            .attr("y", () => {
              const scaleYComputation = scaleY(bin.reserveTokenMap) ?? 0;
              return (
                scaleYComputation -
                (scaleYComputation > height - 3 && scaleYComputation !== height
                  ? 3
                  : 0)
              );
            })
            .attr("height", () => {
              const scaleYComputation = scaleY(bin.reserveTokenMap) ?? 0;
              return (
                boundsHeight -
                scaleYComputation +
                (scaleYComputation > height - 3 && scaleYComputation !== height
                  ? 3
                  : 0)
              );
            });
          d3.select(this)
            .append("rect")
            .style("fill", fillByBin(bin))
            .attr("class", "bin-inner")
            .style("stroke-width", "0")
            .attr("x", scaleX(bin.minTick) + 1)
            .attr("width", scaleX(bin.maxTick - bin.minTick) - 1)
            .attr("y", () => {
              const scaleYComputation = scaleY(bin.reserveTokenMap) ?? 0;
              return (
                scaleYComputation -
                (scaleYComputation > height - 3 && scaleYComputation !== height
                  ? 3
                  : 0)
              );
            })
            .attr("height", () => {
              const scaleYComputation = scaleY(bin.reserveTokenMap) ?? 0;
              return (
                boundsHeight -
                scaleYComputation +
                (scaleYComputation > height - 3 && scaleYComputation !== height
                  ? 3
                  : 0)
              );
            });
        });
    }
  }

  function onMouseoverChartBin(event: MouseEvent) {
    if (!mouseover) {
      return;
    }
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;
    const currentBin = resolvedBins.find(bin => {
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

      const isHoveringIndex = (() => {
        if (isHoveringCurrentBin) return bin.index;

        if (isHoveringPreviousBin) return bin.index - 1;

        if (isHoveringNextBin) return bin.index + 1;
      })();

      if (isHoveringIndex !== 0 && !isHoveringIndex) return false;

      return bin.index === isHoveringIndex;
    });
    if (
      currentBin?.index &&
      currentBin?.index !== lastHoverBinIndexRef.current
    ) {
      lastHoverBinIndexRef.current = currentBin?.index;
    }

    if (!currentBin) {
      setPositionX(null);
      setPositionY(null);
      !nextSpacing && setTooltipInfo(null);
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
      min: tickOfPrices[!isSwap ? minTick : minTickSwap] || null,
      max: tickOfPrices[!isSwap ? maxTick : maxTickSwap] || null,
    };
    const tokenBRange = {
      min: tickOfPrices[!isSwap ? -minTick : -minTickSwap] || null,
      max: tickOfPrices[!isSwap ? -maxTick : -maxTickSwap] || null,
    };
    const index = currentBin.index;

    const tokenAAmountStr = currentBin.reserveTokenA;
    const tokenBAmountStr = currentBin.reserveTokenB;
    const myTokenAAmountStr = currentBin?.reserveTokenAMyAmount;
    const myTokenBAmountStr = currentBin?.reserveTokenBMyAmount;
    const tickSpacing = getTickSpacing();
    let isBlackBar = !!(
      maxTickPosition &&
      minTickPosition &&
      (scaleX(currentBin.minTick) < minTickPosition - tickSpacing ||
        scaleX(currentBin.minTick) > maxTickPosition)
    );
    if (isSwap) {
      isBlackBar = !!(
        maxTickPosition &&
        minTickPosition &&
        (scaleX(currentBin.minTick) <
          scaleX(maxX) - maxTickPosition - tickSpacing ||
          scaleX(currentBin.minTick) > scaleX(maxX) - minTickPosition)
      );
    }
    setTooltipInfo({
      tokenA: tokenA,
      tokenB: tokenB,
      tokenAAmount: tokenAAmountStr
        ? formatTokenExchangeRate(tokenAAmountStr.toString(), {
            maxSignificantDigits: 6,
            minLimit: 0.000001,
          })
        : "-",
      tokenBAmount: tokenBAmountStr
        ? formatTokenExchangeRate(tokenBAmountStr.toString(), {
            maxSignificantDigits: 6,
            minLimit: 0.000001,
          })
        : "-",
      myTokenAAmount:
        index < 20
          ? "-"
          : index > 19 && `${currentBin.reserveTokenAMyAmount}` === "0"
          ? "<0.000001"
          : formatTokenExchangeRate(myTokenAAmountStr.toString(), {
              maxSignificantDigits: 6,
              minLimit: 0.000001,
            }) || "-",
      myTokenBAmount:
        index > 19
          ? "-"
          : index < 20 && `${currentBin.reserveTokenBMyAmount}` === "0"
          ? "<0.000001"
          : formatTokenExchangeRate(myTokenBAmountStr.toString(), {
              maxSignificantDigits: 6,
              minLimit: 0.000001,
            }) || "-",
      tokenARange: tokenARange,
      tokenBRange: tokenBRange,
      tokenAPrice: tickOfPrices[currentTick || 0],
      tokenBPrice: tickOfPrices[-(currentTick || 0)],
      isBlackBar,
    });
    setPositionX(mouseX);
    setPositionY(mouseY);
  }

  function onMouseoutChartBin() {
    setPositionX(null);
    setPositionY(null);
  }

  function onMouseoverClear(event: MouseEvent) {
    const { clientX, clientY } = event;
    if (!svgRef.current?.getClientRects()[0]) {
      setTooltipInfo(null);
      return;
    }
    const { left, right, top, bottom } = svgRef.current?.getClientRects()[0];
    if (
      clientX < left ||
      clientX > right ||
      clientY < top ||
      clientY > bottom
    ) {
      setTooltipInfo(null);
    }
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
    //  D3 - Draw bin and define interaction
    const svgElement = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;")
      .on("mousemove", onMouseoverChartBin)
      .on("mouseout", onMouseoutChartBin);

    svgElement
      .append("defs")
      .append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", width)
      .attr("height", height);

    if (!!width && !!height && !!scaleX && !!scaleY) {
      updateChart();
    }
  }, [width, height, scaleX, scaleY]);

  useEffect(() => {
    if (tooltipInfo) {
      window.addEventListener("scroll", onMouseoutChartBin);
      return () => window.removeEventListener("scroll", onMouseoutChartBin);
    }
  }, [tooltipInfo]);

  useEffect(() => {
    if (tooltipInfo) {
      window.addEventListener("mousemove", onMouseoverClear);
      return () => window.removeEventListener("mousemove", onMouseoverClear);
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
          showBar && tooltipInfo ? (
            <PoolGraphTooltipWrapper
              ref={tooltipRef}
              className={`tooltip-container ${themeKey}-shadow}`}
            >
              <PoolGraphBinTooptip
                tooltipInfo={tooltipInfo}
                isPosition={isPosition}
              />
            </PoolGraphTooltipWrapper>
          ) : null
        }
      >
        <svg ref={svgRef}>
          <defs>
            <linearGradient
              id={`gradient-bar-green-${random}`}
              x1="0"
              x2="0"
              y1="0"
              y2="1"
            >
              <stop offset="0%" stopColor={greenColor.start} />
              <stop offset="100%" stopColor={greenColor.end} />
            </linearGradient>
            <linearGradient
              id={`gradient-bar-red-${random}`}
              x1="0"
              x2="0"
              y1="0"
              y2="1"
            >
              <stop offset="0%" stopColor={redColor.start} />
              <stop offset="100%" stopColor={redColor.end} />
            </linearGradient>
          </defs>
          <g
            ref={chartRef}
            width={boundsWidth}
            height={boundsHeight}
            transform={`translate(${[margin.left, margin.top].join(",")})`}
          ></g>
        </svg>
      </FloatingTooltip>
    </PoolGraphWrapper>
  );
};

export default React.memo(PoolGraph);

interface PoolGraphBinTooptipProps {
  tooltipInfo: TooltipInfo | null;
  isPosition: boolean;
}

export const PoolGraphBinTooptip: React.FC<PoolGraphBinTooptipProps> = ({
  tooltipInfo,
  isPosition,
}) => {
  const { t } = useTranslation();

  const tokenAPriceString = useMemo(() => {
    if (tooltipInfo === null) {
      return "-";
    }
    const { tokenAPrice, tokenB } = tooltipInfo;
    if (!tokenAPrice) {
      return "-";
    }
    return `${tokenAPrice} ${tokenB.symbol}`;
  }, [tooltipInfo]);

  const tokenBPriceString = useMemo(() => {
    if (tooltipInfo === null) {
      return "-";
    }
    const { tokenBPrice, tokenA } = tooltipInfo;
    if (!tokenBPrice) {
      return "-";
    }
    return `${tokenBPrice} ${tokenA.symbol}`;
  }, [tooltipInfo]);

  const tokenAPriceRangeStr = useMemo(() => {
    if (tooltipInfo === null) {
      return "-";
    }
    const { tokenARange, tokenB } = tooltipInfo;
    if (tokenARange?.min === null || tokenARange?.max === null) {
      return "-";
    }
    return `${tokenARange.min} - ${tokenARange.max} ${tokenB.symbol}`;
  }, [tooltipInfo]);

  const tokenBPriceRangeStr = useMemo(() => {
    if (tooltipInfo === null) {
      return "-";
    }
    const { tokenBRange, tokenA } = tooltipInfo;
    if (tokenBRange?.min === null || tokenBRange?.max === null) {
      return "-";
    }
    return `${tokenBRange.max} - ${tokenBRange.min} ${tokenA.symbol}`;
  }, [tooltipInfo]);

  return tooltipInfo ? (
    <div className="tooltip-wrapper">
      <div className="header">
        <div className="row">
          <span className="token">{t("common:poolGraph.tooltip.quote")}</span>
          <span className="price-range">{t("business:currentPrice")}</span>
        </div>
      </div>
      <div className="content">
        <div className="row">
          <span className="token">
            <MissingLogo
              symbol={tooltipInfo.tokenA.symbol}
              url={tooltipInfo.tokenA.logoURI}
              className="logo"
              width={20}
              mobileWidth={20}
            />
            <span>
              {tooltipInfo.tokenA.symbol} {t("common:price")}
            </span>
          </span>
          <span className="price-range">{tokenAPriceString}</span>
        </div>
        <div className="row">
          <span className="token">
            <MissingLogo
              symbol={tooltipInfo.tokenB.symbol}
              url={tooltipInfo.tokenB.logoURI}
              className="logo"
              width={20}
              mobileWidth={20}
            />
            <span>
              {tooltipInfo.tokenB.symbol} {t("common:price")}
            </span>
          </span>
          <span className="price-range">{tokenBPriceString}</span>
        </div>
      </div>
      <div className="header mt-8">
        <div className="row">
          <span className="token token-title">{t("business:token")}</span>
          <span className="amount total-amount">
            {t("common:poolGraph.tooltip.totalAmt")}
          </span>
          {isPosition && !tooltipInfo.isBlackBar ? (
            <span className="amount w-100">
              {t("common:poolGraph.tooltip.positionAmt")}
            </span>
          ) : (
            ""
          )}
          <span className="price-range">
            {t("common:poolGraph.tooltip.priceRange")}
          </span>
        </div>
      </div>
      <div className="content">
        <div className="row">
          <span className="token">
            <MissingLogo
              symbol={tooltipInfo.tokenA.symbol}
              url={tooltipInfo.tokenA.logoURI}
              className="logo"
              width={20}
              mobileWidth={20}
            />
            <span>{tooltipInfo.tokenA.symbol}</span>
          </span>
          <span className="amount total-amount">
            <span
              className={`token-amount-value hidden ${
                (tooltipInfo.tokenAAmount || "0").length > 21
                  ? "small-font"
                  : ""
              }`}
            >
              {tooltipInfo.tokenAAmount || "0"}
            </span>
          </span>
          {isPosition && !tooltipInfo.isBlackBar ? (
            <span className="amount w-100">
              <span className="token-amount-value hidden">
                {tooltipInfo.myTokenAAmount || "0"}
              </span>
            </span>
          ) : (
            ""
          )}
          <span
            className={`price-range price-range-value ${
              (tokenAPriceRangeStr.length || 0) > 21 ? "small-font" : ""
            }`}
          >
            {tokenAPriceRangeStr}
          </span>
        </div>
        <div className="row">
          <span className="token">
            <MissingLogo
              symbol={tooltipInfo.tokenB.symbol}
              url={tooltipInfo.tokenB.logoURI}
              className="logo"
              width={20}
              mobileWidth={20}
            />
            <span>{tooltipInfo.tokenB.symbol}</span>
          </span>
          <span className="amount total-amount">
            <span
              className={`token-amount-value hidden ${
                (tooltipInfo.tokenBAmount || "0").length > 21
                  ? "small-font"
                  : ""
              }`}
            >
              {tooltipInfo.tokenBAmount || "0"}
            </span>
          </span>
          {isPosition && !tooltipInfo.isBlackBar ? (
            <span className="amount w-100">
              <span className="token-amount-value hidden">
                {tooltipInfo.myTokenBAmount || "0"}
              </span>
            </span>
          ) : (
            ""
          )}
          <span
            className={`price-range price-range-value ${
              (tokenBPriceRangeStr || "0").length > 21 ? "small-font" : ""
            }`}
          >
            {tokenBPriceRangeStr}
          </span>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};
