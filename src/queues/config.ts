import Redis from "ioredis";
import { redisURL } from "../env.js";

export const schedulingQueueName = "scheduling";
export const collectingQueueName = "collecting";
export const mailingQueueName = "mailing";


export const defaultOptions = {
  connection: new Redis(redisURL, { maxRetriesPerRequest: null }),
};

export const scheduleingOptions = {
  ...defaultOptions,
  prefix: "{scheduling}",
};

export const collectingOptions = {
  ...defaultOptions,
  prefix: "{collecting}",
};

export const mailingOptions = {
  ...defaultOptions,
  prefix: "{mailing}",
};