const IconAddPositionCircle = ({
  className = "",
  active = false,
}: {
  className?: string;
  active?: boolean;
}) => (
  <svg
    className={className}
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="11" cy="11" r="11" fill={active ? "#233DBD" : "#596782"} />
    <rect x="6" y="10" width="10" height="2" fill="#E0E8F4" />
    <rect
      x="12"
      y="6"
      width="10"
      height="2"
      transform="rotate(90 12 6)"
      fill="#E0E8F4"
    />
  </svg>
);

export default IconAddPositionCircle;
