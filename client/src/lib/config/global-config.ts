import packageJson from "../../../package.json";

const useLocalServer = false;

const apiServerUrl = (import.meta.env.VITE_API_SERVER_URL ?? "") as string;

const environment = import.meta.env.MODE as "production" | "development";
const appName = (import.meta.env.VITE_APP_NAME ?? "Da Vinci") as string;

export const CONFIG = {
  appName,
  appVersion: packageJson.version,
  useLocalServer: environment === "production" ? false : useLocalServer,
  apiServerUrl,
};
