import { runQueues } from "./queues/runner.js";

// runBullQueues();

async function main() {
  await runQueues();
}

main().catch((err) => {
  console.error(err);
});
