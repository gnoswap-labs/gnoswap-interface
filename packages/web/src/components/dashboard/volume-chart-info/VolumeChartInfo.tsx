import {
  VolumeChartInfoWrapper,
  ChartLayout,
  TimeLineWrapper,
} from "./VolumeChartInfo.styles";

const VolumeChartInfo = ({}) => {
  return (
    <VolumeChartInfoWrapper>
      <ChartLayout>
        <div>Chart TBD</div>
      </ChartLayout>
      <TimeLineWrapper>
        <div>09:00</div>
        <div>12:00</div>
        <div>15:00</div>
        <div>18:00</div>
        <div>21:00</div>
        <div>24:00</div>
      </TimeLineWrapper>
    </VolumeChartInfoWrapper>
  );
};

export default VolumeChartInfo;
