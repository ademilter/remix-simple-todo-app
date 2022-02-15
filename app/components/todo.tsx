import cx from "classnames";
import IconCheck from "~/components/icon-check";
import { Form } from "remix";

export type Task = { id: string; text: string; status: boolean };

export default function Todo({ id, text, status }: Task) {
  return (
    <div className="group flex items-center space-x-4 p-3 border-gray-200">
      <Form method="put">
        <input hidden type="text" name="id" defaultValue={id} />
        <input hidden type="text" name="text" defaultValue={text} />
        <input hidden type="checkbox" name="status" defaultChecked={status} />
        <button
          type="submit"
          className={cx(
            "flex items-center justify-center w-5 h-5 border border-gray-200 rounded",
            status ? "bg-gray-200" : "border-gray-300 shadow"
          )}
        >
          {status ? <IconCheck /> : null}
        </button>
      </Form>

      <span className="flex-grow">{text}</span>

      <Form method="delete">
        <input hidden type="text" name="id" defaultValue={id} />
        <button
          type="submit"
          className="px-1 py-0.5 text-xs text-red-600 bg-red-50 rounded hidden group-hover:flex"
        >
          Delete
        </button>
      </Form>
    </div>
  );
}
