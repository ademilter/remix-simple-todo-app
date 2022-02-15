import cx from "classnames";
import IconCheck from "~/components/icon-check";
import { Form } from "remix";

export default function Todo({ id, status = false, children }: any) {
  return (
    <div className="flex items-center space-x-4 p-3 border-gray-200">
      <Form method="put">
        <input hidden type="text" name="id" defaultValue={id} />
        <input hidden type="text" name="text" defaultValue={children} />
        <input hidden type="checkbox" name="status" defaultChecked={status} />
        <button
          type="submit"
          className={cx(
            "relative flex items-center justify-center w-5 h-5 border border-gray-200 rounded",
            status ? "bg-gray-200" : "border-gray-300 shadow"
          )}
        >
          {status ? <IconCheck /> : null}
        </button>
      </Form>

      <span className="flex-grow">{children}</span>
    </div>
  );
}
