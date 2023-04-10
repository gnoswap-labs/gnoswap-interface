import React from "react";
import { wrapper } from "./PoolPairInformation.styles";

interface PoolPairInformationProps {
  header: React.ReactNode;
  content: React.ReactNode;
}

const PoolPairInformation: React.FC<PoolPairInformationProps> = ({
  header,
  content,
}) => {
  return (
    <div css={wrapper}>
      {header}
      {content}
    </div>
  );
};

export default PoolPairInformation;
