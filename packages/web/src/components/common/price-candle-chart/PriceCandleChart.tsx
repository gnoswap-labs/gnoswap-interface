import { useTheme } from "@emotion/react";
import { FloatingPortal } from "@floating-ui/react";
import {
  CandlestickSeries,
  ColorType,
  CrosshairMode,
  createChart,
  HistogramSeries,
  TickMarkType,
  type LogicalRange,
  type Time,
  type UTCTimestamp,
} from "lightweight-charts";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import IconGoToLatest from "@components/common/icons/IconGoToLatest";
import IconRefresh from "@components/common/icons/IconRefresh";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import { CHART_LOADING_DELAY_MS } from "@constants/loading.constant";

import { CandleTooltip, ChartNavigation } from "./PriceCandleChart.styles";

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
  const navigation = useRef<{ resetView: () => void; goToLatest: () => void } | null>(null);
  const [navigationState, setNavigationState] = useState({
    canReset: false,
    canScrollToLatest: false,
    right: 0,
    bottom: 0,
  });
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
    setNavigationState({ canReset: false, canScrollToLatest: false, right: 0, bottom: 0 });

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
      const volumePositive = theme.color.chartVolumeUp;
      const volumeNegative = theme.color.chartVolumeDown;
      const chart = createChart(element, {
        width: element.clientWidth,
        height: element.clientHeight,
        layout: {
          background: { type: ColorType.Solid, color: theme.color.background28 },
          textColor: theme.color.text04,
          // TradingView Lightweight Charts™
          // Copyright (с) 2025 TradingView, Inc. https://www.tradingview.com/
          attributionLogo: true,
          panes: {
            separatorColor: "transparent",
            separatorHoverColor: "transparent",
          },
        },
        grid: {
          vertLines: { color: theme.color.border02, visible: true },
          horzLines: { color: theme.color.border02, visible: true },
        },
        rightPriceScale: {
          autoScale: true,
          borderColor: theme.color.border14,
          scaleMargins: { top: 0.1, bottom: 0.1 },
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
          lockVisibleTimeRangeOnResize: true,
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
      const observer = new ResizeObserver(entries => {
        const { width, height } = entries[0].contentRect;
        chart.resize(width, height);
        scheduleNavigationUpdate();
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
      const volume = chart.addSeries(
        HistogramSeries,
        {
          priceFormat: { type: "volume" },
          priceLineVisible: false,
          lastValueVisible: false,
        },
        1,
      );
      volume.priceScale().applyOptions({
        scaleMargins: { top: 0.1, bottom: 0 },
        entireTextOnly: true,
      });
      const [pricePane, volumePane] = chart.panes();
      pricePane.setStretchFactor(3);
      volumePane.setStretchFactor(1);
      let bars: PriceBar[] = [];
      const barsByTime = new Map<number, PriceBar>();
      // The cursor is the exclusive boundary of the last requested window, not the
      // first returned candle. Sparse and empty windows must still advance it.
      let cursor = (Math.floor(Date.now() / 1000 / interval) + 1) * interval;
      const windowSeconds = Math.min(30 * interval, 30 * 86400);
      let exhausted = false;
      let fetching = false;
      let initialWindowPending = true;
      let preloadFrame = 0;
      let navigationFrame = 0;
      let defaultLogicalSpan: number | null = null;
      const defaultRightOffset = all ? 0 : 5;
      // Ignore floating-point roundoff, not whether a gesture happened in the past.
      const viewTolerance = 0.01;
      const updateNavigation = () => {
        if (cancelled) return;
        const timeScale = chart.timeScale();
        const range = timeScale.getVisibleLogicalRange();
        const offset = timeScale.scrollPosition();
        const next = {
          canReset:
            defaultLogicalSpan !== null &&
            range !== null &&
            (Math.abs(range.to - range.from - defaultLogicalSpan) > viewTolerance ||
              Math.abs(offset - defaultRightOffset) > viewTolerance ||
              !candles.priceScale().options().autoScale ||
              !volume.priceScale().options().autoScale),
          canScrollToLatest: bars.length > 0 && offset < -viewTolerance,
          right: chart.priceScale("right").width() + 8,
          bottom: timeScale.height() + 8,
        };
        setNavigationState(previous =>
          previous.canReset === next.canReset &&
          previous.canScrollToLatest === next.canScrollToLatest &&
          previous.right === next.right &&
          previous.bottom === next.bottom
            ? previous
            : next,
        );
      };
      const scheduleNavigationUpdate = () => {
        if (navigationFrame || cancelled) return;
        navigationFrame = window.requestAnimationFrame(() => {
          navigationFrame = 0;
          updateNavigation();
        });
      };
      const setInitialView = () => {
        const range = {
          from: Math.max(0, bars.length - 30),
          to: bars.length - 1 + defaultRightOffset,
        };
        defaultLogicalSpan = range.to - range.from;
        chart.timeScale().setVisibleLogicalRange(range);
      };
      const applyPriceFormat = () => {
        let smallestPrice = Infinity;
        for (const bar of bars) {
          for (const price of [bar.open, bar.high, bar.low, bar.close]) {
            const magnitude = Math.abs(price);
            if (Number.isFinite(magnitude) && magnitude > 0 && magnitude < smallestPrice) {
              smallestPrice = magnitude;
            }
          }
        }
        const precision = Number.isFinite(smallestPrice) ? Math.max(2, Math.ceil(-Math.log10(smallestPrice)) + 4) : 2;
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
        const start = Math.max(0, end - windowSeconds * (initialWindowPending ? 2 : 1));
        initialWindowPending = false;
        fetching = true;
        if (bars.length) setPagingError(false);
        else setState("loading");
        try {
          const windows: { start: number; end: number }[] = [];
          for (let pageEnd = end; pageEnd > start; ) {
            const pageStart = Math.max(start, pageEnd - 30 * 86400);
            windows.push({ start: pageStart, end: pageEnd });
            pageEnd = pageStart;
          }
          const pages = await Promise.all(
            windows.map(async window => {
              const rows = await loadPage(window.start, window.end);
              if (rows.some(bar => bar.time < window.start || bar.time >= window.end)) {
                throw new Error("Invalid price history response");
              }
              return rows;
            }),
          );
          if (cancelled) return;
          const oldestPageEmpty = pages[pages.length - 1].length === 0;
          const older = pages.reverse().flat();
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
          exhausted = cursor === 0 || (stopAtEmptyOlderPage && oldestPageEmpty);
          setCanSearchOlder(!exhausted);
          const visible = bars.length ? chart.timeScale().getVisibleLogicalRange() : null;
          bars = older.concat(bars);
          applyPriceFormat();
          for (const bar of older) barsByTime.set(bar.time, bar);
          candles.setData(
            bars.map(({ time, open, high, low, close }) => ({ time: time as UTCTimestamp, open, high, low, close })),
          );
          volume.setData(
            bars.map(({ time, volume: value, open, close }) =>
              value === 0
                ? { time: time as UTCTimestamp }
                : { time: time as UTCTimestamp, value, color: close >= open ? volumePositive : volumeNegative },
            ),
          );
          if (visible) {
            chart
              .timeScale()
              .setVisibleLogicalRange({ from: visible.from + older.length, to: visible.to + older.length });
          } else {
            setInitialView();
          }
          setState("ready");
        } catch {
          if (!cancelled) {
            if (bars.length) setPagingError(true);
            else setState("error");
          }
        } finally {
          fetching = false;
          if (!cancelled) {
            // setVisibleLogicalRange is applied on the chart's next render.
            window.cancelAnimationFrame(preloadFrame);
            preloadFrame = window.requestAnimationFrame(() => {
              preloadFrame = 0;
              if (!cancelled) onRange(chart.timeScale().getVisibleLogicalRange());
            });
          }
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
          const followingLatest =
            visible !== null && Math.abs(visible.to - (bars.length - 1) - defaultRightOffset) <= viewTolerance;
          const previousLength = bars.length;
          const changed = latest.filter(bar => {
            const previous = barsByTime.get(bar.time);
            return (
              !previous ||
              bar.open !== previous.open ||
              bar.high !== previous.high ||
              bar.low !== previous.low ||
              bar.close !== previous.close ||
              bar.volume !== previous.volume ||
              bar.quoteVolume !== previous.quoteVolume
            );
          });
          if (!changed.length) return;
          for (const bar of changed) {
            barsByTime.set(bar.time, bar);
            const { time, open, high, low, close, volume: value } = bar;
            candles.update({ time: time as UTCTimestamp, open, high, low, close });
            volume.update(
              value === 0
                ? { time: time as UTCTimestamp }
                : { time: time as UTCTimestamp, value, color: close >= open ? volumePositive : volumeNegative },
            );
          }
          bars = Array.from(barsByTime.values()).sort((a, b) => a.time - b.time);
          applyPriceFormat();
          if (visible) {
            const shift = followingLatest ? bars.length - previousLength : 0;
            chart.timeScale().setVisibleLogicalRange({ from: visible.from + shift, to: visible.to + shift });
          } else {
            setInitialView();
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
          if (!cancelled) onRange(chart.timeScale().getVisibleLogicalRange());
        }
      };
      const refreshOnVisibility = () => {
        if (!document.hidden) void refreshLatest();
      };
      const refreshTimer = window.setInterval(() => void refreshLatest(), 5_000);
      document.addEventListener("visibilitychange", refreshOnVisibility);
      // The initial window includes its buffer; later pages require a user gesture.
      let userPanned = false;
      let pointerStart: number | null = null;
      const armPaging = () => {
        userPanned = true;
        scheduleNavigationUpdate();
      };
      const startPan = (event: PointerEvent) => {
        pointerStart = event.clientX;
      };
      const movePan = (event: PointerEvent) => {
        if (pointerStart !== null && event.buttons && Math.abs(event.clientX - pointerStart) > 8) userPanned = true;
        if (!event.buttons) pointerStart = null;
        if (pointerStart !== null && event.buttons) scheduleNavigationUpdate();
      };
      const endPan = () => {
        pointerStart = null;
        scheduleNavigationUpdate();
      };
      const hideTooltip = () => setHovered(null);
      element.addEventListener("pointerleave", hideTooltip);
      document.addEventListener("scroll", hideTooltip, { capture: true, passive: true });
      window.addEventListener("resize", hideTooltip);
      window.visualViewport?.addEventListener("resize", hideTooltip);
      window.visualViewport?.addEventListener("scroll", hideTooltip);
      element.addEventListener("wheel", armPaging, { capture: true, passive: true });
      element.addEventListener("pointerdown", startPan, { capture: true });
      element.addEventListener("pointermove", movePan, { capture: true });
      document.addEventListener("pointerup", endPan);
      element.addEventListener("pointercancel", endPan);
      element.addEventListener("dblclick", scheduleNavigationUpdate);
      const onCrosshairMove: Parameters<typeof chart.subscribeCrosshairMove>[0] = param => {
        if (
          typeof param.time !== "number" ||
          !param.point ||
          (!param.seriesData.has(candles) && !param.seriesData.has(volume))
        ) {
          setHovered(null);
          return;
        }
        const bar = barsByTime.get(param.time);
        if (!bar) {
          setHovered(null);
          return;
        }
        const bounds =
          chart.panes()[param.paneIndex ?? 0].getHTMLElement()?.getBoundingClientRect() ?? element.getBoundingClientRect();
        const x = bounds.left + param.point.x;
        const y = bounds.top + param.point.y;
        setHovered(previous =>
          previous?.bar === bar && previous.x === x && previous.y === y ? previous : { bar, x, y },
        );
      };
      chart.subscribeCrosshairMove(onCrosshairMove);
      const onRange = (range: LogicalRange | null) => {
        scheduleNavigationUpdate();
        if (
          !cancelled &&
          !exhausted &&
          bars.length > 0 &&
          !fetching &&
          userPanned &&
          range &&
          (candles.barsInLogicalRange(range)?.barsBefore ?? Infinity) < 30
        ) {
          userPanned = false;
          void loadOlder();
        }
      };
      chart.timeScale().subscribeVisibleLogicalRangeChange(onRange);
      navigation.current = {
        goToLatest: () => {
          userPanned = false;
          setHovered(null);
          chart.timeScale().scrollToPosition(defaultRightOffset, false);
          scheduleNavigationUpdate();
        },
        resetView: () => {
          if (defaultLogicalSpan === null) return;
          userPanned = false;
          setHovered(null);
          candles.priceScale().applyOptions({ autoScale: true });
          volume.priceScale().applyOptions({ autoScale: true });
          const to = bars.length - 1 + defaultRightOffset;
          chart.timeScale().setVisibleLogicalRange({ from: to - defaultLogicalSpan, to });
          scheduleNavigationUpdate();
        },
      };
      dispose = () => {
        window.clearInterval(refreshTimer);
        window.cancelAnimationFrame(preloadFrame);
        window.cancelAnimationFrame(navigationFrame);
        document.removeEventListener("visibilitychange", refreshOnVisibility);
        element.removeEventListener("wheel", armPaging, true);
        element.removeEventListener("pointerdown", startPan, true);
        element.removeEventListener("pointermove", movePan, true);
        document.removeEventListener("pointerup", endPan);
        element.removeEventListener("pointercancel", endPan);
        element.removeEventListener("dblclick", scheduleNavigationUpdate);
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
      navigation.current = null;
      dispose?.();
    };
  }, [
    identity,
    interval,
    daily,
    all,
    stopAtEmptyOlderPage,
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
        css={{
          "&.price-chart-canvas a#tv-attr-logo": {
            "--fill": theme.color.text01,
            "--stroke": theme.color.background28,
          },
          // The rightmost cell of each pane is its price axis.
          "& .tv-lightweight-charts tr > td:last-child": {
            touchAction: "none",
          },
        }}
        style={{ touchAction: "pan-y", overscrollBehavior: "contain" }}
      />
      {state === "ready" && (
        <ChartNavigation style={{ right: navigationState.right, bottom: navigationState.bottom }}>
          {navigationState.canReset && (
            <button
              type="button"
              className="price-chart-reset"
              aria-label="Reset chart view"
              title="Reset chart view"
              onClick={() => navigation.current?.resetView()}
            >
              <span aria-hidden="true">
                <IconRefresh />
              </span>
            </button>
          )}
          {navigationState.canScrollToLatest && (
            <button
              type="button"
              className="price-chart-latest"
              aria-label="Scroll to the most recent bar"
              title="Scroll to the most recent bar"
              onClick={() => navigation.current?.goToLatest()}
            >
              <span aria-hidden="true">
                <IconGoToLatest />
              </span>
            </button>
          )}
        </ChartNavigation>
      )}
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
