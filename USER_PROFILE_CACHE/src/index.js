import express from 'express';
import Redis from 'ioredis';

const app = express();
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
app.use(express.json());

app.post('/user/:id/json',async (req, res) => {
    await redis.set(`user:${req.params.id}:json`, JSON.stringify(req.body));
    res.json({ message: 'User profile cached successfully' });
});

app.get('/user/:id/json', async (req, res) => {
    const rawData = await redis.get(`user:${req.params.id}:json`);
    res.json(rawData ? JSON.parse(rawData) : { message: 'User profile not found in cache' });
});

app.post('/user/:id/hash', async (req, res) => {
    await redis.hset(`user:${req.params.id}:hash`, req.body);
    res.json({ message: 'User profile cached successfully' });
});

app.get('/user/:id/hash', async (req, res) => {
    const rawData = await redis.hgetall(`user:${req.params.id}:hash`);
    res.json(Object.keys(rawData).length ? rawData : { message: 'User profile not found in cache' });
});

app.listen(3000, () => {
    console.log('Server is running on port http://localhost:3000');
});