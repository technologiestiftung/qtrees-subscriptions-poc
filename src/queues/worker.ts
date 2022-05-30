import { Worker } from "bullmq";
import { handler as scheduleHandler } from "./handlers/scheduleing.js";
import { handler as collectorHandler } from "./handlers/collecting.js";
import { collectingOptions, collectingQueueName, mailingOptions, mailingQueueName, scheduleingOptions, schedulingQueueName } from "./config.js";
import { handler as mailingHandler } from "./handlers/mailing.js";

export const scheduleingWorker = new Worker(
  schedulingQueueName,
  scheduleHandler,
  // async (job: Job<any, any, string>) =>
  //   console.log("schedule handler", job.data),
  scheduleingOptions,
);

scheduleingWorker.on("completed", () =>
  console.log("schedule worker job is completed"),
);
scheduleingWorker.on("failed", () => console.log("schedule worker job is failed"));
scheduleingWorker.on("error", () => console.log("schedule worker job is error"));
scheduleingWorker.on("active", () => console.log("schedule worker job is active"));

export const collectingWorker = new Worker(
  collectingQueueName,
  collectorHandler,
  collectingOptions,
);

collectingWorker.on("completed", () =>
  console.log("tree collector worker job is completed"),
);
collectingWorker.on("failed", () =>
  console.log("tree collector worker job is failed"),
);
collectingWorker.on("error", () =>
  console.log("tree collector worker job is error"),
);
collectingWorker.on("active", () =>
  console.log("tree collector worker job is active"),
);

export const mailingWorker = new Worker(
  mailingQueueName,
  mailingHandler,
  mailingOptions);

mailingWorker.on("completed", () =>
  console.log("mailing worker job is completed"),
);
mailingWorker.on("failed", () =>
  console.log("mailing worker job is failed"),
);
mailingWorker.on("error", () =>
  console.log("mailing worker job is error"),
);
mailingWorker.on("active", () =>
  console.log("mailing worker job is active"),
);