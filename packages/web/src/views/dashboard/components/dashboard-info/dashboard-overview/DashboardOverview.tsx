import { DEVICE_TYPE } from "@styles/media";

import GovernanceOverview, {
  GovernanceOverviewInfo,
} from "./governance-overview/GovernanceOverview";
import SupplyOverview, {
  SupplyOverviewInfo,
} from "./supply-overview/SupplyOverview";

import {
  DashboardOverviewWrapper,
  MobileDivider,
  OverviewDivider,
} from "./DashboardOverview.styles";

interface DashboardOverviewProps {
  supplyOverviewInfo: SupplyOverviewInfo;
  governanceOverviewInfo: GovernanceOverviewInfo | null;
  breakpoint: DEVICE_TYPE;
  loading: boolean;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  supplyOverviewInfo,
  governanceOverviewInfo,
  breakpoint,
  loading,
}) => (
  <DashboardOverviewWrapper>
    {breakpoint === DEVICE_TYPE.MOBILE && <MobileDivider />}
    <SupplyOverview supplyOverviewInfo={supplyOverviewInfo} loading={loading} />
    {breakpoint !== DEVICE_TYPE.MOBILE ? (
      <OverviewDivider />
    ) : (
      <MobileDivider />
    )}
    <GovernanceOverview
      governanceOverviewInfo={governanceOverviewInfo}
      loading={loading}
    />
  </DashboardOverviewWrapper>
);

export default DashboardOverview;
