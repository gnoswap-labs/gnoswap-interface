import React, { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import IconArrowDown from "@components/common/icons/IconArrowDown";
import IconArrowUp from "@components/common/icons/IconArrowUp";
import IconInfo from "@components/common/icons/IconInfo";
import Tooltip from "@components/common/tooltip/Tooltip";
import useModalCloseEvent from "@hooks/common/use-modal-close-event";
import { DelegationItemInfo } from "@repositories/governance";

import UndelegateSelectItem from "./undelegate-select-item/UndelegateSelectItem";

import {
  ToolTipContentWrapper,
  UndelegateSelectBox,
  UndelegateSelectWrapper,
} from "./UndelegateSelect.styles";

export interface UndelegateSelectProps {
  selectedDelegationInfo: DelegationItemInfo | null;
  delegatedInfos: DelegationItemInfo[];
  select: (item: DelegationItemInfo) => void;
  isDisabled?: boolean;
}

const UndelegateSelect: React.FC<UndelegateSelectProps> = ({
  selectedDelegationInfo,
  delegatedInfos,
  select,
  isDisabled,
}) => {
  const { t } = useTranslation();

  const [openedSelector, setOpenedSelector] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeModal = useCallback(() => setOpenedSelector(false), []);

  useModalCloseEvent(modalRef, closeModal);

  const toggleSelector = useCallback(() => {
    if (!openedSelector) {
      // forceRefetch({ queryKey: [QUERY_KEY.delegatedInfos] });
    }
    setOpenedSelector(!openedSelector);
  }, [openedSelector]);

  return (
    <UndelegateSelectWrapper isDisabled={isDisabled}>
      <div className="section-title">
        {t("Governance:myDel.undelModal.step1.title")}
        <Tooltip
          placement="top"
          FloatingContent={
            <ToolTipContentWrapper>
              {t("Governance:myDel.delModal.step1.tooltip")}
            </ToolTipContentWrapper>
          }
        >
          <IconInfo size={16} />
        </Tooltip>
      </div>
      <div className="undelegate-select-wrapper" onClick={toggleSelector}>
        <UndelegateSelectItem
          delegationItemInfo={selectedDelegationInfo}
          visibleAmount={true}
          onSelectedArea={true}
          select={toggleSelector}
        />
        {!isDisabled && (
          <div className="icon-wrapper">
            {openedSelector ? (
              <IconArrowUp className="icon-arrow" />
            ) : (
              <IconArrowDown className="icon-arrow" />
            )}
          </div>
        )}

        <UndelegateSelectBox
          ref={modalRef}
          className={openedSelector ? "open" : ""}
          onClick={e => e.stopPropagation()}
        >
          <div className="delegate-list-wrapper">
            <div className="delegate-list-headrer">
              <span className="delegatee-info">
                {t("Governance:myDel.undelModal.step1.select.delegate")}
              </span>
              <span className="amount-info">
                {t("Governance:myDel.undelModal.step1.select.amount")}
              </span>
            </div>
            <div className="delegate-list-content">
              {delegatedInfos.map((item, index) => (
                <UndelegateSelectItem
                  key={index}
                  delegationItemInfo={item}
                  visibleAmount={true}
                  select={() => {
                    select(item);
                    setOpenedSelector(false);
                  }}
                />
              ))}
            </div>
          </div>
        </UndelegateSelectBox>
      </div>
    </UndelegateSelectWrapper>
  );
};

export default UndelegateSelect;
