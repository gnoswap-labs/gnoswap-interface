import { CONTENT_TITLE } from "@components/earn-add/earn-add-liquidity/EarnAddLiquidity";
import React from "react";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import SelectPairButton from "@components/common/select-pair-button/SelectPairButton";
import { wrapper } from "./SelectPair.styles";

interface SelectPairProps {
  active: boolean;
  data: any;
}

const SelectPair: React.FC<SelectPairProps> = ({ active, data }) => {
  return (
    <div css={wrapper(active)}>
      <h5>{CONTENT_TITLE.PAIR}</h5>
      {!active && data && (
        <DoubleLogo
          left={data.token0.tokenLogo}
          right={data.token1.tokenLogo}
          size={24}
        />
      )}
      {active && (
        <div className="select-pair">
          <SelectPairButton token={data?.token0 ?? null} />
          <SelectPairButton token={data?.token1 ?? null} />
        </div>
      )}
    </div>
  );
};

export default SelectPair;
