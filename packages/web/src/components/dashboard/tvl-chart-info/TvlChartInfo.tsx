import {
  TvlChartInfoWrapper,
  ChartLayout,
  TimeLineWrapper,
} from "./TvlChartInfo.styles";

const TvlChartInfo = ({}) => {
  return (
    <TvlChartInfoWrapper>
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
    </TvlChartInfoWrapper>
  );
};

export default TvlChartInfo;
