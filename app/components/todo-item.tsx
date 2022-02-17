import cx from "classnames";
import IconCheck from "~/components/icon-check";
import { Form } from "remix";

export type Todo = { id: string; text: string; status: boolean };

type Props = Todo & {
  active: boolean;
};

export default function TodoItem({ id, text, status, active = false }: Props) {
  return (
    <div
      className={cx(
        "group flex items-center space-x-3 p-3 border-gray-200 rounded-md",
        active ? "opacity-50 bg-gray-200 border-transparent" : ""
      )}
    >
      <Form method="put">
        <input
          type="hidden"
          name="todo"
          defaultValue={JSON.stringify({ id, text, status })}
        />
        <button
          type="submit"
          className={cx(
            "flex items-center justify-center w-5 h-5 border border-gray-200 rounded",
            status ? "bg-gray-200" : "border-gray-300 shadow"
          )}
        >
          {status && <IconCheck />}
        </button>
      </Form>

      <span className="flex-grow line-clamp-3">{text}</span>

      {status && (
        <Form method="delete">
          <input hidden type="text" name="id" defaultValue={id} />
          <button
            type="submit"
            className="px-1 py-0.5 text-xs text-red-600 bg-red-50 rounded opacity-0 group-hover:opacity-100"
          >
            Delete
          </button>
        </Form>
      )}
    </div>
  );
}
