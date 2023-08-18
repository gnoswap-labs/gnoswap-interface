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
  background13: string;
  background14: string;
  background15: string;
  background16: string;
  background17: string;
  backgroundOpacity: string;
  backgroundOpacity2: string;
  backgroundGradient: string;
  backgroundGradient2: string;
  backgroundGradient3: string;
  border01: string;
  border02: string;
  border03: string;
  border04: string;
  border05: string;
  border06: string;
  border07: string;
  border08: string;
  border09: string;
  border10: string;
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
  text11: string;
  text12: string;
  text13: string;
  text14: string;
  text15: string;
  text16: string;
  text17: string;
  text18: string;
  text19: string;
  text20: string;
  icon01: string;
  icon02: string;
  icon03: string;
  icon04: string;
  icon05: string;
  icon06: string;
  icon07: string;
  icon08: string;
  icon09: string;
  icon10: string;
  hover01: string;
  hover02: string;
  hover03: string;
  hover04: string;
  tooltipBackground: string;
  point: string;
  green01: string;
  red01: string;
  select: string;
}

export type ThemeColorKeyTypes = keyof ThemeColorType;

export type WindowSizeKeyType = "mobile" | "tablet" | "desktop";

export type WindowSizeType = { [key in WindowSizeKeyType]: string };

export type ThemeKeys = "dark" | "light";
