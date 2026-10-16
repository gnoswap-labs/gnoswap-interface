import { useTheme } from "@emotion/react";
import { FloatingPortal } from "@floating-ui/react";
import {
  CandlestickSeries,
  ColorType,
  CrosshairMode,
  createChart,
  HistogramSeries,
  TickMarkType,
  type AutoscaleInfo,
  type LogicalRange,
  type Time,
  type UTCTimestamp,
} from "lightweight-charts";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import { CHART_LOADING_DELAY_MS } from "@constants/loading.constant";

import { CandleTooltip } from "./PriceCandleChart.styles";

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
  stopAtEmptyOlderPage?: boolean;
  resetKey?: number;
  label: string;
  volumeSymbols: readonly [string, string?];
  priceLabel?: string;
  formatCandlePrice: (value: number) => string;
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
  stopAtEmptyOlderPage = false,
  resetKey,
  label,
  volumeSymbols,
  priceLabel,
  formatCandlePrice,
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
  const { i18n, t } = useTranslation();
  const [hovered, setHovered] = useState<{ bar: PriceBar; x: number; y: number } | null>(null);
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const formatCandleNumber = useMemo(() => {
    const decimal = new Intl.NumberFormat(locale, { maximumSignificantDigits: 12 });
    const scientific = new Intl.NumberFormat(locale, {
      notation: "scientific",
      minimumSignificantDigits: 5,
      maximumSignificantDigits: 5,
    });
    return (value: number) =>
      value !== 0 && Math.abs(value) < 1e-18 ? scientific.format(value) : decimal.format(value);
  }, [locale]);

  const positionTooltip = useCallback(
    (tooltip: HTMLDivElement | null) => {
      if (!hovered || !tooltip) return;
      const viewport = window.visualViewport;
      const left = viewport?.offsetLeft ?? 0;
      const top = viewport?.offsetTop ?? 0;
      const width = viewport?.width ?? window.innerWidth;
      const height = viewport?.height ?? window.innerHeight;
      tooltip.style.minWidth = `${Math.min(250, Math.max(0, width - 16))}px`;
      tooltip.style.maxWidth = `${Math.max(0, width - 16)}px`;
      tooltip.style.maxHeight = `${Math.max(0, height - 16)}px`;
      const bounds = tooltip.getBoundingClientRect();
      const x = hovered.x + 16 + bounds.width <= left + width - 8 ? hovered.x + 16 : hovered.x - bounds.width - 16;
      const y = hovered.y + 16 + bounds.height <= top + height - 8 ? hovered.y + 16 : hovered.y - bounds.height - 16;
      tooltip.style.left = `${Math.max(left + 8, Math.min(x, left + width - bounds.width - 8))}px`;
      tooltip.style.top = `${Math.max(top + 8, Math.min(y, top + height - bounds.height - 8))}px`;
    },
    [hovered],
  );

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
      const dateFormat = (options: Intl.DateTimeFormatOptions) =>
        new Intl.DateTimeFormat(locale, { ...options, timeZone: "UTC", hourCycle: "h23" });
      const axisFormats = {
        [TickMarkType.Year]: dateFormat({ year: "numeric" }),
        [TickMarkType.Month]: dateFormat({ month: "short" }),
        [TickMarkType.DayOfMonth]: dateFormat({ month: "short", day: "numeric" }),
        [TickMarkType.Time]: dateFormat({ hour: "2-digit", minute: "2-digit" }),
        [TickMarkType.TimeWithSeconds]: dateFormat({
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      };
      const crosshairFormat = dateFormat(
        daily
          ? { year: "numeric", month: "short", day: "numeric" }
          : { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" },
      );
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
          vertLines: { color: theme.color.border02, visible: true },
          horzLines: { color: theme.color.border02, visible: true },
        },
        rightPriceScale: {
          autoScale: true,
          borderColor: theme.color.border14,
          scaleMargins: { top: 0.08, bottom: 0.24 },
        },
        localization: {
          locale,
          timeFormatter: (time: Time) =>
            typeof time === "number" ? crosshairFormat.format(new Date(time * 1000)) : String(time),
        },
        timeScale: {
          borderColor: theme.color.border14,
          timeVisible: !daily,
          secondsVisible: false,
          tickMarkFormatter: (time: Time, type: TickMarkType) =>
            typeof time === "number" ? axisFormats[type].format(new Date(time * 1000)) : String(time),
        },
        crosshair: {
          mode: CrosshairMode.Normal,
          vertLine: { labelBackgroundColor: theme.color.background05 },
          horzLine: { visible: true, labelVisible: true, labelBackgroundColor: theme.color.background05 },
        },
        handleScroll: { mouseWheel: true, pressedMouseMove: true, horzTouchDrag: true, vertTouchDrag: true },
      });
      // Leave space for the 19px attribution, its inset, and the time-axis height.
      const attributionClearance = 36;
      const observer = new ResizeObserver(entries => {
        const { width, height } = entries[0].contentRect;
        chart.resize(width, height);
        chart.priceScale("volume").applyOptions({
          scaleMargins: {
            top: height < 250 ? 0.6 : 0.78,
            bottom: Math.min(0.24, attributionClearance / Math.max(height, 1)),
          },
        });
      });
      observer.observe(element);
      const candles = chart.addSeries(CandlestickSeries, {
        upColor: positive,
        downColor: negative,
        wickUpColor: positive,
        wickDownColor: negative,
        borderVisible: false,
        priceLineVisible: false,
        autoscaleInfoProvider: (original: () => AutoscaleInfo | null) => {
          const info = original();
          if (!info?.priceRange) return info;
          const { minValue, maxValue } = info.priceRange;
          // Expand only the viewport, never candle values. Native bounds include
          // every visible wick and remain authoritative for larger moves.
          const center = minValue / 2 + maxValue / 2;
          const halfSpan = Math.abs(center) * 0.3;
          return {
            ...info,
            priceRange: {
              minValue: Math.min(minValue, center - halfSpan),
              maxValue: Math.max(maxValue, center + halfSpan),
            },
          };
        },
      });
      const volume = chart.addSeries(HistogramSeries, {
        priceScaleId: "volume",
        priceFormat: { type: "volume" },
        priceLineVisible: false,
        lastValueVisible: false,
      });
      chart.priceScale("volume").applyOptions({
        scaleMargins: {
          top: element.clientHeight < 250 ? 0.6 : 0.78,
          bottom: Math.min(0.24, attributionClearance / Math.max(element.clientHeight, 1)),
        },
        visible: false,
      });
      let bars: PriceBar[] = [];
      const barsByTime = new Map<number, PriceBar>();
      // The cursor is the exclusive boundary of the last requested window, not the
      // first returned candle. Sparse and empty windows must still advance it.
      let cursor = (Math.floor(Date.now() / 1000 / interval) + 1) * interval;
      const windowSeconds = Math.min(120 * interval, 30 * 86400);
      let exhausted = false;
      let fetching = false;
      const applyPriceFormat = (latest: number) => {
        const precision = latest === 0 ? 2 : Math.max(2, Math.ceil(-Math.log10(Math.abs(latest))) + 4);
        candles.applyOptions({
          priceFormat: {
            type: "custom",
            minMove: Math.max(Number.MIN_VALUE, 10 ** -precision),
            formatter: formatCandlePrice,
            tickmarksFormatter: (prices: number[]) => {
              const labels = prices.map(formatCandlePrice);
              for (let i = 1; i < labels.length; i++) {
                if (labels[i] === labels[i - 1]) {
                  return prices.map(price => (precision > 12 ? price.toExponential(16) : price.toFixed(precision)));
                }
              }
              return labels;
            },
          },
        });
      };
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
            exhausted = cursor === 0 || (stopAtEmptyOlderPage && bars.length > 0);
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
          applyPriceFormat(bars.length ? bars[bars.length - 1].close : older[older.length - 1].close);
          const visible = bars.length ? chart.timeScale().getVisibleLogicalRange() : null;
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
          if (visible) {
            chart
              .timeScale()
              .setVisibleLogicalRange({ from: visible.from + older.length, to: visible.to + older.length });
          } else if (all) chart.timeScale().fitContent();
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
      const refreshLatest = async () => {
        if (cancelled || fetching || document.hidden) return;
        const end = (Math.floor(Date.now() / 1000 / interval) + 1) * interval;
        const start = Math.max(0, end - windowSeconds, bars.length ? bars[bars.length - 1].time : 0);
        if (start >= end) return;
        fetching = true;
        try {
          const latest = await loadPage(start, end);
          if (cancelled || !latest.length) return;
          if (latest.some(bar => bar.time < start || bar.time >= end)) {
            throw new Error("Invalid price history response");
          }
          const visible = chart.timeScale().getVisibleLogicalRange();
          for (const bar of latest) barsByTime.set(bar.time, bar);
          bars = Array.from(barsByTime.values()).sort((a, b) => a.time - b.time);
          applyPriceFormat(bars[bars.length - 1].close);
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
          if (visible) {
            chart.timeScale().setVisibleLogicalRange(visible);
          } else {
            chart.timeScale().setVisibleLogicalRange({
              from: Math.max(0, bars.length - 65) - 6,
              to: bars.length + 4,
            });
          }
          setState("ready");
          setHovered(previous => {
            if (!previous) return null;
            const bar = barsByTime.get(previous.bar.time);
            return bar ? { ...previous, bar } : null;
          });
        } catch {
          // A transient refresh failure must not replace an already loaded chart.
        } finally {
          fetching = false;
        }
      };
      const refreshOnVisibility = () => {
        if (!document.hidden) void refreshLatest();
      };
      const refreshTimer = window.setInterval(() => void refreshLatest(), 5_000);
      document.addEventListener("visibilitychange", refreshOnVisibility);
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
      const containTouch = (event: TouchEvent) => {
        if (event.cancelable) event.preventDefault();
      };
      const hideTooltip = () => setHovered(null);
      element.addEventListener("touchmove", containTouch, { passive: false });
      element.addEventListener("pointerleave", hideTooltip);
      document.addEventListener("scroll", hideTooltip, { capture: true, passive: true });
      window.addEventListener("resize", hideTooltip);
      window.visualViewport?.addEventListener("resize", hideTooltip);
      window.visualViewport?.addEventListener("scroll", hideTooltip);
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
        const bounds = element.getBoundingClientRect();
        const x = bounds.left + param.point.x;
        const y = bounds.top + param.point.y;
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
        window.clearInterval(refreshTimer);
        document.removeEventListener("visibilitychange", refreshOnVisibility);
        element.removeEventListener("wheel", armPaging, true);
        element.removeEventListener("pointerdown", startPan, true);
        element.removeEventListener("pointermove", movePan, true);
        element.removeEventListener("pointerup", endPan);
        element.removeEventListener("pointercancel", endPan);
        element.removeEventListener("touchmove", containTouch);
        element.removeEventListener("pointerleave", hideTooltip);
        document.removeEventListener("scroll", hideTooltip, true);
        window.removeEventListener("resize", hideTooltip);
        window.visualViewport?.removeEventListener("resize", hideTooltip);
        window.visualViewport?.removeEventListener("scroll", hideTooltip);
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
  }, [
    identity,
    interval,
    daily,
    all,
    stopAtEmptyOlderPage,
    resetKey,
    locale,
    retry,
    theme,
    loadPage,
    formatCandlePrice,
  ]);

  return (
    <div className="price-chart-shell" aria-label={label}>
      <div
        ref={chartElement}
        className="price-chart-canvas"
        style={{ touchAction: "none", overscrollBehavior: "contain" }}
      />
      {state !== "ready" && (
        <div
          className="price-chart-status"
          role="status"
          aria-live="polite"
          aria-label={state === "loading" ? loadingLabel : undefined}
        >
          {state === "loading" && <LoadingSpinner size="CHART" delay={CHART_LOADING_DELAY_MS} />}
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
        <FloatingPortal>
          <CandleTooltip ref={positionTooltip} role="tooltip" style={{ left: hovered.x, top: hovered.y }}>
            <div>
              <span>{t("common:candleTooltip.high")}</span>
              <strong>{formatCandlePrice(hovered.bar.high)}</strong>
            </div>
            <div>
              <span>{t("common:candleTooltip.low")}</span>
              <strong>{formatCandlePrice(hovered.bar.low)}</strong>
            </div>
            <div>
              <span>{t("common:candleTooltip.open")}</span>
              <strong>{formatCandlePrice(hovered.bar.open)}</strong>
            </div>
            <div>
              <span>{t("common:candleTooltip.close")}</span>
              <strong>{formatCandlePrice(hovered.bar.close)}</strong>
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
        </FloatingPortal>
      )}
      {priceLabel && <span className="price-chart-currency">{priceLabel}</span>}
    </div>
  );
}
