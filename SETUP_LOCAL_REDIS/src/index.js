import express from "express";
import Redis from "ioredis";

const app = express();
const port = 3000;

const redisClient = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

app.get("/redis", async (req, res) => {
    const replay = await redisClient.ping();
    res.json({ message: "Redis is working!", replay });
});

app.get("/mongo", async (req, res) => {
    const URL = process.env.MONGO_URL || "mongodb://localhost:27017/redis_mongodb";
    if(mongoose.connection.readyState === 0) {
        await mongoose.connect(URL)
    }
    res.json({ message: "MongoDB is working!" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});