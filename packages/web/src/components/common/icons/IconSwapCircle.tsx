const IconSwapCircle = ({
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
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M14.34 6.33301L17 8.99967L14.34 11.6663V9.66634H9.66667V8.33301H14.34V6.33301ZM5 12.9997L7.66 10.333V12.333H12.3333V13.6663H7.66V15.6663L5 12.9997Z"
      fill="#E0E8F4"
    />
  </svg>
);

export default IconSwapCircle;
