export interface ThemeColorType {
  background01: string;
  background02: string;
  background03: string;
  background04: string;
  background04Hover: string;
  background05: string;
  background05Hover: string;
  background06: string;
  background07: string;
  background08: string;
  background09: string;
  background10: string;
  background11: string;
  background12: string;
  backgroundOpacity: string;
  backgroundGradient: string;
  border01: string;
  border02: string;
  border03: string;
  border04: string;
  border05: string;
  border06: string;
  border07: string;
  text01: string;
  text02: string;
  text03: string;
  text04: string;
  text05: string;
  text06: string;
  text07: string;
  text08: string;
  text09: string;
  text10: string;
  icon01: string;
  icon02: string;
  icon03: string;
  icon04: string;
  icon05: string;
  icon06: string;
  hover01: string;
  hover02: string;
  tooltipBackground: string;
  point: string;
  green01: string;
  red01: string;
  select: string;
  selectBG: string;
}

export type ThemeColorKeyTypes = keyof ThemeColorType;

export type WindowSizeKeyType = "mobile" | "tablet" | "desktop";

export type WindowSizeType = { [key in WindowSizeKeyType]: string };

export type ThemeKeys = "dark" | "light";
