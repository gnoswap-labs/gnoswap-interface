const IconOpenLink = ({ className, fill, size, viewBox }: { className?: string, fill?: string, size?: string, viewBox?: string }) => (
  <svg
    width={size || "24"}
    height={size || "24"}
    viewBox={viewBox || "0 0 24 24"}
    // viewBox={size ? `0 0 ${size} ${size}` : "0 0 24 24"}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5 5V19H19V12H21V19C21 20.1 20.1 21 19 21H5C3.89 21 3 20.1 3 19V5C3 3.9 3.89 3 5 3H12V5H5ZM14.24 5V3H21.24V10H19.24V6.41L9.41 16.24L8 14.83L17.83 5H14.24Z"
      fill={fill || "white"}
    />
  </svg>
);

export default IconOpenLink;
