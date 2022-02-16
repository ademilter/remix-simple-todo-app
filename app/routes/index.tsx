import type { ActionFunction, LoaderFunction } from "remix";
import type { Todo } from "~/components/todo-item";
import { Form, useLoaderData, useTransition, redirect } from "remix";
import TodoItem from "~/components/todo-item";
import { deleteData, fetchData, insertOrUpdateData } from "~/utils/database";
import { useEffect, useRef } from "react";

export const loader: LoaderFunction = async () => {
  return await fetchData();
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const id = form.get("id");
  const text = form.get("text");
  const status = form.get("status");

  if (request.method === "POST") {
    await insertOrUpdateData(Date.now().toString(), { text, status: false });
  }

  if (!id) return redirect("/");

  if (request.method === "PUT") {
    await insertOrUpdateData(id.toString(), {
      text,
      status: !status,
    });
  }

  if (request.method === "DELETE") {
    await deleteData(id.toString());
  }

  return redirect("/");
};

export default function Index() {
  const transition = useTransition();
  const todos: Todo[] = useLoaderData();

  const uncheckedTodos = todos.filter((todo) => !todo.status);
  const checkedTodos = todos.filter((todo) => todo.status);

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (transition.state !== "loading") return;
    formRef.current?.reset();
    // inputRef.current?.focus();
  }, [transition.state]);

  return (
    <main className="pt-32 px-4 max-w-md mx-auto">
      <Form ref={formRef} method="post">
        <input
          ref={inputRef}
          type="text"
          name="text"
          autoComplete="off"
          className="w-full py-3 px-4 bg-gray-100 p-2 rounded-md placeholder-gray-400
          disabled:text-gray-600 disabled:bg-gray-200"
          placeholder="What needs to be done?"
          disabled={transition.submission?.method === "POST"}
        />
      </Form>

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
