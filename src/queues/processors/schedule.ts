import sql from "../../db";
import { definitions } from "../../definitions";
type Subscription = definitions["subscriptions"];
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handler = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _job: any,
) => {
  // console.log(job.name, job.data);
  const day = new Date().getDay();
  const cron = `0 8 * * ${day}` as Subscription["cron"];
  try {
    const subscriptions = await sql<Subscription[]>`
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
    console.log(subscriptions);
    return subscriptions;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export default handler;
