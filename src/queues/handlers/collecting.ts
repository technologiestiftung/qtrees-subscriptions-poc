// creates connection to trees db and gets all

import { Job } from "bullmq";
import { ScheduleJobReturnType } from "./scheduleing.js";
import sql from "../../db.js";
import { mailingQueue } from "../queues.js";

// states of trees in subscriptions
const handler = async (job: Job<Record<string, ScheduleJobReturnType[]>, any>) => {
  try {
    // ids should be all the same since a job is created on a user basis
    // const ids = job.data.subscriptions.map((sub) => sub.id);
    // console.log(job.name, job.data);
    const predictionsForUsers = [];
    for (const sub of job.data.subscriptions) {
      const userId = sub.id;
      const geojson = sub.geojson as any;
      const predictions
        = await sql<{
          tree_geom: string;
          prediction: string;
          tree_id: string;
        }[]>`
      SELECT * FROM (SELECT
      trees.geom AS tree_geom,
       pr.prediction,
       pr.tree_id
        FROM dummy_predictions pr
        JOIN dummy_trees trees
        ON pr.tree_id = trees.id) as pr_trees WHERE  ST_Intersects(pr_trees.tree_geom, ST_GeomFromGeoJSON(${geojson}))`;
      // console.info({ email: job.data.email, predictions });
      if (predictions.length > 0) {
        predictionsForUsers.push({ userId, email: job.data.email, predictions });
      }
    }
    for (const set of predictionsForUsers) {
      await mailingQueue.add(`mailing-${set.userId}`, set);
    }
    return predictionsForUsers;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export { handler };
