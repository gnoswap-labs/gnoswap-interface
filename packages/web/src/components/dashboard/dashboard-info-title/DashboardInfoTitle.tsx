import {
  DashboardInfoTitleWrapper,
  TokenWrapper,
  GnosLogoWrapper,
  GnotLogoWrapper,
  TitleDivider,
} from "./DashboardInfoTitle.styles";
import IconLogoWhite from "../../common/icons/IconLogoWhite";
import { DashboardTokenInfo } from "@containers/dashboard-info-container/DashboardInfoContainer";
import { DeviceSize } from "@styles/media";

interface DashboardInfoTitleProps {
  dashboardTokenInfo: DashboardTokenInfo;
  windowSize: number;
}

const DashboardInfoTitle: React.FC<DashboardInfoTitleProps> = ({
  dashboardTokenInfo,
  windowSize,
}) => (
  <DashboardInfoTitleWrapper>
    <TokenWrapper>
      <GnosLogoWrapper>
        <div className="gnos-image-wrapper">
          <IconLogoWhite className="gnos-image" />
        </div>
        <div className="gnos-symbol">GNOS</div>
      </GnosLogoWrapper>
      <div>{dashboardTokenInfo.gnosAmount}</div>
    </TokenWrapper>
    {windowSize > DeviceSize.mobile && <TitleDivider />}
    <TokenWrapper>
      <GnotLogoWrapper>
        <div className="gnot-image-wrapper">
          <IconLogoWhite className="gnot-image" />
        </div>
        <div className="gnot-symbol">GNOT</div>
      </GnotLogoWrapper>
      <div>{dashboardTokenInfo.gnotAmount}</div>
    </TokenWrapper>
  </DashboardInfoTitleWrapper>
);

export default DashboardInfoTitle;
