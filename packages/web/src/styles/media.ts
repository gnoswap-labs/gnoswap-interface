import { ValuesType } from "utility-types";

interface MediaProps {
  [key: string]: number;
}

export const DEVICE_TYPE = {
  WEB: "web",
  MEDIUM_WEB: "mediumWeb",
  TABLET: "tablet",
  MEDIUM_TABLET: "mediumTablet",
  TABLET_M: "tabletMiddle",
  TABLET_S: "tabletSmall",
  MOBILE: "mobile",
} as const;
export type DEVICE_TYPE = ValuesType<typeof DEVICE_TYPE>;

export const DeviceSize: MediaProps = {
  web: 2160,
  mediumWeb: 1330,
  tablet: 1180,
  mediumTablet: 1180,
  tabletMiddle: 930,
  tabletSmall: 890,
  mobile: 768,
};

export const ContainerWidth = {
  WEB_SECTION_CONTAINER: "1920px",
  WEB_CONTAINER: "1440px",
  TABLET_CONTAINER: "1180px",
  MOBILE_CONTAINER: "768px",
};

const customMediaQuery = (maxWidth: number) =>
  `@media (max-width: ${maxWidth}px)`;

export const media = {
  web: customMediaQuery(DeviceSize.web),
  mediumWeb: customMediaQuery(DeviceSize.mediumWeb),
  tablet: customMediaQuery(DeviceSize.tablet),
  mediumTablet: customMediaQuery(DeviceSize.mediumTablet),
  tabletMiddle: customMediaQuery(DeviceSize.tabletMiddle),
  mobile: customMediaQuery(DeviceSize.mobile),
};
