import type { ActionFunction, LoaderFunction } from "remix";
import { Form, useLoaderData, useTransition, redirect } from "remix";
import Todo from "~/components/todo";
import { fetchData, insertOrUpdateData } from "~/utils/database";
import { useEffect, useRef } from "react";

type Task = { id: string; text: string; status: boolean };

export const loader: LoaderFunction = async () => {
  return await fetchData();
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const text = form.get("text");

  if (request.method === "PUT") {
    const id = form.get("id");
    const status = form.get("status");

    await insertOrUpdateData(id!.toString(), {
      text,
      status: !status,
    });
  }

  if (request.method === "POST") {
    const id = Date.now().toString();
    const status = false;

    await insertOrUpdateData(id, { text, status });
  }

  return redirect("/");
};

export default function Index() {
  const transition = useTransition();
  const tasks: Task[] = useLoaderData();

  const uncheckedTasks = tasks.filter((task) => !task.status);
  const checkedTasks = tasks.filter((task) => task.status);

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (transition.state !== "loading") return;
    formRef.current?.reset();
    inputRef.current?.focus();
  }, [transition.state]);

  return (
    <div className="pt-32 max-w-md mx-auto">
      <Form ref={formRef} method="post">
        <input
          ref={inputRef}
          type="text"
          name="text"
          className="w-full py-3 px-4 bg-gray-100 p-2 rounded-md placeholder-gray-400
          disabled:text-gray-600 disabled:bg-gray-200"
          placeholder="What needs to be done?"
          disabled={!!transition.submission}
        />
      </Form>

      <div className="mt-6 divide-y divide-gray-100">
        {uncheckedTasks.map((task) => (
          <Todo key={task.id} id={task.id} status={task.status}>
            {task.text}
          </Todo>
        ))}
      </div>

      {checkedTasks.length > 0 && (
        <details className="mt-6">
          <summary className="text-gray-600">
            <span>Completed ({checkedTasks.length})</span>
          </summary>

          <div className="divide-y divide-gray-100">
            {checkedTasks.map((task) => (
              <Todo key={task.id} id={task.id} status={task.status}>
                {task.text}
              </Todo>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
