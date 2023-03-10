/**
 * This component can represent the UI in three different states.
 * icon/filter-default: Default status.
 * icon/filter-up: You can select #icon-filter-up to show a UI that matches the status value.
 * icon/filter-down: You can select #icon-filter-down to show a UI that matches the status value.
 */
const IconFilter = ({ className }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M12 6L16 10H8L12 6Z" fill="white" id="icon-filter-up" />
    <path d="M12 18L8 14H16L12 18Z" fill="white" id="icon-filter-down" />
  </svg>
);

export default IconFilter;
