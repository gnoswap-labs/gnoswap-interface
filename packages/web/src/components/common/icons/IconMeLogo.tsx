import { useTheme } from "@emotion/react";

const IconMeLogo = ({ className }: { className?: string }) => {
  const theme = useTheme();

  return theme.themeKey === "light" ? (
    <svg
      width="34"
      height="20"
      viewBox="0 0 34 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect
        x="0.5"
        y="0.5"
        width="33"
        height="19"
        rx="3.5"
        fill="#E0E8F4"
        fill-opacity="0.4"
      />
      <rect x="0.5" y="0.5" width="33" height="19" rx="3.5" stroke="#E0E8F4" />
      <path
        d="M9.14631 5.77273H10.7443L13.5227 12.5568H13.625L16.4034 5.77273H18.0014V14.5H16.7486V8.18466H16.6676L14.0938 14.4872H13.054L10.4801 8.1804H10.3991V14.5H9.14631V5.77273ZM22.6346 14.6321C21.9897 14.6321 21.4343 14.4943 20.9684 14.2188C20.5053 13.9403 20.1474 13.5497 19.8945 13.0469C19.6445 12.5412 19.5195 11.9489 19.5195 11.2699C19.5195 10.5994 19.6445 10.0085 19.8945 9.49716C20.1474 8.9858 20.4996 8.58665 20.9513 8.29972C21.4059 8.01278 21.9371 7.86932 22.5451 7.86932C22.9144 7.86932 23.2724 7.9304 23.619 8.05256C23.9656 8.17472 24.2766 8.36648 24.5522 8.62784C24.8278 8.8892 25.0451 9.22869 25.2042 9.64631C25.3633 10.0611 25.4428 10.5653 25.4428 11.1591V11.6108H20.2397V10.6562H24.1942C24.1942 10.321 24.1261 10.0241 23.9897 9.76562C23.8533 9.50426 23.6616 9.2983 23.4144 9.14773C23.1701 8.99716 22.8832 8.92188 22.5536 8.92188C22.1957 8.92188 21.8832 9.00994 21.6161 9.18608C21.3519 9.35937 21.1474 9.58665 21.0025 9.8679C20.8604 10.1463 20.7894 10.4489 20.7894 10.7756V11.5213C20.7894 11.9588 20.8661 12.331 21.0195 12.6378C21.1758 12.9446 21.3931 13.179 21.6715 13.3409C21.9499 13.5 22.2752 13.5795 22.6474 13.5795C22.8888 13.5795 23.109 13.5455 23.3079 13.4773C23.5067 13.4062 23.6786 13.3011 23.8235 13.1619C23.9684 13.0227 24.0792 12.8509 24.1559 12.6463L25.3619 12.8636C25.2653 13.2187 25.092 13.5298 24.842 13.7969C24.5948 14.0611 24.2837 14.267 23.9087 14.4148C23.5366 14.5597 23.1119 14.6321 22.6346 14.6321Z"
        fill="#90A2C0"
      />
    </svg>
  ) : (
    <svg
      width="34"
      height="20"
      viewBox="0 0 34 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect
        x="0.5"
        y="0.5"
        width="33"
        height="19"
        rx="3.5"
        fill="#141A29"
        fill-opacity="0.5"
      />
      <rect x="0.5" y="0.5" width="33" height="19" rx="3.5" stroke="#596782" />
      <path
        d="M9.14631 5.77273H10.7443L13.5227 12.5568H13.625L16.4034 5.77273H18.0014V14.5H16.7486V8.18466H16.6676L14.0938 14.4872H13.054L10.4801 8.1804H10.3991V14.5H9.14631V5.77273ZM22.6346 14.6321C21.9897 14.6321 21.4343 14.4943 20.9684 14.2188C20.5053 13.9403 20.1474 13.5497 19.8945 13.0469C19.6445 12.5412 19.5195 11.9489 19.5195 11.2699C19.5195 10.5994 19.6445 10.0085 19.8945 9.49716C20.1474 8.9858 20.4996 8.58665 20.9513 8.29972C21.4059 8.01278 21.9371 7.86932 22.5451 7.86932C22.9144 7.86932 23.2724 7.9304 23.619 8.05256C23.9656 8.17472 24.2766 8.36648 24.5522 8.62784C24.8278 8.8892 25.0451 9.22869 25.2042 9.64631C25.3633 10.0611 25.4428 10.5653 25.4428 11.1591V11.6108H20.2397V10.6562H24.1942C24.1942 10.321 24.1261 10.0241 23.9897 9.76562C23.8533 9.50426 23.6616 9.2983 23.4144 9.14773C23.1701 8.99716 22.8832 8.92188 22.5536 8.92188C22.1957 8.92188 21.8832 9.00994 21.6161 9.18608C21.3519 9.35937 21.1474 9.58665 21.0025 9.8679C20.8604 10.1463 20.7894 10.4489 20.7894 10.7756V11.5213C20.7894 11.9588 20.8661 12.331 21.0195 12.6378C21.1758 12.9446 21.3931 13.179 21.6715 13.3409C21.9499 13.5 22.2752 13.5795 22.6474 13.5795C22.8888 13.5795 23.109 13.5455 23.3079 13.4773C23.5067 13.4062 23.6786 13.3011 23.8235 13.1619C23.9684 13.0227 24.0792 12.8509 24.1559 12.6463L25.3619 12.8636C25.2653 13.2187 25.092 13.5298 24.842 13.7969C24.5948 14.0611 24.2837 14.267 23.9087 14.4148C23.5366 14.5597 23.1119 14.6321 22.6346 14.6321Z"
        fill="#C3D2EA"
      />
    </svg>
  );
};

export default IconMeLogo;
