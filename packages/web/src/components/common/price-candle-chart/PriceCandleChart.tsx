import { useTheme } from "@emotion/react";
import {
  CandlestickSeries,
  ColorType,
  createChart,
  HistogramSeries,
  type LogicalRange,
  type UTCTimestamp,
} from "lightweight-charts";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { CandleTooltip } from "./PriceCandleChart.styles";

const candleNumberFormatter = new Intl.NumberFormat("en-US", { maximumSignificantDigits: 12 });
const formatCandleNumber = (value: number) =>
  value !== 0 && Math.abs(value) < 1e-18 ? value.toExponential(4) : candleNumberFormatter.format(value);

export interface PriceBar {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  quoteVolume?: number;
}

interface Props {
  identity: string;
  interval: number;
  daily: boolean;
  all?: boolean;
  label: string;
  volumeSymbols: readonly [string, string?];
  priceLabel?: string;
  loadingLabel: string;
  emptyLabel: string;
  searchOlderLabel: string;
  errorLabel: string;
  retryLabel: string;
  loadPage: (start: number, end: number) => Promise<PriceBar[]>;
}

export default function PriceCandleChart({
  identity,
  interval,
  daily,
  all = false,
  label,
  volumeSymbols,
  priceLabel,
  loadingLabel,
  emptyLabel,
  searchOlderLabel,
  errorLabel,
  retryLabel,
  loadPage,
}: Props) {
  const theme = useTheme();
  const chartElement = useRef<HTMLDivElement>(null);
  const searchOlder = useRef<(() => void) | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "empty" | "error">("loading");
  const [pagingError, setPagingError] = useState(false);
  const [retry, setRetry] = useState(0);
  const [canSearchOlder, setCanSearchOlder] = useState(true);
  const { t } = useTranslation();
  const [hovered, setHovered] = useState<{ bar: PriceBar; x: number; y: number } | null>(null);

  useEffect(() => {
    const element = chartElement.current;
    if (!element) return;
    let cancelled = false;
    let dispose: (() => void) | undefined;
    setState("loading");
    setPagingError(false);
    setCanSearchOlder(true);
    setHovered(null);

    async function initialize() {
      if (cancelled || !element) return;
      const positive = theme.color.green01;
      const negative = theme.color.red01;
      const chart = createChart(element, {
        width: element.clientWidth,
        height: element.clientHeight,
        layout: {
          background: { type: ColorType.Solid, color: theme.color.background28 },
          textColor: theme.color.text04,
          // TradingView Lightweight Charts™
          // Copyright (с) 2025 TradingView, Inc. https://www.tradingview.com/
          attributionLogo: true,
        },
        grid: {
          vertLines: { color: theme.color.border14 },
          horzLines: { color: theme.color.border14 },
        },
        rightPriceScale: {
          borderColor: theme.color.border14,
          scaleMargins: { top: 0.08, bottom: 0.24 },
        },
        timeScale: { borderColor: theme.color.border14, timeVisible: !daily, secondsVisible: false },
        crosshair: {
          vertLine: { labelBackgroundColor: theme.color.background05 },
          horzLine: { labelBackgroundColor: theme.color.background05 },
        },
        handleScroll: { mouseWheel: true, pressedMouseMove: true, horzTouchDrag: true, vertTouchDrag: false },
      });
      const observer = new ResizeObserver(entries => {
        const { width, height } = entries[0].contentRect;
        chart.resize(width, height);
      });
      observer.observe(element);
      const candles = chart.addSeries(CandlestickSeries, {
        upColor: positive,
        downColor: negative,
        wickUpColor: positive,
        wickDownColor: negative,
        borderVisible: false,
        priceLineVisible: false,
      });
      const volume = chart.addSeries(HistogramSeries, {
        priceScaleId: "volume",
        priceFormat: { type: "volume" },
        priceLineVisible: false,
        lastValueVisible: false,
      });
      chart.priceScale("volume").applyOptions({ scaleMargins: { top: 0.78, bottom: 0 }, visible: false });
      let bars: PriceBar[] = [];
      const barsByTime = new Map<number, PriceBar>();
      // The cursor is the exclusive boundary of the last requested window, not the
      // first returned candle. Sparse and empty windows must still advance it.
      let cursor = (Math.floor(Date.now() / 1000 / interval) + 1) * interval;
      const windowSeconds = Math.min(120 * interval, 30 * 86400);
      let exhausted = false;
      let fetching = false;
      const loadOlder = async () => {
        if (cancelled || exhausted || fetching || cursor <= 0) return;
        const end = cursor;
        const start = Math.max(0, end - windowSeconds);
        fetching = true;
        if (bars.length) setPagingError(false);
        else setState("loading");
        try {
          const older = await loadPage(start, end);
          if (cancelled) return;
          if (older.some(bar => bar.time < start || bar.time >= end)) {
            throw new Error("Invalid price history response");
          }
          if (older.length === 0) {
            cursor = start;
            exhausted = cursor === 0;
            setCanSearchOlder(!exhausted);
            if (!bars.length) setState("empty");
            return;
          }
          if (bars.length && older[older.length - 1].time >= bars[0].time) {
            throw new Error("Invalid price history response");
          }
          cursor = start;
          exhausted = cursor === 0;
          setCanSearchOlder(!exhausted);
          const latest = bars.length ? bars[bars.length - 1].close : older[older.length - 1].close;
          const precision = Math.max(2, Math.ceil(-Math.log10(latest)) + 4);
          candles.applyOptions({
            priceFormat:
              precision > 12
                ? {
                    type: "custom",
                    minMove: Math.max(Number.MIN_VALUE, 10 ** -precision),
                    formatter: (price: number) => price.toExponential(4),
                  }
                : { type: "price", precision, minMove: 10 ** -precision },
          });
          const visible = bars.length ? chart.timeScale().getVisibleRange() : null;
          bars = older.concat(bars);
          for (const bar of older) barsByTime.set(bar.time, bar);
          candles.setData(
            bars.map(({ time, open, high, low, close }) => ({ time: time as UTCTimestamp, open, high, low, close })),
          );
          volume.setData(
            bars.map(({ time, volume: value, open, close }) => ({
              time: time as UTCTimestamp,
              value,
              color: close >= open ? positive : negative,
            })),
          );
          if (visible) chart.timeScale().setVisibleRange(visible);
          else if (all) chart.timeScale().fitContent();
          else {
            const visibleBars = Math.min(65, Math.max(20, Math.floor(element.clientWidth / 12)));
            chart
              .timeScale()
              .setVisibleLogicalRange({ from: Math.max(0, bars.length - visibleBars), to: bars.length + 4 });
          }
          setState("ready");
        } catch {
          if (!cancelled) {
            if (bars.length) setPagingError(true);
            else setState("error");
          }
        } finally {
          fetching = false;
        }
      };
      searchOlder.current = () => void loadOlder();
      // Programmatic setData/fitContent/resize also emit range changes. Page only after a user interaction.
      let userPanned = false;
      let pointerStart: number | null = null;
      const armPaging = () => {
        userPanned = true;
      };
      const startPan = (event: PointerEvent) => {
        pointerStart = event.clientX;
      };
      const movePan = (event: PointerEvent) => {
        if (pointerStart !== null && event.buttons && Math.abs(event.clientX - pointerStart) > 8) userPanned = true;
        if (!event.buttons) pointerStart = null;
      };
      const endPan = () => {
        pointerStart = null;
      };
      element.addEventListener("wheel", armPaging, { capture: true, passive: true });
      element.addEventListener("pointerdown", startPan, { capture: true });
      element.addEventListener("pointermove", movePan, { capture: true });
      element.addEventListener("pointerup", endPan);
      element.addEventListener("pointercancel", endPan);
      const onCrosshairMove: Parameters<typeof chart.subscribeCrosshairMove>[0] = param => {
        if (typeof param.time !== "number" || !param.point || !param.seriesData.get(candles)) {
          setHovered(null);
          return;
        }
        const bar = barsByTime.get(param.time);
        if (!bar) {
          setHovered(null);
          return;
        }
        const x = Math.max(8, Math.min(param.point.x + 16, element.clientWidth - 288));
        const y = Math.max(8, Math.min(param.point.y + 16, element.clientHeight - 212));
        setHovered(previous =>
          previous?.bar === bar && previous.x === x && previous.y === y ? previous : { bar, x, y },
        );
      };
      chart.subscribeCrosshairMove(onCrosshairMove);
      const onRange = (range: LogicalRange | null) => {
        if (userPanned && range && (candles.barsInLogicalRange(range)?.barsBefore ?? Infinity) < 30) {
          userPanned = false;
          void loadOlder();
        }
      };
      chart.timeScale().subscribeVisibleLogicalRangeChange(onRange);
      dispose = () => {
        element.removeEventListener("wheel", armPaging, true);
        element.removeEventListener("pointerdown", startPan, true);
        element.removeEventListener("pointermove", movePan, true);
        element.removeEventListener("pointerup", endPan);
        element.removeEventListener("pointercancel", endPan);
        chart.timeScale().unsubscribeVisibleLogicalRangeChange(onRange);
        chart.unsubscribeCrosshairMove(onCrosshairMove);
        observer.disconnect();
        chart.remove();
      };
      await loadOlder();
    }
    void initialize().catch(() => {
      if (!cancelled) setState("error");
    });
    return () => {
      cancelled = true;
      searchOlder.current = null;
      dispose?.();
    };
  }, [identity, interval, daily, all, retry, theme, loadPage]);

  return (
    <div className="price-chart-shell" aria-label={label}>
      <div ref={chartElement} className="price-chart-canvas" />
      {state !== "ready" && (
        <div className="price-chart-status" role="status" aria-live="polite">
          {state === "loading" && loadingLabel}
          {state === "empty" && emptyLabel}
          {state === "empty" && canSearchOlder && (
            <button type="button" onClick={() => void searchOlder.current?.()}>
              {searchOlderLabel}
            </button>
          )}
          {state === "error" && (
            <>
              {errorLabel}{" "}
              <button type="button" onClick={() => setRetry(value => value + 1)}>
                {retryLabel}
              </button>
            </>
          )}
        </div>
      )}
      {pagingError && state === "ready" && (
        <span className="price-chart-paging price-chart-paging-error" role="status">
          {errorLabel}
        </span>
      )}
      {hovered && (
        <CandleTooltip role="tooltip" style={{ left: hovered.x, top: hovered.y }}>
          <div>
            <span>{t("common:candleTooltip.high")}</span>
            <strong>{formatCandleNumber(hovered.bar.high)}</strong>
          </div>
          <div>
            <span>{t("common:candleTooltip.low")}</span>
            <strong>{formatCandleNumber(hovered.bar.low)}</strong>
          </div>
          <div>
            <span>{t("common:candleTooltip.open")}</span>
            <strong>{formatCandleNumber(hovered.bar.open)}</strong>
          </div>
          <div>
            <span>{t("common:candleTooltip.close")}</span>
            <strong>{formatCandleNumber(hovered.bar.close)}</strong>
          </div>
          <div>
            <span>{t("common:candleTooltip.volume")}</span>
            <strong>
              {formatCandleNumber(hovered.bar.volume)} {volumeSymbols[0]}
            </strong>
          </div>
          {hovered.bar.quoteVolume !== undefined && volumeSymbols[1] && (
            <div className="quote-volume">
              <strong>
                {formatCandleNumber(hovered.bar.quoteVolume)} {volumeSymbols[1]}
              </strong>
            </div>
          )}
        </CandleTooltip>
      )}
      {priceLabel && <span className="price-chart-currency">{priceLabel}</span>}
    </div>
  );
}
