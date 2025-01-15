import React from "react";
import { cx } from "@emotion/css";

import {
  ApproveTransactionButtonWrapper,
  ApproveTransactionDetails,
  ApproveTransactionModalBody,
  ApproveTransactionModalContents,
  ApproveTransactionModalHeader,
  ApproveTransactionModalWrapper,
  ApproveTransactionSummary,
  InfoCard,
} from "./ApproveTransactionModal.styles";
import IconClose from "@components/common/icons/IconCancel";
import IconAdenaLogo from "../icons/defaultIcon/IconAdenaLogo";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconArrowDown from "../icons/IconArrowDown";
import IconArrowUp from "../icons/IconArrowUp";
import { Document, TransactionData } from "src/types/transaction-messages.types";

interface Props {
  onConfirm: () => void;
  onCancel: () => void;
  document: Document;
  transactionData?: TransactionData;

  contracts: {
    type: string;
    function: string;
    value: string;
  }[];
  transactionMessageRaw: string;
}

const ApproveTransactionModal = ({ onConfirm, onCancel, contracts, transactionMessageRaw }: Props) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <ApproveTransactionModalWrapper>
      <ApproveTransactionModalBody>
        <ApproveTransactionModalHeader>
          <div className="title">Approve Transaction</div>
          <div className="close-wrapper">
            <button className="close-button" onClick={onCancel}>
              <IconClose className="close-icon" />
            </button>
          </div>
        </ApproveTransactionModalHeader>

        <ApproveTransactionModalContents>
          <ApproveTransactionSummary>
            <InfoCard justify="center" gap={8}>
              <IconAdenaLogo />
              <span className="value">{location.origin}</span>
            </InfoCard>
            <InfoCard>
              <div className="label">Account</div>
              <div className="value">g1as...aw1</div>
            </InfoCard>
            {contracts.map((contract, index) => {
              return (
                <InfoCard
                  key={`${contract.type}-${contract.function}-${contract.value}-${index}`}
                  flexDirection="column"
                  gap={16}
                >
                  <div className="flex-box">
                    <div className="label">Contract</div>
                    <div className="value">{contract.type}</div>
                  </div>
                  <div className="flex-box">
                    <div className="label">Function</div>
                    <div className="value">{contract.function}</div>
                  </div>
                </InfoCard>
              );
            })}
            <InfoCard>
              <div className="label">Memo</div>
              <div className="value">
                <input placeholder="(Optional)" />
              </div>
            </InfoCard>
            <InfoCard>
              <div className="label">Network Fee</div>
              <div className="value">{"0.000001 GNOT (<$0.01)"}</div>
            </InfoCard>
          </ApproveTransactionSummary>
          <ApproveTransactionDetails>
            <button onClick={() => setIsExpanded(prev => !prev)} aria-expanded={isExpanded}>
              View Transaction Data {isExpanded ? <IconArrowDown /> : <IconArrowUp />}
            </button>

            <div
              className={cx("transaction-messages", { expanded: isExpanded })}
              style={{ maxHeight: isExpanded ? 194 : 0 }}
            >
              <pre className="json-viewer">{transactionMessageRaw}</pre>
            </div>
          </ApproveTransactionDetails>
        </ApproveTransactionModalContents>

        <ApproveTransactionButtonWrapper>
          <Button
            onClick={onConfirm}
            text={"Approve"}
            style={{ fullWidth: true, height: 57, fontType: "body7", hierarchy: ButtonHierarchy.Primary }}
          />
          <Button
            onClick={onCancel}
            text={"Cancel"}
            style={{ fullWidth: true, height: 57, fontType: "body7", hierarchy: ButtonHierarchy.Dark }}
          />
        </ApproveTransactionButtonWrapper>
      </ApproveTransactionModalBody>
    </ApproveTransactionModalWrapper>
  );
};

export default ApproveTransactionModal;
