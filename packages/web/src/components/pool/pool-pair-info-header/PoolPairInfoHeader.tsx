import React from "react";
import { wrapper } from "./PoolPairInfoHeader.styles";

interface PoolPairInfoHeaderProps {
  info: any;
}

const PoolPairInfoHeader: React.FC<PoolPairInfoHeaderProps> = ({ info }) => {
  return <div css={wrapper}>PoolPairInfoHeader</div>;
};

export default PoolPairInfoHeader;
