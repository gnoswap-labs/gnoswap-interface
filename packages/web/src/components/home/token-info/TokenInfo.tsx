import { type Token } from "@containers/token-list-container/TokenListContainer";
import { css } from "@emotion/react";
import React from "react";

type TokenInfoProps = Token;

const TokenInfo: React.FC<TokenInfoProps> = ({ id }) => {
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

export default TokenInfo;
