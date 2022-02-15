import { useFetcher } from "remix";

export default function Todo({ children, ...props }: any) {
  const fetcher = useFetcher();

  return (
    <div className="flex items-center bg-gray-100" {...props}>
      {children}
    </div>
  );
}
