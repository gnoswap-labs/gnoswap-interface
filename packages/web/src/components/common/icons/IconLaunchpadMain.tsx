/**
 * Todo: Delete This code.
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

/* eslint-disable @next/next/no-img-element */
import { ThemeKeys } from "@styles/ThemeTypes";

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

    return (
      <img
        src="/img-launchpad.png"
        alt="launchpad-main-img"
        className={className}
        // style={styleObject}
      />
    );
  },
);

IconLaunchpadMain.displayName = "IconLaunchpadMain";

export default IconLaunchpadMain;
