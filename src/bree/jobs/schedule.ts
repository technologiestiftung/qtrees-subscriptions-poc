import { parentPort } from "node:worker_threads";
import { Geometry } from "geojson";
import sql from "../../db.js";
import { definitions } from "../../definitions.js";
import { groupBy } from "../../utils.js";
type Subscription = definitions["subscriptions"];
type Cron = Subscription["cron"];
console.log("schedule");

const day = new Date().getDay();
const cron = `0 8 * * ${day}` as Subscription["cron"];
try {
  const subscriptions = await sql<
    {
      cron: Cron;
      email: string;
      geojson: Geometry;
      id: string;
      channel: "EMAIL" | "SMS";
    }[]
  >`
SELECT
sub.cron,
sub.geojson,
au.email,
sub.id,
sub.channel
FROM (
SELECT
  ps.cron AS cron,
  ST_AsGeoJSON(ps.geom) AS geojson,
  ps.profile_id AS id,
  pp.com_channel AS channel
FROM
  public.subscriptions AS ps
  JOIN public.profiles AS pp ON ps.profile_id = pp.id) AS sub
JOIN auth.users AS au ON sub.id = au.id
WHERE
sub.cron = ${cron}::cron`;
  // console.log(subscriptions);
  sql.end();

  const subscriptionsByEmail = groupBy(subscriptions, (sub) => sub.email);
  if (parentPort) {
    parentPort.postMessage(subscriptionsByEmail);
    parentPort.postMessage("done");
  }
} catch (error) {
  console.error(error);
  throw error;
}
