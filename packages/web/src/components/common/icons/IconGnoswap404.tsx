/* eslint-disable @next/next/no-img-element */
import { ThemeKeys } from "@styles/ThemeTypes";

const IconGnoswap404 = ({
  className,
  themeKey = "dark",
}: {
  className?: string;
  themeKey?: ThemeKeys;
}) => (
  <img
    src="/img-404.png"
    alt="404-img"
    className={className}
    style={{
      opacity: themeKey === "dark" ? "60%" : "80%",
      mixBlendMode: themeKey === "dark" ? "hard-light" : "darken",
    }}
  />
);

export default IconGnoswap404;
