import { type Token } from "@containers/token-list-container/TokenListContainer";
import { css } from "@emotion/react";
import React from "react";
import TokenInfo from "@components/home/token-info/TokenInfo";

interface TokenListTableProps {
  tokens: Token[] | undefined;
}

const TokenListTable: React.FC<TokenListTableProps> = ({ tokens }) => {
  return (
    <div
      css={css`
        border: 1px solid green;
      `}
    >
      {tokens === undefined && <div>loading...</div>}
      {tokens !== undefined &&
        tokens.map(token => <TokenInfo {...token} key={token.id} />)}
    </div>
  );
};

export default TokenListTable;
