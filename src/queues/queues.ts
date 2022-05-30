import { Queue } from "bullmq";
import { collectingOptions, collectingQueueName, mailingOptions, mailingQueueName, scheduleingOptions, schedulingQueueName } from "./config.js";

export const scheduleingQueue = new Queue(schedulingQueueName, scheduleingOptions);
export const collectingQueue = new Queue(collectingQueueName, collectingOptions);

export const mailingQueue = new Queue(mailingQueueName, mailingOptions);