# i_know_Redis

Redis learning notes with practical examples, important commands, and small application examples.

Redis is an in-memory data store used when an application needs very fast read and write operations. It is commonly used for caching, sessions, queues, rate limiting, leaderboards, counters, real-time data, and temporary data with expiry.

## Why Redis?

Think of Redis like a super-fast notebook kept beside your application.

Example: an e-commerce app shows product details again and again. Reading the same product from the database every time is slow and expensive. Instead, the app can store the product response in Redis for a short time.

Flow:

1. User asks for product `101`.
2. App checks Redis first.
3. If product exists in Redis, return it immediately.
4. If not, fetch from database, save it in Redis, then return it.

This is called cache-aside pattern.

```text
User -> App -> Redis
              |
              | cache miss
              v
           Database
```

## Real-Life Examples

### 1. Caching API Responses

Use Redis to store data that is expensive to calculate or fetch.

Example:

```bash
SET product:101 '{"id":101,"name":"Laptop","price":55000}' EX 300
GET product:101
```

The product stays in Redis for 300 seconds. After that, Redis removes it automatically.

### 2. User Sessions

When a user logs in, store their session in Redis.

```bash
SET session:user:45 "logged-in" EX 3600
GET session:user:45
```

This keeps the user logged in for 1 hour.

### 3. Rate Limiting

Limit how many requests a user can make.

```bash
INCR rate:user:45
EXPIRE rate:user:45 60
GET rate:user:45
```

If the value becomes greater than the allowed limit, block the request.

Example: allow only 100 requests per minute.

### 4. Leaderboard

Redis sorted sets are perfect for rankings.

```bash
ZADD game:leaderboard 100 "arpit"
ZADD game:leaderboard 250 "rahul"
ZADD game:leaderboard 180 "neha"
ZREVRANGE game:leaderboard 0 2 WITHSCORES
```

This returns the top 3 players by score.

### 5. Shopping Cart

Use Redis hashes to store cart data.

```bash
HSET cart:user:45 product:101 2
HSET cart:user:45 product:205 1
HGETALL cart:user:45
```

This means user `45` has 2 units of product `101` and 1 unit of product `205`.

### 6. Queue / Background Jobs

Use Redis lists as a simple queue.

```bash
LPUSH email:queue "send-welcome-email:user:45"
RPOP email:queue
```

One service adds jobs, another service processes them.


## Important Redis Commands

### Basic Commands

```bash
PING
SET key value
GET key
DEL key
EXISTS key
KEYS *
TYPE key
FLUSHDB
```

Note: avoid `KEYS *` in production because it can block Redis when many keys exist. Use `SCAN` instead.

```bash
SCAN 0
```

### Expiry Commands

```bash
EXPIRE user:1 60
TTL user:1
PERSIST user:1
SET otp:user:45 123456 EX 120
```


### Pub/Sub Commands

Used for real-time messaging.

Terminal 1:

```bash
SUBSCRIBE chat
```

Terminal 2:

```bash
PUBLISH chat "Hello Redis"
```

## Run Redis Locally

This repository includes a `docker-compose.yml` file for Redis and MongoDB.

Start services:

```bash
docker compose up -d
```

Check running containers:

```bash
docker ps
```

Open Redis CLI:

```bash
docker exec -it redis_container redis-cli
```

Test Redis:

```bash
PING
```

Expected output:

```text
PONG
```

Stop services:

```bash
docker compose down
```

## Redis Naming Pattern

Use readable key names with colon separators.

Good examples:

```bash
user:1
user:1:session
product:101
product:101:reviews
cart:user:45
rate:user:45
leaderboard:daily
```

This makes keys easier to understand and debug.

## Common Redis Patterns

### Cache Aside

1. Check Redis.
2. If data exists, return it.
3. If data does not exist, read from database.
4. Store the result in Redis with expiry.
5. Return the result.

### Write Through Cache

Write data to Redis and database together. This keeps cache and database closer, but writes become slower.

### Cache Invalidation

When database data changes, delete or update the related Redis key.


## Folder Structure

```text
.
|-- README.md
|-- docker-compose.yml
|-- FOUNDATION_OF_REDIS/
`-- SETUP_LOCAL_REDIS/
    |-- package.json
    `-- src/index.js
```

## Summary

Redis is useful when speed matters. In real applications, it usually sits between the application and database to reduce database load and improve response time. The most common Redis use cases are caching, sessions, counters, queues, rate limiting, and leaderboards.
