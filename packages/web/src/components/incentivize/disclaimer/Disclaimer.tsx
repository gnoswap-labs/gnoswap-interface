import { useTranslation } from "react-i18next";
import { wrapper } from "./Disclaimer.styles";

interface DisclaimerProps {}

const Disclaimer: React.FC<DisclaimerProps> = () => {
  const { t } = useTranslation();

  return (
    <div css={wrapper}>
      <h5 className="section-title">{t("IncentivizePool:disclaimer.title")}</h5>
      <div
        className="desc"
        dangerouslySetInnerHTML={{
          __html: t("IncentivizePool:disclaimer.desc"),
        }}
      />
    </div>
  );
};

export default Disclaimer;
