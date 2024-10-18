/**
 * Todo: Delete This code.
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import Image from "next/image";

import { ThemeKeys } from "@styles/ThemeTypes";
import { useWindowSize } from "@hooks/common/use-window-size";

interface IconLaunchpadMainProps {
  className?: string;
  themeKey?: ThemeKeys;
}

const IconLaunchpadMain: React.FC<IconLaunchpadMainProps> = React.memo(
  ({ className, themeKey = "dark" }) => {
    /**
     * TODO: The style object below is commented out but may be needed later.
     * [2024-10-01] [To apply different styles for light mode and dark mode]
     *
     * const styleObject = {
     *   opacity: themeKey === "dark" ? "60%" : "80%",
     *   mixBlendMode: themeKey === "dark" ? "hard-light" : "darken",
     * };
     */

    const { breakpoint } = useWindowSize();

    const getImageSize = () => {
      switch (breakpoint) {
        case "web":
          return { width: 435, height: 600 };
        case "tablet":
          return { width: 334, height: 460 };
        case "mobile":
          return { width: 195, height: 268 };
        default:
          return { width: 334, height: 460 };
      }
    };

    const { width, height } = getImageSize();

    return (
      <Image
        src={"/img-launchpad.png"}
        alt="launchpad-main-image"
        width={width}
        height={height}
        style={{
          objectFit: "cover",
        }}
        priority
      />
    );
  },
);

IconLaunchpadMain.displayName = "IconLaunchpadMain";

export default IconLaunchpadMain;
