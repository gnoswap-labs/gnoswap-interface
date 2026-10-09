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
  CHART: {
    container: 40,
    circle: 32,
    mobileContainer: 40,
    mobileCircle: 32,
  },
  MEDIUM: {
    container: 60,
    circle: 48,
    mobileContainer: 50,
    mobileCircle: 38,
  },
} as const;

const LoadingSpinner = ({
  className,
  size = "DEFAULT",
  delay = 0,
}: {
  className?: string;
  size?: keyof typeof LOADING_SIZE_MAP;
  delay?: number;
}) => {
  return (
    <LoadingSpinnerWrapper className={className} delay={delay} hollow={size === "CHART"} {...LOADING_SIZE_MAP[size]} />
  );
};

export default LoadingSpinner;
