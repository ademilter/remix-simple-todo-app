import type { ActionFunction, LoaderFunction } from "remix";
import {
  Form,
  useLoaderData,
  useActionData,
  useTransition,
  redirect,
  json,
} from "remix";
import { useEffect, useRef } from "react";
import type { Todo } from "~/components/todo-item";
import TodoItem from "~/components/todo-item";
import { deleteData, fetchData, insertOrUpdateData } from "~/utils/database";

export const loader: LoaderFunction = async () => {
  return await fetchData();
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  if (request.method === "POST") {
    const text = form.get("text") as string;
    if (!text || !text.trim()) {
      return json({ error: "Text is required" });
    }
    await insertOrUpdateData(Date.now().toString(), { text, status: false });
  }

  if (request.method === "PUT") {
    const todo = form.get("todo");
    const { id, text, status } = JSON.parse(todo as string);
    await insertOrUpdateData(id.toString(), {
      text,
      status: !status,
    });
  }

  if (request.method === "DELETE") {
    const id = form.get("id");
    await deleteData(id!.toString());
  }

  return redirect("/");
};

export default function Index() {
  const actionData = useActionData();
  const transition = useTransition();
  const todos: Todo[] = useLoaderData();

  const isCreating = transition.submission?.method === "POST";
  const isAdding = transition.state === "submitting" && isCreating;

  const uncheckedTodos = todos.filter((todo) => !todo.status);
  const checkedTodos = todos.filter((todo) => todo.status);

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdding) return;
    formRef.current?.reset();
    inputRef.current?.focus();
  }, [isAdding]);

  return (
    <main className="pt-32 px-4 max-w-md mx-auto">
      <Form ref={formRef} method="post">
        <input
          ref={inputRef}
          type="text"
          name="text"
          required
          autoComplete="off"
          className="w-full p-2 bg-gray-100 rounded-md placeholder-gray-400
          disabled:text-gray-600 disabled:bg-gray-200"
          placeholder="What needs to be done?"
          disabled={isCreating}
        />
      </Form>

      {actionData?.error && (
        <p className="mt-2 text-red-500">{actionData.error}</p>
      )}

      <div className="mt-6 divide-y divide-gray-100">
        {uncheckedTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            {...todo}
            active={transition.submission?.formData.get("id") === todo.id}
          />
        ))}
      </div>

      {checkedTodos.length > 0 && (
        <details className="mt-6 rounded-md open:bg-teal-50 open:-mx-4 open:py-3 open:px-4">
          <summary className="inline-flex text-sm text-gray-500 cursor-pointer">
            Completed ({checkedTodos.length})
          </summary>

          <div className="mt-2 divide-y divide-gray-100">
            {checkedTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                {...todo}
                active={transition.submission?.formData.get("id") === todo.id}
              />
            ))}
          </div>
        </details>
      )}
    </main>
  );
}
