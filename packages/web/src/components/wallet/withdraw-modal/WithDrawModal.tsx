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
import { useTheme } from "@emotion/react";
import useEscCloseModal from "@hooks/common/use-esc-close-modal";
import { usePositionModal } from "@hooks/common/use-postion-modal";
import { useTokenData } from "@hooks/token/use-token-data";
import { useWallet } from "@hooks/wallet/use-wallet";
import { TokenModel } from "@models/token/token-model";
import { DEVICE_TYPE } from "@styles/media";
import { formatPrice } from "@utils/new-number-utils";
import { convertToKMB } from "@utils/stake-position-utils";
import { capitalize } from "@utils/string-utils";
import { addressValidationCheck } from "@utils/validation-utils";
import BigNumber from "bignumber.js";
import React, { useCallback, useRef, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  WithDrawModalBackground,
  WithDrawModalWrapper,
  WithdrawContent,
  WithdrawTooltipContent,
  WithDrawWarningContentWrapper,
} from "./WithDrawModal.styles";

const DEFAULT_WITHDRAW_GNOT = GNOT_TOKEN;

interface Props {
  close: () => void;
  breakpoint: DEVICE_TYPE;
  withdrawInfo?: TokenModel;
  avgBlockTime: number;
  connected: boolean;
  changeToken: (token: TokenModel) => void;
  callback?: (value: boolean) => void;
  handleSubmit: (amount: string, address: string) => void;
  setIsConfirm: () => void;
  isConfirm: boolean;
}

function isAmount(str: string) {
  const regex = /^\d+(\.\d*)?$/;
  return regex.test(str);
}

const WithDrawModal: React.FC<Props> = ({
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
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");

  const { account } = useWallet();

  const { tokens, tokenPrices, displayBalanceMap } = useTokenData();

  useEscCloseModal(close);
  usePositionModal(modalRef);

  const onChangeAmount = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      if (value !== "" && !isAmount(value)) return;
      setAmount(value.replace(/^0+(?=\d)|(\.\d*)$/g, "$1"));
    },
    [],
  );

  const onChangeAddress = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setAddress(value);
    },
    [],
  );

  const onSubmit = () => {
    if (!withdrawInfo || !account?.address) return;

    setIsConfirm();
    handleSubmit(amount, address);
  };

  const nativeToken = useMemo(() => {
    if (!tokens || tokens.length === 0) return null;
    return tokens.find(token => token.type === "native");
  }, [tokens]);

  const currentAvailableBalance = useMemo(
    () => displayBalanceMap?.[withdrawInfo?.path ?? ""] ?? null,
    [displayBalanceMap, withdrawInfo?.path],
  );

  const isDisabledWithdraw =
    !Number(amount ?? 0) ||
    !address ||
    !withdrawInfo ||
    !addressValidationCheck(address) ||
    BigNumber(amount || "0").isGreaterThan(
      BigNumber(currentAvailableBalance || "0"),
    );

  const estimateFee = useMemo(() => 0.000001, []);

  const estimateFeeUSD = useMemo(
    () =>
      0.000001 *
      (Number(tokenPrices?.[nativeToken?.wrappedPath ?? ""]?.usd) || 0),
    [nativeToken?.wrappedPath, tokenPrices],
  );

  const estimatePrice = useMemo(
    () =>
      withdrawInfo?.wrappedPath && !!amount && amount !== "0"
        ? "$" +
          convertToKMB(
            BigNumber(+amount)
              .multipliedBy(
                Number(tokenPrices?.[withdrawInfo?.wrappedPath]?.usd ?? "0"),
              )
              .toString(),
            {
              isIgnoreKFormat: true,
            },
          )
        : "-",
    [amount, tokenPrices, withdrawInfo?.wrappedPath],
  );

  const handleEnterAllBalanceAvailable = () => {
    if (currentAvailableBalance) {
      setAmount(`${currentAvailableBalance}`);
    }
  };
  const buttonText = useMemo(() => {
    if (!withdrawInfo) {
      return t("Wallet:withdrawModal.btn.selectToken");
    }
    if (amount === "") {
      return t("Wallet:withdrawModal.btn.enterAmt");
    }
    if (Number(amount) < 0.000001) {
      return t("Wallet:withdrawModal.btn.lowAmt");
    }
    if (
      (currentAvailableBalance &&
        BigNumber(amount).isGreaterThan(BigNumber(currentAvailableBalance))) ||
      !Number(amount || 0)
    ) {
      return t("Wallet:withdrawModal.btn.insuffBal");
    }
    if (address === "") return t("Wallet:withdrawModal.btn.enterAddr");
    if (!addressValidationCheck(address))
      return t("Wallet:withdrawModal.btn.invalidAddr");
    return t("Wallet:withdrawModal.btn.withdraw");
  }, [address, amount, currentAvailableBalance, withdrawInfo, t]);

  const estimatedPrice = useMemo(() => {
    if (estimateFeeUSD < 0.01) return " (<$0.01)";

    return estimateFeeUSD !== 0 ? ` ($${estimateFeeUSD})` : "";
  }, [estimateFeeUSD]);

  if (isConfirm) {
    return null;
  }

  return (
    <>
      <WithDrawModalBackground>
        <WithDrawModalWrapper ref={modalRef}>
          <div className="modal-body">
            <div className="header">
              <h6>{capitalize(t("Wallet:withdrawModal.title"))}</h6>
              <div className="close-wrap" onClick={close}>
                <IconClose className="close-icon" />
              </div>
            </div>

            <WithdrawContent>
              <p className="label">
                {t("Wallet:withdrawModal.selectToken.label")}
              </p>
              <div className="withdraw">
                <div className="amount">
                  <input
                    className="amount-text"
                    value={amount}
                    onChange={onChangeAmount}
                    placeholder="0"
                  />
                  <div className="token">
                    <SelectPairButton
                      token={withdrawInfo ?? null}
                      changeToken={changeToken}
                      callback={callback}
                    />
                  </div>
                </div>
                <div className="info">
                  <span className="price-text">{estimatePrice}</span>
                  <span
                    className="balance-text"
                    onClick={handleEnterAllBalanceAvailable}
                  >{`${t("common:available")}: ${
                    currentAvailableBalance
                      ? formatPrice(currentAvailableBalance, {
                          isKMB: false,
                          usd: false,
                        })
                      : "-"
                  }`}</span>
                </div>
              </div>
            </WithdrawContent>

            <WithdrawContent>
              <div className="title">
                <label>{t("Wallet:withdrawModal.withdrawNet.label")}</label>
                <WithdrawTooltip
                  tooltip={t("Wallet:withdrawModal.withdrawNet.tooltip")}
                />
              </div>

              <div className="withdraw">
                <div className="withdrawal-network">
                  <div className="network">
                    <img
                      src={DEFAULT_WITHDRAW_GNOT.logoURI}
                      alt="token logo"
                      className="token-logo"
                    />
                    <span className="token-symbol">Gnoland (GRC20)</span>
                  </div>

                  <div className="approximately">
                    {t("Wallet:withdrawModal.second", {
                      avgBlockTime: (
                        Math.floor(avgBlockTime * 10) / 10
                      ).toFixed(1),
                    })}
                  </div>
                </div>
              </div>
            </WithdrawContent>

            <WithdrawContent>
              <div className="title">
                <label>{t("Wallet:withdrawModal.withdrawAddr.label")}</label>
                <WithdrawTooltip
                  tooltip={t("Wallet:withdrawModal.withdrawAddr.tooltip")}
                />
              </div>

              <div className="withdraw">
                <div className="withdraw-address">
                  <input
                    className="address-input"
                    value={address}
                    onChange={onChangeAddress}
                    placeholder={t("Wallet:withdrawModal.enterAddr.input")}
                  />
                </div>
              </div>
            </WithdrawContent>

            <WarningCard
              icon={<IconCircleExclamationMark />}
              title={t("Wallet:withdrawModal.warning.title")}
              content={
                <WithDrawWarningContentWrapper>
                  <ul>
                    <li>{t("Wallet:withdrawModal.warning.content1")}</li>
                    <li>{t("Wallet:withdrawModal.warning.content2")}</li>
                    <li>{t("Wallet:withdrawModal.warning.content3")}</li>
                  </ul>

                  <a
                    href="https://beta.gnoswap.io/"
                    target="_blank"
                    className="learn-more-box"
                  >
                    <p>{t("common:learnMore")}</p>
                    <IconNewTab color={theme.color.icon21} />
                  </a>
                </WithDrawWarningContentWrapper>
              }
            />
            <WithdrawContent>
              <div className="estimate-box">
                <p className="estimate-fee">
                  {t("Wallet:withdrawModal.estNetFee")}
                </p>
                <p className="tokens-fee">{`${estimateFee} GNOT${estimatedPrice}`}</p>
              </div>
            </WithdrawContent>

            <Button
              disabled={isDisabledWithdraw}
              onClick={onSubmit}
              text={buttonText}
              className="btn-withdraw"
              style={{
                fullWidth: true,
                textColor: "text09",
                fontType: breakpoint !== DEVICE_TYPE.MOBILE ? "body7" : "body9",
                hierarchy:
                  connected && !isDisabledWithdraw
                    ? ButtonHierarchy.Primary
                    : undefined,
                bgColor:
                  !connected || isDisabledWithdraw ? "background17" : undefined,
              }}
            />
          </div>
        </WithDrawModalWrapper>
      </WithDrawModalBackground>
      <Overlay onClick={close} />
    </>
  );
};

export default WithDrawModal;

export const WithdrawTooltip: React.FC<{ tooltip: string }> = ({ tooltip }) => {
  const TooltipFloatingContent = (
    <WithdrawTooltipContent>{tooltip}</WithdrawTooltipContent>
  );

  return (
    <Tooltip placement="top" FloatingContent={TooltipFloatingContent}>
      <IconInfo size={16} />
    </Tooltip>
  );
};
