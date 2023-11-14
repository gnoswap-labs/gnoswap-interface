import { ConnectWalletModalWrapper } from "./ConnectWalletModal.styles";
import React, { useCallback } from "react";
import IconClose from "../icons/IconCancel";
import LiquidityEnterAmounts from "../liquidity-enter-amounts/LiquidityEnterAmounts";
import Badge, { BADGE_TYPE } from "../badge/Badge";
import Button, { ButtonHierarchy } from "../button/Button";
import EarnAddConfirmPriceRangeInfo from "@components/earn-add/earn-add-confirm-price-range-info/EarnAddConfirmPriceRangeInfo";

interface Props {
  close: () => void;
  connect?: () => void;
}
const token = {
  chainId: "test3",
  address: "0x111111111117dC0aa78b770fA6A738034120C302",
  path: "gno.land/r/demo/1inch",
  name: "1inch",
  symbol: "1INCH",
  decimals: 6,
  logoURI:
    "https://assets.coingecko.com/coins/images/13469/thumb/1inch-token.png?1608803028",
  priceId: "1inch",
  createdAt: "1999-01-01T00:00:01Z",
};

const tokenAInput = {
  token: token,
  amount: "121",
  usdValue: "$0.00",
  balance: "0",
  changeAmount: () => {},
};
const tokenBInput = {
  token: token,
  amount: "121",
  usdValue: "$0.00",
  balance: "0",
  changeAmount: () => {},
};

const priceRangeInfo = {
  minPrice: "123",
  minPriceLable: "GNOS per ETH",
  maxPrice: "123",
  maxPriceLable: "GNOS per ETH",
  currentPrice: "11 ETH per GNOT",
  feeBoost: "x10.23",
  estimatedAPR: "N/A",
};
const ConnectWalletModal: React.FC<Props> = ({ close }) => {
  const onClickClose = useCallback(() => {
    close();
  }, [close]);

  return (
    <ConnectWalletModalWrapper>
      <div className="modal-body">
        <div className="header">
          <h6>Confirm One-Click Staking</h6>
          <div className="close-wrap" onClick={onClickClose}>
            <IconClose className="close-icon" />
          </div>
        </div>
        <div className="content">
          <div>
          <LiquidityEnterAmounts
            tokenAInput={tokenAInput}
            tokenBInput={tokenBInput}
            changeTokenA={() => {}}
            changeTokenB={() => {}}
            connected={true}
          />
          <div className="fee-tier">
            <div>Fee Tier</div>
              <Badge text="0.3%" type={BADGE_TYPE.DARK_DEFAULT} />
          </div>
          </div>
          <EarnAddConfirmPriceRangeInfo {...priceRangeInfo} symbolTokenA="GNOS" symbolTokenB="GNOT" />
          <div>
            <Button
              text="Confirm One-Click Staking"
              style={{
                hierarchy: ButtonHierarchy.Primary,
                fullWidth: true,
              }}
              className="button-connect"
            />
          </div>
        </div>
      </div>
    </ConnectWalletModalWrapper>
  );
};

export default ConnectWalletModal;
