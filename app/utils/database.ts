import { hgetall, hsetnx } from "@upstash/redis";
const DATABASE_KEY = process.env.DATABASE_KEY!;

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

export function insertData(task: object) {
  return new Promise(async (resolve, reject) => {
    const { data, error } = await hsetnx(
      DATABASE_KEY,
      Date.now().toString(),
      JSON.stringify(task)
    );
    if (error) reject(error);

    resolve(data);
  });
}
