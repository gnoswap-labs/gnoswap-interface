import { css } from "@emotion/react";
import React, { useCallback } from "react";

interface TokenListPaginationProps {
  currentPage: number;
  totalPage: number;
  movePage: (page: number) => void;
}

const TokenListPagination: React.FC<TokenListPaginationProps> = ({
  currentPage,
  totalPage,
  movePage,
}) => {
  const onClickBefore = useCallback(() => {
    if (currentPage === 1) return;

    movePage(currentPage - 1);
  }, [movePage, currentPage]);

  const onClickAfter = useCallback(() => {
    if (currentPage === totalPage) return;

    movePage(currentPage + 1);
  }, [movePage, currentPage]);

  return (
    <div
      css={css`
        border: 1px solid green;
      `}
    >
      <button onClick={onClickBefore}>{"<"}</button>
      {Array(totalPage)
        .fill(0)
        .map((_, index) => {
          const page = index + 1;

          return (
            <button
              key={page}
              onClick={() => {
                movePage(page);
              }}
              disabled={currentPage === page}
              style={{
                border: currentPage === page ? "1px solid red" : "none",
              }}
            >
              {page}
            </button>
          );
        })}
      <button onClick={onClickAfter}>{">"}</button>
    </div>
  );
};

export default TokenListPagination;
