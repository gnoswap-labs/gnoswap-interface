import IconLogoWhite from "@components/common/icons/IconLogoWhite";
import { DEVICE_TYPE } from "@styles/media";

import {
  DashboardInfoTitleWrapper, GnosLogoWrapper,
  GnotLogoWrapper,
  TitleDivider, TokenWrapper
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
      <GnosLogoWrapper>
        <div className="gnos-image-wrapper">
          <IconLogoWhite className="gnos-image" />
        </div>
        <div className="gnos-symbol">GNS</div>
      </GnosLogoWrapper>
      <div className="amount-info">{dashboardTokenInfo.gnosAmount}</div>
    </TokenWrapper>
    <TitleDivider />
    <TokenWrapper>
      <GnotLogoWrapper>
        <div className="gnot-image-wrapper">
          <img src="https://raw.githubusercontent.com/onbloc/gno-token-resource/main/gno-native/images/gnot.svg" className="gnot-image" />
        </div>
        <div className="gnot-symbol">GNOT</div>
      </GnotLogoWrapper>
      <div className="amount-info">{dashboardTokenInfo.gnotAmount}</div>
    </TokenWrapper>
  </DashboardInfoTitleWrapper>
);

export default DashboardInfoTitle;
