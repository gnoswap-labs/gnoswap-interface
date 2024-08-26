
import { DEVICE_TYPE } from "@styles/media";

import GovernanceOverview, {
  GovernenceOverviewInfo,
} from "./governance-overview/GovernanceOverview";
import SupplyOverview, {
  SupplyOverviewInfo,
} from "./supply-overview/SupplyOverview";

import {
  DashboardOverviewWrapper, MobileDivider, OverviewDivider
} from "./DashboardOverview.styles";

interface DashboardOverviewProps {
  supplyOverviewInfo: SupplyOverviewInfo;
  governenceOverviewInfo: GovernenceOverviewInfo;
  breakpoint: DEVICE_TYPE;
  loading: boolean;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  supplyOverviewInfo,
  governenceOverviewInfo,
  breakpoint,
  loading,
}) => (
  <DashboardOverviewWrapper>
    {breakpoint === DEVICE_TYPE.MOBILE && <MobileDivider />}
    <SupplyOverview supplyOverviewInfo={supplyOverviewInfo} loading={loading}/>
    {breakpoint !== DEVICE_TYPE.MOBILE ? (
      <OverviewDivider />
    ) : (
      <MobileDivider />
    )}
    <GovernanceOverview governenceOverviewInfo={governenceOverviewInfo} loading={loading}/>
  </DashboardOverviewWrapper>
);

export default DashboardOverview;
