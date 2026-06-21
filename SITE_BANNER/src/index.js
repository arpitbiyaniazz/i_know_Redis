import express from 'express';
import Redis from 'ioredis';

const app = express();
app.use(express.json());
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

const SITE_BANNER_KEY = 'app:banner';

app.post('/banner', async (req, res)=>{

    await redis.set(SITE_BANNER_KEY, req.body.message || "welcome to our website!");
    res.json({message: "Banner updated successfully!"});

});

app.get('/banner', async (req, res)=>{
    const bannerMessage = await redis.get(SITE_BANNER_KEY);
    res.json({message: bannerMessage});
});

app.delete('/banner', async (req, res)=>{
    await redis.del(SITE_BANNER_KEY);
    res.json({message: "Banner deleted successfully!"});
});

app.get('/banner/exists', async(req, res)=>{
    const exists = await redis.exists(SITE_BANNER_KEY);
    res.json({exists: Boolean(exists)});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Server is running on port http://localhost:${PORT}`);
});
