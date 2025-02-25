import { useTheme } from "@emotion/react";

const IconEmailLogo = ({ className }: { className?: string }) => {
  const theme = useTheme();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={className}
    >
      <path
        d="M14.8574 3H1.14307V13H14.8574V3Z"
        stroke={theme.themeKey === "dark" ? "#596782" : "#90A2C0"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.71436 3.03711L7.99951 8.66602L14.2858 3.03711"
        stroke={theme.themeKey === "dark" ? "#596782" : "#90A2C0"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IconEmailLogo;
