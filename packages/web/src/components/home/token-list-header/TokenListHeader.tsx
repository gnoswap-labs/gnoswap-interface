import { TOKEN_TYPE } from "@containers/token-list-container/TokenListContainer";
import { css } from "@emotion/react";
import React, { useCallback, useRef } from "react";

interface TokenListHeaderProps {
  tokenType: TOKEN_TYPE;
  changeTokenType: (newTokenType: TOKEN_TYPE) => void;
  search: (keyword: string) => void;
}

const TokenListHeader: React.FC<TokenListHeaderProps> = ({
  tokenType,
  changeTokenType,
  search,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const onSearch = useCallback(() => {
    if (inputRef.current === null) return;

    search(inputRef.current.value);
  }, [search]);

  const onClickAll = useCallback(() => {
    changeTokenType(TOKEN_TYPE.ALL);
  }, [changeTokenType]);

  const onClickGrc20 = useCallback(() => {
    changeTokenType(TOKEN_TYPE.GRC20);
  }, [changeTokenType]);

  return (
    <div
      css={css`
        border: 1px solid green;
      `}
    >
      Tokens
      <button
        onClick={onClickAll}
        disabled={tokenType === TOKEN_TYPE.ALL}
        style={{
          border: tokenType === TOKEN_TYPE.ALL ? "1px solid red" : "none",
        }}
      >
        ALL
      </button>
      <button
        onClick={onClickGrc20}
        disabled={tokenType === TOKEN_TYPE.GRC20}
        style={{
          border: tokenType === TOKEN_TYPE.GRC20 ? "1px solid red" : "none",
        }}
      >
        GRC20
      </button>
      <input ref={inputRef} />
      <button onClick={onSearch}>search</button>
    </div>
  );
};

export default TokenListHeader;
