import { ValuesType } from "utility-types";

interface MediaProps {
  [key: string]: number;
}

export const DEVICE_TYPE = {
  WEB: "web",
  TABLET: "tablet",
  MOBILE: "mobile",
} as const;
export type DEVICE_TYPE = ValuesType<typeof DEVICE_TYPE>;

export const DeviceSize: MediaProps = {
  web: 2160,
  tablet: 1280,
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
  tablet: customMediaQuery(DeviceSize.tablet),
  mobile: customMediaQuery(DeviceSize.mobile),
};
