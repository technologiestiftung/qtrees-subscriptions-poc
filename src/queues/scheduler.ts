import { QueueScheduler } from "bullmq";
import { scheduleOptions } from "./config.js";

export const scheduler = new QueueScheduler("schedule", scheduleOptions);
