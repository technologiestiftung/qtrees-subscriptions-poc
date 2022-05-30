import { scheduleingQueue, collectingQueue } from "./queues.js";
import { scheduler } from "./scheduler.js";
import { scheduleingWorker, collectingWorker } from "./worker.js";

export async function runQueues() {
  try {
    scheduleingQueue.waitUntilReady();
    scheduleingWorker.waitUntilReady();
    scheduler.waitUntilReady();
    collectingQueue.waitUntilReady();
    collectingWorker.waitUntilReady();

    // const queueEvents = new QueueEvents("schedule", {...defaultOptions, prefix: "{schedule}"});

    // queueEvents.on("completed", ({ jobId, returnvalue }) => {
    //   // Called every time a job is completed in any worker.
    //   console.log("queueEvents completed", jobId, returnvalue);
    // });

    // queueEvents.on("failed", ({ jobId, failedReason }) => {
    //   // jobId received a progress event
    //   console.log("queueEvents failed", jobId, failedReason);
    // });

    // queueEvents.on("progress", ({ jobId, data }) => {
    //   // jobId received a progress event
    //   console.log("queueEvents progress", jobId, data);
    // });

    await scheduleingQueue.add(
      "schedule",
      {},
      {
        repeat: {
          // cron: "* * * * *",
          every: 10000,
          limit: 100,
          immediately: true,
        },
      },
    );
  } catch (error) {
    console.error(error);

    throw error;
  }
}
