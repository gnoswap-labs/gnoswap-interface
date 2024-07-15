export const IconCircleExclamationMark = ({ stroke }: { stroke?: string }) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 10.9051V10.8965"
        stroke={stroke || "#F97316"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="8"
        cy="8"
        r="7"
        stroke={stroke || "#F97316"}
        strokeWidth="1.5"
      />
      <path
        d="M8 5.10352V8.48283"
        stroke={stroke || "#F97316"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
