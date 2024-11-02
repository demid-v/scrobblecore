import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { env } from "~/env";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getBaseUrl = () => {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

const params = {
  api_key: env.NEXT_PUBLIC_LASTFM_API_KEY,
  cb: `${getBaseUrl()}/api/auth`,
};

export const authUrl = `https://www.last.fm/api/auth/?${new URLSearchParams(params)}`;
