export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div className="w-[400px] max-w-full rounded-xl bg-white text-[13px] shadow-[0_5px_15px_rgba(0,0,0,0.08),0_15px_35px_-5px_rgba(25,28,33,0.2),0_0_0_1px_rgba(0,0,0,0.07)]">
      <div className="px-8 pb-8 pt-8">
        <div className="mb-8 text-center">
          <h1 className="!text-[17px] font-bold leading-6 text-gray-900 md:!text-[17px] xl:!text-[17px]">
            {title}
          </h1>
          {subtitle && <p className="mt-1 text-gray-500">{subtitle}</p>}
        </div>
        {children}
      </div>
      {footer && (
        <div className="rounded-b-xl border-t border-gray-200 bg-gray-50 px-8 py-4 text-center text-gray-500">
          {footer}
        </div>
      )}
    </div>
  );
}