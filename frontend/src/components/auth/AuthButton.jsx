import { cn } from "@/utils/cn";

export default function AuthButton({
  children = "Continue",
  className,
  loading = false,
  ...props
}) {
  return (
    <button
      disabled={loading}
      className={cn(
        "flex h-8 w-full items-center justify-center gap-2 rounded-md bg-gradient-to-b from-[#3d3e45] to-[#2a2b30] text-[13px] font-semibold text-white shadow-[0_1px_1px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.12)] transition hover:from-[#46474f] hover:to-[#32333a] disabled:opacity-60",
        className
      )}
      {...props}
    >
      <span>{loading ? "Please wait..." : children}</span>
      {!loading && (
        <svg width="6" height="8" viewBox="0 0 6 8" className="opacity-60" aria-hidden="true">
          <path d="M0 0l6 4-6 4z" fill="currentColor" />
        </svg>
      )}
    </button>
  );
}