import { GNS_TOKEN } from "@common/values/token-constant";
import IconLogoWhite from "@components/common/icons/IconLogoWhite";
import { DEVICE_TYPE } from "@styles/media";

import {
  DashboardInfoTitleWrapper,
  TitleDivider,
  TokenLogoWrapper,
  TokenWrapper,
} from "./DashboardInfoTitle.styles";

export interface DashboardTokenInfo {
  gnosAmount: string;
  gnotAmount: string;
}

interface DashboardInfoTitleProps {
  dashboardTokenInfo: DashboardTokenInfo;
  breakpoint: DEVICE_TYPE;
}

const DashboardInfoTitle: React.FC<DashboardInfoTitleProps> = ({
  dashboardTokenInfo,
}) => (
  <DashboardInfoTitleWrapper>
    <TokenWrapper>
      <TokenLogoWrapper>
        <div className="token-image-wrapper">
          <IconLogoWhite className="token-image" />
        </div>
        <div className="token-symbol">{GNS_TOKEN.symbol}</div>
      </TokenLogoWrapper>
      <div className="amount-info">{dashboardTokenInfo.gnosAmount}</div>
    </TokenWrapper>
    <TitleDivider />
    <TokenWrapper>
      <TokenLogoWrapper>
        <div className="token-image-wrapper">
          <img
            src="https://raw.githubusercontent.com/onbloc/gno-token-resource/main/gno-native/images/gnot.svg"
            className="token-image"
          />
        </div>
        <div className="token-symbol">GNOT</div>
      </TokenLogoWrapper>
      <div className="amount-info">{dashboardTokenInfo.gnotAmount}</div>
    </TokenWrapper>
  </DashboardInfoTitleWrapper>
);

export default DashboardInfoTitle;
