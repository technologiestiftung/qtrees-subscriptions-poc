import { Worker } from "bullmq";
import { handler as scheduleHandler } from "./handlers/schedule.js";
import { handler as collectorHandler } from "./handlers/collector.js";
import { collectorOptions, scheduleOptions } from "./config.js";

export const scheduleWorker = new Worker(
  "schedule",
  scheduleHandler,
  // async (job: Job<any, any, string>) =>
  //   console.log("schedule handler", job.data),
  scheduleOptions,
);

scheduleWorker.on("completed", () =>
  console.log("schedule worker job is completed"),
);
scheduleWorker.on("failed", () => console.log("schedule worker job is failed"));
scheduleWorker.on("error", () => console.log("schedule worker job is error"));
scheduleWorker.on("active", () => console.log("schedule worker job is active"));

export const treeCollectorWorker = new Worker(
  "collector",
  collectorHandler,
  collectorOptions,
);

treeCollectorWorker.on("completed", () =>
  console.log("tree collector worker job is completed"),
);
treeCollectorWorker.on("failed", () =>
  console.log("tree collector worker job is failed"),
);
treeCollectorWorker.on("error", () =>
  console.log("tree collector worker job is error"),
);
treeCollectorWorker.on("active", () =>
  console.log("tree collector worker job is active"),
);
