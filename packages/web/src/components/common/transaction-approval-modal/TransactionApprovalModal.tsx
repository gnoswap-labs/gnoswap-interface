import React from "react";
import { cx } from "@emotion/css";

import { WalletTypeState } from "src/types/wallet.types";
import { formatAddress } from "@utils/string-utils";
import { ALLOWED_DOMAINS } from "@constants/environment.constant";

import {
  TransactionApprovalButtonWrapper,
  TransactionApprovalDetails,
  TransactionApprovalModalBody,
  TransactionApprovalModalContents,
  TransactionApprovalModalHeader,
  TransactionApprovalModalWrapper,
  TransactionApprovalSummary,
  InfoCard,
} from "./TransactionApprovalModal.styles";
import IconClose from "@components/common/icons/IconCancel";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconArrowDown from "../icons/IconArrowDown";
import IconArrowUp from "../icons/IconArrowUp";
import RenderWalletIcon from "../header/wallet-connector-button/RenderWalletIcon";
import IconGnoswapLogo from "../icons/defaultIcon/IconGnoswapLogo";

interface Props {
  onConfirm: () => void;
  onCancel: () => void;
  caller: string;
  contracts: {
    type: string;
    function: string;
    value: {
      pkg_path: string;
    };
  }[];
  transactionMessageRaw: string;
  memo: string;
  isSwitchNetwork: boolean;
  walletType: WalletTypeState;
  memoChangeHandler: (memo: string) => void;
}

const TransactionApprovalModal = ({
  onConfirm,
  onCancel,
  caller,
  contracts,
  transactionMessageRaw,
  memo,
  isSwitchNetwork,
  walletType,
  memoChangeHandler,
}: Props) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isAllowedDomain, setIsAllowedDomain] = React.useState(true);

  const onChangeMemo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    memoChangeHandler(value);
  };

  React.useEffect(() => {
    const hostname = window.location.hostname;

    if (ALLOWED_DOMAINS.includes(hostname)) {
      setIsAllowedDomain(true);
    } else {
      setIsAllowedDomain(false);
    }
  }, []);

  const handleConfirm = () => {
    if (!isAllowedDomain) {
      onConfirm();
    }
  };

  return (
    <TransactionApprovalModalWrapper>
      <TransactionApprovalModalBody>
        <TransactionApprovalModalHeader>
          <div className="title">Approve Transaction</div>
          <div className="close-wrapper">
            <button className="close-button" onClick={onCancel}>
              <IconClose className="close-icon" />
            </button>
          </div>
        </TransactionApprovalModalHeader>

        <TransactionApprovalModalContents>
          <TransactionApprovalSummary>
            <InfoCard className={cx({ red: !isAllowedDomain })} justify="center" gap={8}>
              <IconGnoswapLogo />
              <span className="value">{location.origin}</span>
            </InfoCard>
            {!isAllowedDomain && <div className="error-text">Possible phishing warning. Check domain carefully.</div>}
            <InfoCard>
              <div className="label">Account</div>
              <div className="value">
                <RenderWalletIcon isSwitchNetwork={isSwitchNetwork} walletType={walletType} />
                {formatAddress(caller)}
              </div>
            </InfoCard>
            {contracts.map((contract, index) => {
              return (
                <InfoCard key={`${contract.type}-${contract.function}-${index}`} flexDirection="column" gap={16}>
                  <div className="flex-box">
                    <div className="label">Realm</div>
                    <div className="value">{contract.value.pkg_path}</div>
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
                <input placeholder="(Optional)" onChange={onChangeMemo} value={memo} />
              </div>
            </InfoCard>
            <InfoCard>
              <div className="label">Network Fee</div>
              <div className="value">{"0.000001 GNOT (<$0.01)"}</div>
            </InfoCard>
          </TransactionApprovalSummary>
          <TransactionApprovalDetails>
            <button onClick={() => setIsExpanded(prev => !prev)} aria-expanded={isExpanded}>
              View Transaction Data {!isExpanded ? <IconArrowDown /> : <IconArrowUp />}
            </button>

            <div
              className={cx("transaction-messages", { expanded: isExpanded })}
              style={{ maxHeight: isExpanded ? 194 : 0 }}
            >
              <pre className="json-viewer">{transactionMessageRaw}</pre>
            </div>
          </TransactionApprovalDetails>
        </TransactionApprovalModalContents>

        <TransactionApprovalButtonWrapper>
          <Button
            onClick={handleConfirm}
            text={"Approve"}
            style={{ fullWidth: true, height: 57, fontType: "body7", hierarchy: ButtonHierarchy.Primary }}
            disabled={isAllowedDomain}
          />
        </TransactionApprovalButtonWrapper>
      </TransactionApprovalModalBody>
    </TransactionApprovalModalWrapper>
  );
};

export default TransactionApprovalModal;
