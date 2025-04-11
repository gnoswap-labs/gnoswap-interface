import { RewardTokenModel } from "@models/position/reward-model";
import { TokenModel } from "@models/token/token-model";
import MissingLogo from "../missing-logo/MissingLogo";
import {
  OverlapTokenLogoImageWrapper,
  OverlapTokenLogoStyleProps,
  OverlapTokenLogoWrapper,
} from "./OverlapTokenLogo.styles";

interface OverlapTokenLogoProps extends OverlapTokenLogoStyleProps {
  tokens: RewardTokenModel[] | TokenModel[];
  placeholderFontSize?: number;
  tokenTooltipClassName?: string;
  showRewardType?: boolean;
}

function isRewardTokenModel(token: RewardTokenModel | TokenModel): token is RewardTokenModel {
  return "rewardType" in token;
}

const OverlapTokenLogo = ({
  tokens,
  size = 36,
  placeholderFontSize,
  mobileSize,
  tokenTooltipClassName,
  showRewardType = false,
}: OverlapTokenLogoProps) => {
  return (
    <OverlapTokenLogoWrapper size={size}>
      {tokens.map((token, index) => {
        const rewardType = isRewardTokenModel(token) ? token.rewardType : undefined;

        return (
          <OverlapTokenLogoImageWrapper key={index} overlap={index > 0 ? size / 3 : 0} size={size}>
            <MissingLogo
              showTooltip={true}
              showRewardType={showRewardType}
              rewardType={rewardType}
              className={tokenTooltipClassName}
              width={size}
              url={token.logoURI}
              mobileWidth={mobileSize}
              symbol={token.symbol}
              placeholderFontSize={placeholderFontSize}
            />
          </OverlapTokenLogoImageWrapper>
        );
      })}
    </OverlapTokenLogoWrapper>
  );
};

export default OverlapTokenLogo;
