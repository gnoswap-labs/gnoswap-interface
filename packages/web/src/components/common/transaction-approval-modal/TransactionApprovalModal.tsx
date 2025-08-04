import React from "react";
import { cx } from "@emotion/css";
import { useTranslation } from "react-i18next";

import { WalletTypeState } from "src/types/wallet.types";
import { formatAddress } from "@utils/string-utils";
import { ALLOWED_DOMAINS } from "@constants/environment.constant";
import { DisplayGasFee } from "@containers/transaction-approval-modal-container/TransactionApprovalModalContainer";
import { GasToken } from "@common/values/token-constant";
import { toNumberFormat } from "@utils/number-utils";

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
  gasFee: DisplayGasFee | null;
  connectedWallet: boolean;
  memoChangeHandler: (memo: string) => void;
}

const DEFAULT_GAS_TOKEN = GasToken;

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
  gasFee,
  connectedWallet,
}: Props) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = React.useState(false);

  const displayGasFee = React.useMemo(() => {
    const amount = gasFee?.amount ?? "0";
    const gasTokenSymbol = gasFee?.gasToken?.symbol ?? DEFAULT_GAS_TOKEN.symbol;
    const usd =
      gasFee?.usdValue == null
        ? "0"
        : Number(gasFee.usdValue) < 0.01
        ? "<$0.01"
        : `$${toNumberFormat(gasFee.usdValue)}`;

    return { amount, gasTokenSymbol, usd };
  }, [gasFee]);

  const isAllowedDomain = React.useMemo(() => {
    return ALLOWED_DOMAINS.includes(window.location.hostname);
  }, []);

  const onChangeMemo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    memoChangeHandler(value);
  };

  const handleConfirm = React.useCallback(() => {
    if (!isAllowedDomain) return;
    onConfirm();
  }, [isAllowedDomain, onConfirm]);

  const toggleExpand = React.useCallback(() => setIsExpanded(prev => !prev), []);

  const truncateText = (text: string, maxLength: number = 28): string => {
    if (text.length <= maxLength) return text;

    return text.substring(0, maxLength) + "...";
  };

  return (
    <TransactionApprovalModalWrapper>
      <TransactionApprovalModalBody>
        <TransactionApprovalModalHeader>
          <div className="title">{t("common:social.modal.transaction.title")}</div>
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
            {!isAllowedDomain && (
              <div className="error-text">{t("common:social.modal.transaction.validation.domain")}</div>
            )}
            <InfoCard>
              <div className="label">{t("common:social.modal.transaction.column.account")}</div>
              <div className="value">
                <RenderWalletIcon isSwitchNetwork={isSwitchNetwork} walletType={walletType} />
                {formatAddress(caller)}
              </div>
            </InfoCard>
            {contracts.map((contract, index) => {
              return (
                <InfoCard key={`${contract.type}-${contract.function}-${index}`} flexDirection="column" gap={16}>
                  <div className="flex-box">
                    <div className="label">{t("common:social.modal.transaction.column.realm")}</div>
                    <div className="value">
                      <span className="text">{truncateText(contract.value.pkg_path)}</span>
                    </div>
                  </div>
                  <div className="flex-box">
                    <div className="label">{t("common:social.modal.transaction.column.function")}</div>
                    <div className="value">
                      <span className="text">{truncateText(contract.function)}</span>
                    </div>
                  </div>
                </InfoCard>
              );
            })}
            <InfoCard>
              <div className="label">{t("common:social.modal.transaction.column.memo")}</div>
              <div className="value">
                <input
                  placeholder={t("common:social.modal.transaction.placeholder.optional")}
                  onChange={onChangeMemo}
                  value={memo}
                />
              </div>
            </InfoCard>
            <InfoCard>
              <div className="label">{t("common:social.modal.transaction.column.networkFee")}</div>
              <div className="value">{`${displayGasFee.amount} ${displayGasFee.gasTokenSymbol} (${displayGasFee.usd})`}</div>
            </InfoCard>
          </TransactionApprovalSummary>
          <TransactionApprovalDetails>
            <button onClick={toggleExpand} aria-expanded={isExpanded}>
              {t("common:social.modal.transaction.view")} {!isExpanded ? <IconArrowDown /> : <IconArrowUp />}
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
            text={t("common:social.modal.transaction.approve")}
            style={{ fullWidth: true, height: 57, fontType: "body7", hierarchy: ButtonHierarchy.Primary }}
            disabled={!isAllowedDomain || !connectedWallet || isSwitchNetwork}
          />
        </TransactionApprovalButtonWrapper>
      </TransactionApprovalModalBody>
    </TransactionApprovalModalWrapper>
  );
};

export default TransactionApprovalModal;
