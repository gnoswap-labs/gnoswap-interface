import React from "react";

export function useMobileDevice() {
  const [isMobileDevice, setIsMobileDevice] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const userAgent = navigator.userAgent.toLowerCase();

    const mobileUserAgent =
      /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet|kindle|silk|playbook|bb10|rimtablet/i.test(
        userAgent,
      );

    const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

    const mobileDevice = mobileUserAgent || (hasTouch && /mobile/i.test(userAgent));

    setIsMobileDevice(mobileDevice);
  }, []);

  return { isMobileDevice };
}
