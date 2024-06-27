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
import { toPriceFormat } from "@utils/number-utils";
import { convertToKMB } from "@utils/stake-position-utils";
import { addressValidationCheck } from "@utils/validation-utils";
import BigNumber from "bignumber.js";
import React, { useCallback, useRef, useState, useMemo } from "react";
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
  connected,
  changeToken,
  callback,
  handleSubmit,
  setIsConfirm,
  isConfirm,
}) => {
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
    [displayBalanceMap, withdrawInfo?.path]
  );

  const isDisabledWithdraw =
    !Number(amount ?? 0) ||
    !address ||
    !withdrawInfo ||
    !addressValidationCheck(address) ||
    BigNumber(amount || "0").isGreaterThan(BigNumber(currentAvailableBalance || "0"));

  const estimateFee = useMemo(() => 0.000001, []);

  const estimateFeeUSD = useMemo(
    () => 0.000001 * (Number(tokenPrices?.[nativeToken?.wrappedPath ?? ""]?.usd) || 0),
    [nativeToken?.wrappedPath, tokenPrices]
  );

  const estimatePrice = useMemo(
    () => withdrawInfo?.wrappedPath && !!amount && amount !== "0"
      ? "$" + convertToKMB(
        BigNumber(+amount)
          .multipliedBy(
            Number(tokenPrices?.[withdrawInfo?.wrappedPath]?.usd ?? "0"),
          )
          .toString(), {
        isIgnoreKFormat: true
      })
      : "-",
    [amount, tokenPrices, withdrawInfo?.wrappedPath]
  );

  const handleEnterAllBalanceAvailable = () => {
    if (currentAvailableBalance) {
      setAmount(`${currentAvailableBalance}`);
    }
  };
  const buttonText = useMemo(() => {
    if (!withdrawInfo) {
      return "Select a Token";
    }
    if (amount === "") {
      return "Enter Amount";
    }
    if (Number(amount) < 0.000001) {
      return "Amount Too Low";
    }
    if ((currentAvailableBalance && BigNumber(amount).isGreaterThan(BigNumber(currentAvailableBalance))) || !Number(amount || 0)) {
      return "Insufficient Balance";
    }
    if (address === "") return "Enter an Address";
    if (!addressValidationCheck(address)) return "Invalid Address";
    return "Withdraw";

  }, [address, amount, currentAvailableBalance, withdrawInfo]);

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
              <h6>Withdraw</h6>
              <div className="close-wrap" onClick={close}>
                <IconClose className="close-icon" />
              </div>
            </div>

            <WithdrawContent>
              <p className="label">Select Token</p>
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
                  <span className="price-text">
                    {estimatePrice}
                  </span>
                  <span
                    className="balance-text"
                    onClick={handleEnterAllBalanceAvailable}
                  >{`Available: ${currentAvailableBalance
                    ? toPriceFormat(currentAvailableBalance, {
                      isKMBFormat: false,
                      isRounding: false,
                    }
                    )
                    : "-"
                    }`}</span>
                </div>
              </div>
            </WithdrawContent>

            <WithdrawContent>
              <div className="title">
                <label>Withdrawal Network</label>
                <WithdrawTooltip tooltip="The network of the token to be withdrawn." />
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

                  <div className="approximately">≈ 4 seconds</div>
                </div>
              </div>
            </WithdrawContent>

            <WithdrawContent>
              <div className="title">
                <label>Withdrawal Address</label>
                <WithdrawTooltip tooltip="The withdrawal address that funds will be sent to." />
              </div>

              <div className="withdraw">
                <div className="withdraw-address">
                  <input
                    className="address-input"
                    value={address}
                    onChange={onChangeAddress}
                    placeholder="Enter Address"
                  />
                </div>
              </div>
            </WithdrawContent>

            <WarningCard
              icon={<IconCircleExclamationMark />}
              title={"Important Notes"}
              content={<WithDrawWarningContentWrapper>
                <ul>
                  <li>
                    Double-check to confirm that your withdrawal address above is
                    correct and on the Gnoland Mainnet blockchain.
                  </li>
                  <li>
                    DO NOT send tokens to contract addresses. Sending tokens to a
                    contract address may result in the loss of your funds.
                  </li>
                  <li>The transaction CANNOT be cancelled once sent.</li>
                </ul>

                <a href="https://beta.gnoswap.io/" target="_blank" className="learn-more-box">
                  <p>Learn More</p>
                  <IconNewTab color={theme.color.icon21} />
                </a>
              </WithDrawWarningContentWrapper>}
            />
            <WithdrawContent>
              <div className="estimate-box">
                <p className="estimate-fee">Estimated Network Fee</p>
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
