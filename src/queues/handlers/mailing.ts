import { Job } from "bullmq";
import { mailer } from "../../mailer.js";

const handler = async (
  job: Job,
) => {
  console.info(job.name, job.data);
  // create plain text email per user
  // send email
  try {
    await mailer(job.data,);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export { handler, };