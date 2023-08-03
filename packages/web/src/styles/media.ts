interface DeviceProps {
  [key: string]: number;
}

export const DeviceSize: DeviceProps = {
  web: 2160,
  tablet: 1024,
  mobile: 768,
};

const customMediaQuery = (maxWidth: number) =>
  `@media (max-width: ${maxWidth}px)`;

export const media = {
  web: customMediaQuery(DeviceSize.web),
  tablet: customMediaQuery(DeviceSize.tablet),
  mobile: customMediaQuery(DeviceSize.mobile),
};
