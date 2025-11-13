interface PositionCardListBreakPoint {
  width: number;
  displayCount: number;
}

export const POSITION_CARD_LIST_BREAKPOINTS: PositionCardListBreakPoint[] = [
  { width: 1180, displayCount: 4 },
  { width: 920, displayCount: 3 },
];

export const POSITION_CARD_BREAKPOINTS = {
  TABLET_MIN: 768,
  DESKTOP_MIN: 1180,
} as const;

export const POSITION_CARD_DISPLAY_COUNT = {
  TABLET: 3,
  DESKTOP: 4,
} as const;
