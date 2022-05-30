import { fileURLToPath } from "url";
// import Queue from "bull";
// import Redis from "ioredis";
// import { Queue as BMQueue, QueueEvents, Worker, QueueScheduler } from "bullmq";
// import { redisURL } from "../env";
import path, { dirname } from "path";
// // import handler from "./processors/schedule";
// const scheduleQueue = new Queue("schedule", redisURL);
// const scheduleJobName = "schedule";
import Bree from "bree";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function runBreeQueue() {
  const bree = new Bree({
    root: path.resolve(__dirname, "./jobs"),
    hasSeconds: true,
    outputWorkerMetadata: false,
    workerMessageHandler: (message, workerMetadata) => {
      if (message.name === "schedule") {
        console.log(message);
        // handler(message);
      } else {
        console.log("unknown job", message.name);
      }
    },
    jobs: [
      {
        name: "schedule",
        interval: "30s",
      },
    ],
  });
  // start all jobs (this is the equivalent of reloading a crontab):
  bree.start("schedule");
}

// export function runBullQueues() {
//   scheduleQueue.process(
//     scheduleJobName,
//     5,
//     path.join(__dirname, "./processors/schedule.js"),
//   );
//   scheduleQueue.on("error", (error) => {
//     console.error(error);
//   });
//   scheduleQueue.on("complete", (job, result) => {
//     console.log("complete", job.name, job.data, result);
//   });

//   scheduleQueue.add(
//     scheduleJobName,
//     { type: "schedule" },
//     { repeat: { cron: "*/10 * * * * *" } },
//   );
// }

// export async function runBullMQueue() {
//   try {
//     const scheduleQueue = new BMQueue("schedule", {
//       prefix: "{schedule}",
//       connection: new Redis(redisURL, { maxRetriesPerRequest: null }),
//     });
//     const scheduler = new QueueScheduler("schedule", {
//       connection: new Redis(redisURL, { maxRetriesPerRequest: null }),
//     });

//     const worker = new Worker(
//       "schedule",
//       async (job) => console.log(job.data),
//       {
//         autorun: true,
//         connection: new Redis(redisURL, { maxRetriesPerRequest: null }),
//         prefix: "{schedule}",
//       },
//     );
//     scheduleQueue.waitUntilReady();
//     worker.waitUntilReady();
//     scheduler.waitUntilReady();

//     worker.on("completed", () => console.log("job is completed"));
//     worker.on("failed", () => console.log("job is failed"));
//     worker.on("error", () => console.log("job is error"));
//     worker.on("active", () => console.log("job is active"));

//     const queueEvents = new QueueEvents("All", {
//       connection: new Redis(redisURL, { maxRetriesPerRequest: null }),
//     });

//     queueEvents.on("completed", ({ jobId: string, returnvalue }) => {
//       // Called every time a job is completed in any worker.
//       console.log("completed", string, returnvalue);
//     });

//     queueEvents.on("failed", ({ jobId, failedReason }) => {
//       // jobId received a progress event
//       console.log("failed", jobId, failedReason);
//     });

//     queueEvents.on("progress", ({ jobId, data }) => {
//       // jobId received a progress event
//       console.log("progress", jobId, data);
//     });

//     // setInterval(() => {
//     //   scheduleQueue.getDelayedCount().then((j) => console.log(j));
//     //   scheduleQueue.getRepeatableJobs().then((ji) => console.log(ji));
//     //   console.log(new Date().getTime());
//     // }, 10 * 1000);

//     await scheduleQueue.add(
//       `schedule-${Math.random()}`,
//       { type: "schedule", val: Math.random() },
//       {
//         repeat: {
//           // cron: "* * * * *",
//           every: 10000,
//           limit: 100,
//           immediately: true,
//         },
//       },
//     );
//   } catch (error) {
//     console.error(error);

//     throw error;
//   }
// }
