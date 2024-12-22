import { useTheme } from "next-themes";

const ScrobblecoreIcon = () => {
  const { theme } = useTheme();

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-8"
    >
      <path
        d="M24 6V35"
        stroke={theme === "dark" ? "#e5e7eb" : "#000"}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 36.04C10 33.2565 12.2565 31 15.04 31H24V36.96C24 39.7435 21.7435 42 18.96 42H15.04C12.2565 42 10 39.7435 10 36.96V36.04Z"
        fill={theme === "dark" ? "#0284c7" : "#2f88ff"}
        stroke={theme === "dark" ? "#e5e7eb" : "#000"}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24 14.0664L36.8834 17.1215V9.01341L24 6.00002V14.0664Z"
        fill={theme === "dark" ? "#000000" : "#ffffff"}
        stroke={theme === "dark" ? "#e5e7eb" : "#000"}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ScrobblecoreIcon;
