import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

const GitHubLinkClient = () => {
  const { theme } = useTheme();

  return (
    <Link
      href="https://github.com/demid-v/scrobblecore"
      target="_blank"
      className="shrink-0"
    >
      <Image
        src={`/github-mark${theme === "dark" ? "-white" : ""}.svg`}
        alt="Gihub logo"
        width={36}
        height={36}
        title="Scrobblecore's GitHub repository"
        unoptimized
      />
    </Link>
  );
};

export default GitHubLinkClient;
