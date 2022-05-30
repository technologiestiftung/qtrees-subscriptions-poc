import Redis from "ioredis";
import { redisURL } from "../env.js";

export const defaultOptions = {
  connection: new Redis(redisURL, { maxRetriesPerRequest: null }),
};

export const scheduleOptions = {
  ...defaultOptions,
  prefix: "{schedule}",
};

export const collectorOptions = {
  ...defaultOptions,
  prefix: "{collector}",
};
