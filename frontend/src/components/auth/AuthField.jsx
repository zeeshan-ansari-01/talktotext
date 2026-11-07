import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/utils/cn";

export default function AuthField({
  id,
  label,
  labelRight,
  type = "text",
  className,
  ...props
}) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="font-medium text-gray-900">
          {label}
        </label>
        {labelRight}
      </div>
      <div className="relative">
        <input
          id={id}
          type={isPassword && visible ? "text" : type}
          className={cn(
            "h-8 w-full rounded-md border border-gray-300 bg-white px-3 text-[13px] text-gray-900 shadow-sm outline-none placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-300",
            isPassword && "pr-10"
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((prev) => !prev)}
            aria-label={visible ? "Hide password" : "Show password"}
            className="absolute right-1 top-1/2 flex h-6 w-7 -translate-y-1/2 items-center justify-center rounded bg-transparent text-gray-500 hover:bg-transparent hover:text-gray-700"
          >
            {visible ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        )}
      </div>
    </div>
  );
}