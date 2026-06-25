import express from 'express';
import Redis from 'ioredis';

const app = express();
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
app.use(express.json());
const emailQueueKey = 'email_queue';

app.post('/email', async (req, res) => {
    const job ={
        to: req.body.to,
        subject: req.body.subject || 'No Subject',
        body: req.body.body || 'No Body',
    };
    await redis.lpush(emailQueueKey, JSON.stringify(job));
    res.json({ message: 'Email job queued successfully' });
});

app.get('/email/process-one', async (req, res) => {
    const rawJob = await redis.rpop(emailQueueKey);
    if (rawJob) {
        const job = JSON.parse(rawJob);
        res.json({ message: 'Email job processed', job });
    } else {
        res.json({ message: 'No email jobs in the queue' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port http://localhost:3000');
});