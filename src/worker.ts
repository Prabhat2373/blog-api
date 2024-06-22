// import schedulePostPublishing from './path-to-your-scheduler';

import schedulePostPublishing from "./jobs/post/scheduleBlogPostJob";

// import { schedulePostPublishing } from "./jobs/post/scheduleBlogPostJob";
console.log("worker");
schedulePostPublishing();
