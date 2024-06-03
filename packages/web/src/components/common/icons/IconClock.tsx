const IconClock = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="26"
    height="25"
    fill="none"
    viewBox="0 0 26 25"
    className={className}
  >
    <path
      fill="url(#paint0_linear_9065_220754)"
      fillRule="evenodd"
      d="M3.168 12.5c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10-10-4.477-10-10zm10.937-5.313a.938.938 0 00-1.875 0V12.5c0 .249.1.487.275.663l2.5 2.5a.937.937 0 001.326-1.326l-2.226-2.225V7.187z"
      clipRule="evenodd"
    ></path>
    <defs>
      <linearGradient
        id="paint0_linear_9065_220754"
        x1="13.168"
        x2="13.168"
        y1="2.5"
        y2="22.5"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#233DBD"></stop>
        <stop offset="1" stopColor="#233DBD" stopOpacity="0.2"></stop>
      </linearGradient>
    </defs>
  </svg>
);

export default IconClock;
