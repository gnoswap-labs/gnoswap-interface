import React from "react";
import MyLiquidityContent from "@components/pool/my-liquidity-content/MyLiquidityContent";
import MyLiquidityHeader from "@components/pool/my-liquidity-header/MyLiquidityHeader";
import { wrapper } from "./MyLiquidity.styles";

interface MyLiquidityProps {
  info: any;
}

const MyLiquidity: React.FC<MyLiquidityProps> = ({ info }) => {
  return (
    <div css={wrapper}>
      <MyLiquidityHeader info={info.poolInfo} />
      <MyLiquidityContent content={info} />
    </div>
  );
};

export default MyLiquidity;
