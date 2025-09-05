import axios from "axios";
import qs from "qs";
import { CONFIG } from "./config/global-config";

export const axiosAuth = axios.create({
  baseURL: CONFIG.apiServerUrl,
  paramsSerializer: (params) =>
    qs.stringify(params, {
      arrayFormat: "indices",
      filter: (_, value) =>
        value !== undefined && value !== null && value !== ""
          ? value
          : undefined,
    }),
});


