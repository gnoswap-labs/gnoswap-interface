const IconOpenLink = ({
  className,
  fill,
  size,
  viewBox,
}: {
  className?: string;
  fill?: string;
  size?: string;
  viewBox?: string;
}) => (
  <svg
    width={size || "13"}
    height={size || "12"}
    viewBox={viewBox || "0 0 13 12"}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.33333 1.33333V10.6667H10.6667V6H12V10.6667C12 11.4 11.4 12 10.6667 12H1.33333C0.593333 12 0 11.4 0 10.6667V1.33333C0 0.6 0.593333 0 1.33333 0H6V1.33333H1.33333ZM7.49333 1.33333V0H12.16V4.66667H10.8267V2.27333L4.27333 8.82667L3.33333 7.88667L9.88667 1.33333H7.49333Z"
      fill={fill || "#596782"}
    />
  </svg>
);

export default IconOpenLink;
