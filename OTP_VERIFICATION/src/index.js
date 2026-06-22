import express from 'express';
import Redis from 'ioredis';

const app = express();
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
app.use(express.json());

function OtpKey(phone) {
    return `otp:${phone}`;
}

app.post('/otp', async (req, res) => {
    const {phone} = req.body;
    if (!phone) {
        return res.status(400).json({error: "Phone number is required"});
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await redis.set(OtpKey(phone), otp, 'EX', 30); // OTP valid for 30 seconds 
    res.json({message: "OTP sent successfully!" ,otp}); // In real application, you would send the OTP via SMS

});

app.post('/otp/verify', async (req, res) => {
    const {phone, otp} = req.body;
    if (!phone || !otp) {
        return res.status(400).json({error: "Phone number and OTP are required"});
    }
    const storedOtp = await redis.get(OtpKey(phone));
    if (storedOtp === otp) {
        await redis.del(OtpKey(phone)); // Delete OTP after successful verification
        res.json({message: "OTP verified successfully!"});
    } else {
        res.status(400).json({error: "Invalid OTP"});
    }
});

app.get('/otp/:phone/ttl', async (req, res) => {
    const ttl = await redis.ttl(OtpKey(req.params.phone));
    res.json({ttl});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});