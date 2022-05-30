import { QueueScheduler } from "bullmq";
import { scheduleingOptions, schedulingQueueName } from "./config.js";

export const scheduler = new QueueScheduler(schedulingQueueName, scheduleingOptions);
