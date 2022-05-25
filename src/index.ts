import { runBreeQueue } from "./queues/index.js";

// runBullQueues();

async function main() {
  // await runBullMQueue();
  runBreeQueue();
}

main().catch((err) => {
  console.error(err);
});
