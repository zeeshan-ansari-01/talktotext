import { TriangleAlert } from "lucide-react";

export default function AuthError({ message }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="mb-6 flex items-start gap-3 rounded-md border border-red-300 bg-red-50/60 px-4 py-3 text-[13px] leading-5 text-red-600"
    >
      <TriangleAlert size={14} className="mt-[3px] shrink-0" />
      <p>{message}</p>
    </div>
  );
}