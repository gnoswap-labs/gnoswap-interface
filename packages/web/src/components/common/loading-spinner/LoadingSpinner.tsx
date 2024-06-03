import { LoadingSpinnerWrapper } from "./LoadingSpinner.styles";

const LOADING_SIZE_MAP = {
  DEFAULT: {
    container: 72,
    circle: 60,
    mobileContainer: 60,
    mobileCircle: 48,
  },
  SMALL: {
    container: 30,
    circle: 22,
    mobileContainer: 30,
    mobileCircle: 22,
  },
} as const;

const LoadingSpinner = ({
  className,
  size = "DEFAULT",
}: {
  className?: string;
  size?: "DEFAULT" | "SMALL";
}) => {
  return (
    <LoadingSpinnerWrapper className={className} {...LOADING_SIZE_MAP[size]} />
  );
};

export default LoadingSpinner;
