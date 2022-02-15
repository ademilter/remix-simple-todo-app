import { hgetall, hset } from "@upstash/redis";
const DATABASE_KEY = process.env.DATABASE_KEY || "remix-with-upstash";

export function fetchData() {
  return new Promise(async (resolve, reject) => {
    const { data, error } = await hgetall(DATABASE_KEY);

    if (error) reject(error);

    let tasks = [];
    for (let i = 0; i < data.length; i++) {
      const keyValue = JSON.parse(data[i + 1]);
      tasks.push({ id: parseInt(data[i]), ...keyValue });
      i++;
    }

    resolve(tasks.sort((a, b) => b.id - a.id));
  });
}

export function insertOrUpdateData(id: string, task: object) {
  return new Promise(async (resolve, reject) => {
    const { data, error } = await hset(DATABASE_KEY, id, JSON.stringify(task));

    if (error) reject(error);

    resolve(data);
  });
}
