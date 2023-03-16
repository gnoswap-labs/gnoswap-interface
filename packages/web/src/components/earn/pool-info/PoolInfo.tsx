import { type Pool } from "@containers/pool-list-container/PoolListContainer";
import { css } from "@emotion/react";
import React from "react";

type PoolInfoProps = Pool;

const PoolInfo: React.FC<PoolInfoProps> = ({ id }) => {
  return (
    <div
      css={css`
        border: 1px solid yellow;
      `}
    >
      <div>{id}</div>
    </div>
  );
};

export default PoolInfo;
