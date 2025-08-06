import dotenv from "dotenv";
import Redis from "ioredis";
import { LRUCache } from "lru-cache";
dotenv.config();

interface CacheOptions {
  location: "memory" | "redis";
  redisUrl?: string;
  memoryTTL?: number;
  maxMemorySize?: number;
  redisRetryDelay?: number;
}

class CacheService {
  private location: "memory" | "redis";
  private opt: CacheOptions;

  // this is for redis features
  private redisClient?: Redis;
  // to use caching use of memory
  private memoryCache?: LRUCache<string, any>;

  constructor(option: CacheOptions) {
    this.location = option.location;
    this.opt = option;
    // if memory location is memory then we will store in memory
    if (this.location === "memory") {
      this.memoryCache = new LRUCache({
        max: option.maxMemorySize || 2000,
        ttl: option.memoryTTL || 1000 * 60 * 2,
      });
    }
    // if redis url then we will check for redis url if there then we will start the redis fun
    else if (this.location === "redis") {
      if (!option.redisUrl) {
        throw new Error("redis url is required");
      }
      this.startRedis();
    }
  }

  private startRedis() {
    // if there is any issue to connect with redis db then it will show the retry and attempts
    this.redisClient = new Redis(this.opt.redisUrl!, {
      retryStrategy: (attempt) => {
        const delay = this.opt.redisRetryDelay || 2000;
        console.warn(
          `redis connection reconnect attempt ${attempt} retry in ${delay}`
        );
        return delay;
      },
    });

    // show the log when successfully connected to redis
    this.redisClient.on("connect", () => {
      console.log("connected to redis successfully...");
    });
    // show the log when connection failed with redis
    this.redisClient.on("error", (e) => {
      console.log(`failed to connect to redis ${e}`);
    });
  }

  // save data to redis
  async saveDataInRedis(key: string, data: any, ttl?: number) {
    if (this.location === "memory" && this.memoryCache) {
      this.memoryCache.set(key, data, { ttl: ttl || this.opt.memoryTTL });
    } else if (
      this.location === "redis" &&
      this.redisClient?.status === "ready"
    ) {
      await this.redisClient.set(key, JSON.stringify(data), "EX", ttl || 60);
    }
  }

  // get data from redis first if not found then we will go to the database
  async getFromRedis<T>(key: string): Promise<T | null> {
    if (this.location === "memory" && this.memoryCache) {
      this.memoryCache.clear();
    } else if (
      this.location === "redis" &&
      this.redisClient?.status === "ready"
    ) {
      const data = await this.redisClient.get(key);
      return data ? JSON.parse(data) : null;
    }
    return null;
  }

  // delete from redis
  async deleteFromRedis(key: string) {
    if (this.location === "memory" && this.memoryCache) {
      this.memoryCache.delete(key);
    } else if (
      this.location === "redis" &&
      this.redisClient?.status === "ready"
    ) {
      await this.redisClient.del(key);
    }
  }

  // clear all data from the redis
  async clearAllFromRedis() {
    if (this.location === "memory" && this.memoryCache) {
      this.memoryCache.clear();
    } else if (
      this.location === "redis" &&
      this.redisClient?.status === "ready"
    ) {
      await this.redisClient.flushall();
    }
  }
}

const cacheService = new CacheService({
  location: "redis",
  redisUrl: process.env.redisURL,
  memoryTTL: Number(process.env.memoryTTL),
  maxMemorySize: Number(process.env.maxMemorySize),
  redisRetryDelay: Number(process.env.redisRetryDelay),
});

export default cacheService;
