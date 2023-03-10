import { css } from "@emotion/react";
import React from "react";

interface CardListProps {}

const CardList: React.FC<CardListProps> = () => {
  return (
    <div
      css={css`
        border: 1px solid yellow;
      `}
    >
      CardList
    </div>
  );
};

export default CardList;
