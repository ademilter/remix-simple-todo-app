import "dotenv/config";
import upstash from "@upstash/redis";
const DATABASE_KEY = process.env.DATABASE_KEY || "remix-with-upstash";

const redis = upstash(
  process.env.UPSTASH_REDIS_REST_URL,
  process.env.UPSTASH_REDIS_REST_TOKEN
);

export function fetchData() {
  return new Promise(async (resolve, reject) => {
    const { data, error } = await redis.hgetall(DATABASE_KEY);

    if (error) reject(error);

    let tasks = [];
    for (let i = 0; i < data.length; i++) {
      const keyValue = JSON.parse(data[i + 1]);
      tasks.push({ id: data[i], ...keyValue });
      i++;
    }

    resolve(tasks.sort((a, b) => parseInt(b.id) - parseInt(a.id)));
  });
}

export function insertOrUpdateData(id: string, task: object) {
  return new Promise(async (resolve, reject) => {
    const { data, error } = await redis.hset(
      DATABASE_KEY,
      id,
      JSON.stringify(task)
    );

    if (error) reject(error);

    resolve(data);
  });
}

export function deleteData(id: string) {
  return new Promise(async (resolve, reject) => {
    const { data, error } = await redis.hdel(DATABASE_KEY, id);

    if (error) reject(error);

    resolve(data);
  });
}
