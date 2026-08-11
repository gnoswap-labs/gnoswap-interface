import { useTheme } from "@emotion/react";
import Link from "next/link";
import BigNumber from "bignumber.js";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { GNOT_TOKEN } from "@common/values/token-constant";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconClose from "@components/common/icons/IconCancel";
import { IconCircleExclamationMark } from "@components/common/icons/IconExclamationRound";
import IconInfo from "@components/common/icons/IconInfo";
import IconNewTab from "@components/common/icons/IconNewTab";
import { Overlay } from "@components/common/modal/Modal.styles";
import SelectPairButton from "@components/common/select-pair-button/SelectPairButton";
import Tooltip from "@components/common/tooltip/Tooltip";
import WarningCard from "@components/common/warning-card/WarningCard";
import useEscCloseModal from "@hooks/common/use-esc-close-modal";
import { useTokenData } from "@hooks/token/data/use-token-data";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { usePositionModal } from "@hooks/wallet/ui/use-position-modal";
import { TokenModel } from "@models/token/token-model";
import { DEVICE_TYPE } from "@styles/media";
import { formatPrice } from "@utils/new-number-utils";
import { capitalize } from "@utils/string-utils";
import { isAmountLessThanTokenMinimum } from "@utils/token-utils";
import { isValidAddress } from "@utils/validation-utils";

import IconWallet from "@components/common/icons/IconWallet";
import {
  AssetSendContent,
  AssetSendModalBackground,
  AssetSendModalWrapper,
  AssetSendTooltipContent,
  AssetSendWarningContentWrapper,
} from "./AssetSendModal.styles";
import { EXT_URL } from "@constants/external-url.contant";

const DEFAULT_WITHDRAW_GNOT = GNOT_TOKEN;

interface Props {
  amount: string;
  setAmount: React.Dispatch<React.SetStateAction<string>>;
  isConfirm: boolean;
  breakpoint: DEVICE_TYPE;
  withdrawInfo?: TokenModel;
  avgBlockTime: number;
  connected: boolean;

  close: () => void;
  changeToken: (token: TokenModel) => void;
  callback?: (value: boolean) => void;
  handleSubmit: (amount: string, address: string) => void;
  setIsConfirm: () => void;
}

function isAmount(str: string) {
  const regex = /^\d+(\.\d*)?$/;
  return regex.test(str);
}

/**
 * Parses the string-numeric form of amount as a number.
 * All values other than undefined, NaN, and 0 are treated as 0.
 */
const parseAmount = (amount: string | number | undefined): number => Number(amount) || 0;

/**
 * Checks if it is a valid (greater than 0) amount.
 */
const isValidAmount = (amount: string | number | undefined): boolean => parseAmount(amount) > 0;

/**
 * compares the amount and availableBalance to a BigNumber
 * and return whether the withdrawal is possible.
 */
const isBalanceSufficient = (
  amount: string | number | undefined,
  availableBalance: string | number | undefined,
): boolean => {
  if (!amount || !availableBalance) return false;
  return BigNumber(amount.toString()).isLessThanOrEqualTo(BigNumber(availableBalance.toString()));
};

const AssetSendModal: React.FC<Props> = ({
  amount,
  setAmount,
  close,
  breakpoint,
  withdrawInfo,
  avgBlockTime,
  connected,
  changeToken,
  callback,
  handleSubmit,
  setIsConfirm,
  isConfirm,
}) => {
  const { t } = useTranslation();
  const modalRef = useRef<HTMLDivElement | null>(null);
  const theme = useTheme();
  const [address, setAddress] = useState("");

  const { account } = useWallet();

  const { tokenPrices, displayBalanceMap } = useTokenData(true);

  useEscCloseModal(close);
  usePositionModal(modalRef);

  const onChangeAmount = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (!withdrawInfo) return;
      const decimals = withdrawInfo.decimals;

      if (value === "") {
        setAmount("");
        return;
      }

      if (!isAmount(value)) return;

      if (value.includes(".")) {
        const [, decimal] = value.split(".");
        if (decimal && decimal.length > decimals) return;
      }

      setAmount(value.replace(/^0+(?=\d)|(\.\d*)$/g, "$1"));
    },
    [setAmount, withdrawInfo],
  );

  const onChangeAddress = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAddress(value);
  }, []);

  const onSubmit = () => {
    if (!withdrawInfo || !account?.address) return;

    setIsConfirm();
    handleSubmit(amount, address);
  };

  const currentAvailableBalance = useMemo(
    () => displayBalanceMap?.[withdrawInfo?.path ?? ""] ?? null,
    [displayBalanceMap, withdrawInfo?.path],
  );

  const hasTokenBalance = useMemo(() => {
    return !!currentAvailableBalance;
  }, [currentAvailableBalance]);

  const isDisabledWithdraw = useMemo((): boolean => {
    if (!isValidAmount(amount)) return true;

    if (!address || !isValidAddress(address)) return true;

    if (!withdrawInfo) return true;

    if (isAmountLessThanTokenMinimum(withdrawInfo, amount)) return true;

    if (!isBalanceSufficient(amount, currentAvailableBalance ?? "0")) return true;

    return false;
  }, [amount, address, currentAvailableBalance, withdrawInfo]);

  const estimatePrice = useMemo((): string => {
    // If no token data or invalid amount, show placeholder
    if (!withdrawInfo || !isValidAmount(amount)) {
      return "-";
    }

    // Determine the correct price key and retrieve USD price
    const tokenPath = withdrawInfo.wrappedPath || withdrawInfo.path;
    const rawPrice = tokenPrices?.[tokenPath]?.usd;
    const priceInUsd = Number(rawPrice ?? "0");

    // If price is zero or missing, show placeholder
    if (priceInUsd === 0) {
      return "-";
    }

    // Calculate total value: amount * priceInUsd
    const totalValue = BigNumber(amount.toString()).multipliedBy(priceInUsd).toString();

    // Format and return with USD symbol, no KMB, and approximation
    return formatPrice(totalValue, {
      usd: true,
      isKMB: false,
      approx: true,
    });
  }, [amount, tokenPrices, withdrawInfo]);

  const handleEnterAllBalanceAvailable = () => {
    if (currentAvailableBalance) {
      setAmount(`${currentAvailableBalance}`);
    }
  };
  const buttonText = useMemo(() => {
    if (!withdrawInfo) {
      return t("Wallet:assetSendModal.btn.selectToken");
    }
    if (amount === "") {
      return t("Wallet:assetSendModal.btn.enterAmt");
    }
    if (isAmountLessThanTokenMinimum(withdrawInfo, amount)) {
      return t("Wallet:assetSendModal.btn.lowAmt");
    }
    if (
      (currentAvailableBalance && BigNumber(amount).isGreaterThan(BigNumber(currentAvailableBalance))) ||
      !Number(amount ?? 0)
    ) {
      return t("common:btn.insuffiBal");
    }
    if (address === "") return t("Wallet:assetSendModal.btn.enterAddr");
    if (!isValidAddress(address)) return t("Wallet:assetSendModal.btn.invalidAddr");
    return t("Wallet:assets.col.assetSend");
  }, [address, amount, currentAvailableBalance, withdrawInfo, t]);

  if (isConfirm) {
    return null;
  }

  return (
    <>
      <AssetSendModalBackground>
        <AssetSendModalWrapper ref={modalRef}>
          <div className="modal-body">
            <div className="header">
              <h6>{capitalize(t("Wallet:assets.col.assetSend"))}</h6>
              <div className="close-wrap" onClick={close}>
                <IconClose className="close-icon" />
              </div>
            </div>

            <AssetSendContent>
              <p className="label">{t("Wallet:assetSendModal.selectToken.label")}</p>
              <div className="withdraw">
                <div className="amount">
                  <input
                    className="amount-text"
                    value={amount}
                    onChange={onChangeAmount}
                    placeholder="0"
                    autoComplete={"off"}
                    spellCheck={"false"}
                    inputMode={"decimal"}
                  />
                  <div className="token">
                    <SelectPairButton token={withdrawInfo ?? null} changeToken={changeToken} callback={callback} />
                  </div>
                </div>
                <div className="info">
                  <span className="price-text">{estimatePrice}</span>
                  <div className="balance-wrapper">
                    {connected && <IconWallet />}
                    <span className="balance-text">{` ${
                      currentAvailableBalance
                        ? formatPrice(currentAvailableBalance, {
                            isKMB: false,
                            usd: false,
                          })
                        : "-"
                    }`}</span>
                    {hasTokenBalance && (
                      <button className="balance-max-button" onClick={handleEnterAllBalanceAvailable}>
                        {t("common:max")}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </AssetSendContent>

            <AssetSendContent>
              <div className="title">
                <label>{t("Wallet:assetSendModal.network.label")}</label>
                <WithdrawTooltip tooltip={t("Wallet:assetSendModal.network.tooltip")} />
              </div>

              <div className="withdraw">
                <div className="withdrawal-network">
                  <div className="network">
                    <img src={DEFAULT_WITHDRAW_GNOT.logoURI} alt="token logo" className="token-logo" />
                    <span className="token-symbol">{GNOT_TOKEN.name} (GRC20)</span>
                  </div>

                  <div className="approximately">
                    {t("Wallet:assetSendModal.second", {
                      avgBlockTime: (Math.floor(avgBlockTime * 10) / 10).toFixed(1),
                    })}
                  </div>
                </div>
              </div>
            </AssetSendContent>

            <AssetSendContent>
              <div className="title">
                <label>{t("Wallet:assetSendModal.addr.label")}</label>
                <WithdrawTooltip tooltip={t("Wallet:assetSendModal.addr.tooltip")} />
              </div>

              <div className="withdraw">
                <div className="withdraw-address">
                  <input
                    className="address-input"
                    value={address}
                    onChange={onChangeAddress}
                    placeholder={t("Wallet:assetSendModal.enterAddr.input")}
                    autoComplete={"off"}
                    spellCheck={"false"}
                  />
                </div>
              </div>
            </AssetSendContent>

            <WarningCard
              icon={<IconCircleExclamationMark />}
              title={t("Wallet:assetSendModal.warning.title")}
              content={
                <AssetSendWarningContentWrapper>
                  <ul>
                    <li>{t("Wallet:assetSendModal.warning.content1")}</li>
                    <li>{t("Wallet:assetSendModal.warning.content2")}</li>
                    <li>{t("Wallet:assetSendModal.warning.content3")}</li>
                  </ul>

                  <Link href={EXT_URL.DOCS.WITHDRAW} target="_blank" className="learn-more-box">
                    <p>{t("common:learnMore")}</p>
                    <IconNewTab color={theme.color.icon21} />
                  </Link>
                </AssetSendWarningContentWrapper>
              }
            />

            <Button
              disabled={isDisabledWithdraw}
              onClick={onSubmit}
              text={buttonText}
              className="btn-withdraw"
              style={{
                fullWidth: true,
                textColor: "text09",
                fontType: breakpoint !== DEVICE_TYPE.MOBILE ? "body7" : "body9",
                hierarchy: connected && !isDisabledWithdraw ? ButtonHierarchy.Primary : undefined,
                bgColor: !connected || isDisabledWithdraw ? "background17" : undefined,
              }}
            />
          </div>
        </AssetSendModalWrapper>
      </AssetSendModalBackground>
      <Overlay onClick={close} />
    </>
  );
};

export default AssetSendModal;

export const WithdrawTooltip: React.FC<{ tooltip: string }> = ({ tooltip }) => {
  const TooltipFloatingContent = <AssetSendTooltipContent>{tooltip}</AssetSendTooltipContent>;

  return (
    <Tooltip placement="top" FloatingContent={TooltipFloatingContent}>
      <IconInfo size={16} />
    </Tooltip>
  );
};
