const IconCheckbox = ({ className }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M5 3H19C20.11 3 21 3.9 21 5V19C21 20.1 20.11 21 19 21H5C3.89 21 3 20.1 3 19V5C3 3.9 3.89 3 5 3ZM5 12L10 17L19 8L17.59 6.58L10 14.17L6.41 10.59L5 12Z"
      fill="white"
    />
  </svg>
);

export default IconCheckbox;
