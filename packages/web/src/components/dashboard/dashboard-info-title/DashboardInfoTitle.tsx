import {
  DashboardInfoTitleWrapper,
  TokenWrapper,
  GnosLogoWrapper,
  GnotLogoWrapper,
  TitleDivider,
} from "./DashboardInfoTitle.styles";
import IconLogoWhite from "../../common/icons/IconLogoWhite";
import { DashboardTokenInfo } from "@containers/dashboard-info-container/DashboardInfoContainer";
import { DEVICE_TYPE } from "@styles/media";
import IconLogoGnot from "@components/common/icons/IconLogoGnot";

interface DashboardInfoTitleProps {
  dashboardTokenInfo: DashboardTokenInfo;
  breakpoint: DEVICE_TYPE;
}

const DashboardInfoTitle: React.FC<DashboardInfoTitleProps> = ({
  dashboardTokenInfo,
  breakpoint,
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
    {breakpoint !== DEVICE_TYPE.MOBILE && <TitleDivider />}
    <TokenWrapper>
      <GnotLogoWrapper>
        <div className="gnot-image-wrapper">
          <IconLogoGnot className="gnot-image" />
        </div>
        <div className="gnot-symbol">GNOT</div>
      </GnotLogoWrapper>
      <div className="amount-info">{dashboardTokenInfo.gnotAmount}</div>
    </TokenWrapper>
  </DashboardInfoTitleWrapper>
);

export default DashboardInfoTitle;
