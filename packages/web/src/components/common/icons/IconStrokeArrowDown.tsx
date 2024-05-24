import { Interpolation, Theme } from "@emotion/react";
import { SVGProps } from "react";

const IconStrokeArrowDown = ({
  className,
  onClick,
  svgProps,
}: {
  className?: string;
  onClick?: () => void;
  svgProps?: SVGProps<SVGPathElement> & {
    css?: Interpolation<Theme>;
  }
}) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    onClick={onClick}
  >
    <path
      d="M7.41 8.58984L12 13.1698L16.59 8.58984L18 9.99984L12 15.9998L6 9.99984L7.41 8.58984Z"
      fill="white"
      {...svgProps}
    />
  </svg>
);

export default IconStrokeArrowDown;
