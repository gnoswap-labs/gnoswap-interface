import { useAtom } from "jotai";
import { CommonState } from "@states/index";
import { DeviceSize, DEVICE_TYPE } from "@styles/media";

export const useWindowSize = () => {
  const [breakpoint, setBreakpoint] = useAtom(CommonState.breakpoint);

  const findDeviceType = (width: number) => {
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

  return { breakpoint, handleBreakpoint };
};
