import { useTheme } from "next-themes";
import { Toaster } from "sonner";

import { type Themes } from "./theme-provider";

const ToasterClient = () => {
  const { theme } = useTheme();

  return (
    <Toaster position="bottom-right" theme={theme as Themes} closeButton />
  );
};

export default ToasterClient;
