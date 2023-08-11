interface MediaProps {
  [key: string]: number;
}

export const DeviceSize: MediaProps = {
  web: 2160,
  tablet: 1280,
  mobile: 768,
};

export const ContainerWidth: MediaProps = {
  WEB_CONTAINER: 1440,
  TABLET_CONTAINER: 1180,
  MOBILE_CONTAINER: 360,
};

export const compareSize = (type: string, size: number) => {
  const width = Object.keys(DeviceSize).find(x => x === type.toLowerCase());
  return size > DeviceSize[`${width}`] ? true : false;
};

const customMediaQuery = (maxWidth: number) =>
  `@media (max-width: ${maxWidth}px)`;

export const media = {
  web: customMediaQuery(DeviceSize.web),
  tablet: customMediaQuery(DeviceSize.tablet),
  mobile: customMediaQuery(DeviceSize.mobile),
};
