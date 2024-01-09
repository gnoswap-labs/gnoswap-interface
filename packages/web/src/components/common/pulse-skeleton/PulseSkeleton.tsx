import {
  PulseSkeletonParams,
  pulseSkeletonStyle,
} from "@constants/skeleton.constant";
import React, { FC, PropsWithChildren } from "react";
import { SkeletonWrapper } from "./PulseSkeleton.styles";
import useDelayLoading from "@hooks/common/use-delay-loading";

interface Props extends PulseSkeletonParams {
  loading?: boolean;
  className?: string;
  delay?: number;
}

const DELAY_LOADING = 1500;

const PulseSkeleton: FC<PropsWithChildren<Props>> = ({
  loading: loadingProp = false,
  children,
  w = "100%",
  h = "18px",
  type = "rounded-square",
  delay = DELAY_LOADING,
  className,
  ...props
}) => {
  const [loading] = useDelayLoading(loadingProp, delay);

  if (!loading) return <>{children}</>;
  return (
    <SkeletonWrapper
      className={"skeleton " + className}
      css={pulseSkeletonStyle({ w, h, type, ...props })}
    >
      {children}
    </SkeletonWrapper>
  );
};

export default PulseSkeleton;
