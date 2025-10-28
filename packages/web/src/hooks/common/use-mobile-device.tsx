import React from "react";

export function useMobileDevice() {
  const [isMobileDevice, setIsMobileDevice] = React.useState(false);

  React.useEffect(() => {
    if (!window) return;

    const userAgent = typeof window.navigator === "undefined" ? "" : navigator.userAgent;
    const mobileDevice = !!userAgent.match(
      /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet|kindle|silk|playbook/i,
    );

    setIsMobileDevice(mobileDevice);
  }, []);

  return { isMobileDevice };
}
