import { useAtom } from "jotai";
import { CommonState } from "@states/index";
import { DeviceSize, DEVICE_TYPE } from "@styles/media";

export const useWindowSize = () => {
  const [breakpoint, setBreakpoint] = useAtom(CommonState.breakpoint);
  const [currentWidth, setCurrentWidth] = useAtom(CommonState.currentWidth);

  const findDeviceType = (width: number) => {
    setCurrentWidth(width);
    return width > DeviceSize.tablet
      ? DEVICE_TYPE.WEB
      : width > DeviceSize.tabletMiddle
      ? DEVICE_TYPE.TABLET
      : width > DeviceSize.mobile
      ? DEVICE_TYPE.TABLET_M
      : DEVICE_TYPE.MOBILE;
  };

  const handleBreakpoint = (width: number) => {
    const device = findDeviceType(width);
    if (breakpoint !== device) {
      setBreakpoint(device);
    }
  };

  const isMobile = breakpoint === DEVICE_TYPE.MOBILE;

  const isWeb = [DEVICE_TYPE.WEB, DEVICE_TYPE.MEDIUM_WEB].some(
    v => v === breakpoint,
  );

  const isTablet = [
    DEVICE_TYPE.MEDIUM_TABLET,
    DEVICE_TYPE.TABLET,
    DEVICE_TYPE.TABLET_M,
    DEVICE_TYPE.TABLET_S,
  ].some(v => v === breakpoint);

  return {
    breakpoint,
    handleBreakpoint,
    width: currentWidth,
    isMobile,
    isWeb,
    isTablet,
  };
};
