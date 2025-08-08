import { useTheme } from "next-themes";
import { Toaster } from "sonner";

const ToasterClient = () => {
  const { theme } = useTheme();

  return (
    <Toaster
      position="bottom-right"
      theme={theme as "dark" | "light" | "system" | undefined}
      closeButton
    />
  );
};

export default ToasterClient;
