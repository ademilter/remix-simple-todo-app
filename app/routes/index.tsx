import type { ActionFunction, LoaderFunction } from "remix";
import {
  Form,
  json,
  useActionData,
  useLoaderData,
  useTransition,
  redirect,
} from "remix";
import Todo from "~/components/todo";
import { fetchData, insertData } from "~/utils/database";
import { useEffect } from "react";

export const loader: LoaderFunction = async () => {
  try {
    return await fetchData();
  } catch (error) {
    return [];
  }
};

export const action: ActionFunction = async ({ request }) => {
  try {
    const form = await request.formData();
    const task = form.get("task");
    await insertData({ text: task });
    return redirect("/");
  } catch (error) {
    return json(error, {
      status: 400,
    });
  }
};

export default function Index() {
  const actionMessage = useActionData();
  const { submission } = useTransition();
  let tasks = useLoaderData();

  return (
    <div className="bg-gray-100 p-10">
      <Form method="post" className="grid grid-cols-1 gap-4">
        <input
          type="text"
          name="task"
          className="border border-solid border-gray-400"
          disabled={!!submission}
        />
      </Form>

      <div className="">
        {tasks.map((task: { id: string; text: string }) => (
          <Todo key={task.id}>{task.text}</Todo>
        ))}
      </div>
    </div>
  );
}
