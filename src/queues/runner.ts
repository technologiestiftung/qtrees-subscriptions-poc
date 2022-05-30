import { scheduleQueue, treeCollectorQueue } from "./queues.js";
import { scheduler } from "./scheduler.js";
import { scheduleWorker, treeCollectorWorker } from "./worker.js";

export async function runQueues() {
  try {
    scheduleQueue.waitUntilReady();
    scheduleWorker.waitUntilReady();
    scheduler.waitUntilReady();
    treeCollectorQueue.waitUntilReady();
    treeCollectorWorker.waitUntilReady();

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

    await scheduleQueue.add(
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
