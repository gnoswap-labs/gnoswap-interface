import React from "react";

function IconSwapRight({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      fill="none"
      viewBox="0 0 12 12"
      className={className}
    >
      <g clipPath="url(#clip0_9065_269251)">
        <path
          fill="#C3D2EA"
          d="M7.67 2.67a.58.58 0 000 .823l2.262 2.263H1.083A.585.585 0 00.5 6.34c0 .32.262.583.583.583h8.855L7.675 9.186a.581.581 0 10.823.823l3.26-3.26a.58.58 0 000-.823L8.492 2.67a.58.58 0 00-.823 0z"
        ></path>
      </g>
      <defs>
        <clipPath id="clip0_9065_269251">
          <path
            fill="#fff"
            d="M0 0H12V12H0z"
            transform="rotate(-90 6 6)"
          ></path>
        </clipPath>
      </defs>
    </svg>
  );
}

export default IconSwapRight;
