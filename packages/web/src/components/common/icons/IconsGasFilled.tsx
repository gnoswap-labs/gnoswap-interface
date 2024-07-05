export interface IconGasFilledProps {
  width?: string;
  height?: string;
  className?: string;
}

export const IconGasFilled = ({
  width,
  height,
  className,
}: IconGasFilledProps) => {
  return (
    <svg
      width={width ?? "16"}
      height={height ?? "16"}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M13.0774 4.32L13.0867 4.30867L10.42 2.14867L9.58004 3.18467L10.958 4.30067C10.6162 4.5084 10.3448 4.81417 10.179 5.17822C10.0133 5.54228 9.96091 5.94778 10.0287 6.342C10.1287 6.94133 10.5414 7.45933 11.0754 7.74933C11.672 8.074 12.1954 8.044 12.6607 7.87867L12.6507 12C12.6515 12.1104 12.6248 12.2192 12.5729 12.3167C12.5211 12.4142 12.4458 12.4972 12.3538 12.5582C12.2618 12.6192 12.156 12.6563 12.0461 12.6662C11.9361 12.676 11.8254 12.6583 11.724 12.6147C11.6446 12.5807 11.5726 12.5316 11.512 12.47C11.4504 12.4082 11.4016 12.335 11.3683 12.2543C11.335 12.1737 11.3179 12.0872 11.318 12L11.3334 10.6667C11.334 10.4043 11.2827 10.1443 11.1824 9.90184C11.082 9.65937 10.9346 9.43919 10.7487 9.254C10.563 9.06787 10.3424 8.92019 10.0995 8.81941C9.85666 8.71863 9.59631 8.66672 9.33337 8.66667H8.66671V3.33333C8.66671 2.97971 8.52623 2.64057 8.27618 2.39052C8.02613 2.14048 7.687 2 7.33337 2H2.66671C2.31309 2 1.97395 2.14048 1.7239 2.39052C1.47385 2.64057 1.33337 2.97971 1.33337 3.33333V12.6667C1.33337 13.0203 1.47385 13.3594 1.7239 13.6095C1.97395 13.8595 2.31309 14 2.66671 14H7.33337C7.687 14 8.02613 13.8595 8.27618 13.6095C8.52623 13.3594 8.66671 13.0203 8.66671 12.6667V10H9.33337C9.42404 10 9.51137 10.018 9.59404 10.052C9.7527 10.1215 9.87918 10.2484 9.94804 10.4073C9.98262 10.4894 10.0003 10.5776 10 10.6667L9.98404 12C9.98404 12.2707 10.0367 12.5327 10.1414 12.7787C10.242 13.018 10.3867 13.232 10.5687 13.4127C10.7538 13.5997 10.9742 13.748 11.2173 13.8488C11.4603 13.9496 11.7209 14.001 11.984 14C12.2547 14 12.516 13.948 12.7627 13.8427C13.0014 13.7427 13.216 13.598 13.3967 13.4153C13.5833 13.23 13.7314 13.0095 13.8322 12.7665C13.933 12.5236 13.9846 12.263 13.984 12L14 6C13.9994 5.66508 13.9145 5.3357 13.7533 5.04214C13.5921 4.74858 13.3596 4.50026 13.0774 4.32ZM7.33337 5.33333H2.66671V3.33333H7.33337V5.33333ZM12 6.66667C11.8232 6.66667 11.6537 6.59643 11.5286 6.4714C11.4036 6.34638 11.3334 6.17681 11.3334 6C11.3334 5.82319 11.4036 5.65362 11.5286 5.5286C11.6537 5.40357 11.8232 5.33333 12 5.33333C12.1769 5.33333 12.3464 5.40357 12.4714 5.5286C12.5965 5.65362 12.6667 5.82319 12.6667 6C12.6667 6.17681 12.5965 6.34638 12.4714 6.4714C12.3464 6.59643 12.1769 6.66667 12 6.66667Z"
        fill="#596782"
      />
    </svg>
  );
};