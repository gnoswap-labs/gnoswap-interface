import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { DelegationItemInfo } from "@repositories/governance";
import MissingLogo from "@components/common/missing-logo/MissingLogo";

import {
  UndelegateSelectItemDefaultWrapper,
  UndelegateSelectItemWrapper
} from "./UndelegateSelectItem.styles";

export interface UndelegateSelectItemProps {
  delegationItemInfo: DelegationItemInfo | null;
  visibleAmount: boolean;
  onSelectedArea?: boolean;
  select: () => void;
}

const UndelegateSelectItem: React.FC<UndelegateSelectItemProps> = ({
  delegationItemInfo,
  visibleAmount,
  onSelectedArea,
  select,
}) => {
  const { t } = useTranslation();

  const selected = delegationItemInfo !== null;

  const onClickItem = useCallback(() => {
    if (!delegationItemInfo) {
      return;
    }
    select();
  }, [select, delegationItemInfo]);

  if (!selected) {
    return (
      <UndelegateSelectItemDefaultWrapper>
        {t("common:select")}
      </UndelegateSelectItemDefaultWrapper>
    );
  }

  return (
    <UndelegateSelectItemWrapper
      visibleAmount={visibleAmount}
      onClick={onClickItem}
      onSelectedArea={onSelectedArea}
    >
      <div className="left-content-wrapper">
        <MissingLogo
          width={24}
          url={delegationItemInfo.logoUrl}
          symbol={delegationItemInfo.name}
        />
        <span className="delegatee-name">
          {delegationItemInfo.name ||
            [
              delegationItemInfo.address.slice(0, 8),
              delegationItemInfo.address.slice(32, 40),
            ].join("...")}
        </span>
      </div>

      {visibleAmount && (
        <div className="right-content-wrapper">
          <span className="delegated-amount">
            {delegationItemInfo.amount.toLocaleString("en")}
          </span>
        </div>
      )}
    </UndelegateSelectItemWrapper>
  );
};

export default UndelegateSelectItem;
