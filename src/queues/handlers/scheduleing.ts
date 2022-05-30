import { Job } from "bullmq";
import { Geometry } from "geojson";
import sql from "../../db.js";
import { definitions } from "../../definitions.js";
import { groupBy } from "../../utils.js";
import { collectingQueue } from "../queues.js";
type Subscription = definitions["subscriptions"];
type Profile = definitions["profiles"];
type Cron = Subscription["cron"];
type Email = string;
type ID = Subscription["id"];
type Channel = Profile["com_channel"];
export interface ScheduleJobReturnType {
  cron: Cron;
  geojson: Geometry;
  email: Email;
  id: ID;
  channel: Channel;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handler = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _job: Job<
    Record<string, never>,
    Record<string, ScheduleJobReturnType[]>,
    string
  >,
) => {
  // console.log(job.name, job.data);
  const day = new Date().getDay();
  const cron = `0 8 * * ${day}` as Subscription["cron"];
  try {
    const subscriptions = await sql<ScheduleJobReturnType[]>`
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
    const groupedSubscriptions = groupBy(subscriptions, "email");
    // add jobs to the collectorQueue
    for (const [email, subscriptions] of Object.entries(groupedSubscriptions)) {
      // const geojson = subscriptions.map((sub) => sub.geojson);
      // const channel = subscriptions.map((sub) => sub.channel);
      const id = subscriptions.map((sub) => sub.id);
      await collectingQueue.add(`collecting-${id}`, { email, subscriptions });
    }
    // const count = await collectingQueue.getJobCounts();
    // console.log("job count", count);
    return groupedSubscriptions;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export { handler };
