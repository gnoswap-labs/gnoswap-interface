import { wrapper } from "./LoadingSpinner.styles";

const LoadingSpinner = ({className} : {className?: string}) => {
  return <div css={wrapper} className={className} />;
};

export default LoadingSpinner;
