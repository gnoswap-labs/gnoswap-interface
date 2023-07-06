import React from "react";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import { type BestPool } from "@containers/best-pools-container/BestPoolsContainer";
import { tokenPairSymbolToOneCharacter } from "@utils/string-utils";
import { wrapper } from "./BestPoolCardList.styles";

interface BestPoolCardListProps {
  list: BestPool[];
}

const LIST_TITLE = ["Pair", "TVL", "APR"];

const BestPoolCardList: React.FC<BestPoolCardListProps> = ({ list }) => {
  return (
    <div css={wrapper}>
      <div className="title-wrap">
        {LIST_TITLE.map((item, idx) => (
          <span key={idx} className={item.toLowerCase()}>
            {item}
          </span>
        ))}
      </div>
      <ul>
        {list.map((info, idx) => (
          <li key={idx}>
            <DoubleLogo
              left={info.tokenPair.token0.tokenLogo}
              right={info.tokenPair.token1.tokenLogo}
              size={20}
            />
            <span className="symbol">
              {tokenPairSymbolToOneCharacter(info.tokenPair)}
            </span>
            <span className="fee-rate">{info.feeRate}</span>
            <span className="tvl">{info.tvl}</span>
            <span className="apr">{info.apr}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BestPoolCardList;
