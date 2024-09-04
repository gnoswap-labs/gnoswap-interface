import React from "react";

import { TokenChangeInfo } from "@models/token/token-change-info";

import GainerCardList from "./gainer-card-list/GainerCardList";
import LoserCardList from "./loser-card-list/LoserCardList";

import { wrapper } from "./GainerAndLoser.styles";

interface GainerAndLoserProps {
  gainers: TokenChangeInfo[];
  losers: TokenChangeInfo[];
  loadingGain: boolean;
  loadingLose: boolean;
}

const GainerAndLoser: React.FC<GainerAndLoserProps> = ({ gainers, losers, loadingLose, loadingGain }) => {
  return (
    <div css={wrapper}>
      <GainerCardList gainers={gainers} loadingGain={loadingGain}/>
      <LoserCardList losers={losers} loadingLose={loadingLose}/>
    </div>
  );
};

export default GainerAndLoser;
