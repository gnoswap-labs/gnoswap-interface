import {
  DashboardInfoTitleWrapper,
  TokenWrapper,
  GnosLogoWrapper,
  GnotLogoWrapper,
  TitleDivider,
} from "./DashboardInfoTitle.styles";
import IconLogoWhite from "../../common/icons/IconLogoWhite";

const DashboardInfoTitle = ({}) => (
  <DashboardInfoTitleWrapper>
    <TokenWrapper>
      <GnosLogoWrapper>
        <div className="gnos-image-wrapper">
          <IconLogoWhite className="gnos-image" />
        </div>
        <div>GNOS</div>
      </GnosLogoWrapper>
      <div>$0.7425</div>
    </TokenWrapper>
    <TitleDivider />
    <TokenWrapper>
      <GnotLogoWrapper>
        <div className="gnot-image-wrapper">
          <IconLogoWhite className="gnot-image" />
        </div>
        <div>GNOT</div>
      </GnotLogoWrapper>
      <div>$1.8852</div>
    </TokenWrapper>
  </DashboardInfoTitleWrapper>
);

export default DashboardInfoTitle;
