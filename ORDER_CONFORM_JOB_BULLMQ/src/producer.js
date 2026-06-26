import express from "express";
import { emailQueue } from "./queue.js";

const app = express();
app.use(express.json());

app.post("/welcome", async (req, res) => {
    const job = await emailQueue.add("welcome", {
        to: req.body.to,
        subject: req.body.subject || "Welcome!",
        body: req.body.body || "Welcome to our service!",
    },
    {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000
        },
    });

    res.json({ message: "Welcome email job added to the queue", jobId: job.id });
});

app.get("/welcome/:jobId", async (req, res) => {
    const job = await emailQueue.getJob(req.params.jobId);
    res.json(job ? { jobId: job.id, state: await job.getState(), data: job.data } : { message: "Job not found" });
});

app.listen(3000, () => {
  console.log("Server is running on port http://localhost:3000");
});
