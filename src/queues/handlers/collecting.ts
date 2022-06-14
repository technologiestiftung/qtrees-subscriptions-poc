// creates connection to trees db and gets all

import { Job } from "bullmq";
import { ScheduleJobReturnType } from "./scheduleing.js";
import sql from "../../db.js";
import { mailingQueue } from "../queues.js";

// states of trees in subscriptions
const handler = async (job: Job<Record<string, ScheduleJobReturnType[]>, any>) => {
  // TODO: [QTREES-246] Replace Dummy query with real one that uses ML DB
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
        ON pr.tree_id = trees.id) as pr_trees WHERE ST_Intersects(pr_trees.tree_geom, ST_GeomFromGeoJSON(${geojson}))`;

      // SELECT
      // 	*
      //   FROM (
      //   SELECT
      //     apit.geometry AS tree_geom,
      //     apit.gml_id,
      //     apif."value" as forcast,
      //     (SELECT name from api.forecast_types as apift where apift.id = apif.type_id) as forcast_type
      //   FROM
      //     api.trees AS apit
      //     LEFT JOIN api.forecast AS apif ON apit.gml_id = apif.baum_id
      //       ) AS forecast_trees
      //   WHERE
      //     st_intersects(forecast_trees.tree_geom, ST_GeomFromGeoJSON(${geojson}));

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
