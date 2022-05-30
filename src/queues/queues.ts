import { Queue } from "bullmq";
import { collectorOptions, scheduleOptions } from "./config.js";

export const scheduleQueue = new Queue("schedule", scheduleOptions);
export const treeCollectorQueue = new Queue("collector", collectorOptions);
