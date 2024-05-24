import { Interpolation, Theme } from "@emotion/react";
import { SVGProps } from "react";

const IconStrokeArrowUp = ({
  className,
  onClick,
  svgProps
}: {
  className?: string;
  onClick?: () => void;
  svgProps?: SVGProps<SVGPathElement> & {
    css?: Interpolation<Theme>;
  }
}) => (
  <svg
    fill="none"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    onClick={onClick}
  >
    <path
      d="M7.41 15.41L12 10.83L16.59 15.41L18 14L12 8L6 14L7.41 15.41Z"
      fill="white"
      {...svgProps}
    />
  </svg>
);

export default IconStrokeArrowUp;
