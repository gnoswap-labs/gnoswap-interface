import { PROJECT_STATUS_TYPE } from "@views/launchpad/components/launchpad-active-projects/launchpad-active-projects-content/launchpad-active-projects-card-list/launchpad-active-project-card/launchpad-active-project-card-time-chip/LaunchpadActiveProjectCardTimeChip";

const IconTimer = ({ type }: { type?: PROJECT_STATUS_TYPE }) => {
  const getFillColor = () => {
    switch (type) {
      case PROJECT_STATUS_TYPE.UPCOMING:
        return "#007AFF";
      case PROJECT_STATUS_TYPE.END:
        return "#16C78A";
    }
  };
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.99333 0.333984C3.31333 0.333984 0.333332 3.32065 0.333332 7.00065C0.333332 10.6807 3.31333 13.6673 6.99333 13.6673C10.68 13.6673 13.6667 10.6807 13.6667 7.00065C13.6667 3.32065 10.68 0.333984 6.99333 0.333984ZM7 12.334C4.05333 12.334 1.66667 9.94732 1.66667 7.00065C1.66667 4.05398 4.05333 1.66732 7 1.66732C9.94666 1.66732 12.3333 4.05398 12.3333 7.00065C12.3333 9.94732 9.94666 12.334 7 12.334ZM6.33333 3.66732H7.33333V7.16732L10.3333 8.94732L9.83333 9.76732L6.33333 7.66732V3.66732Z"
        fill={getFillColor()}
      />
    </svg>
  );
};

export default IconTimer;
