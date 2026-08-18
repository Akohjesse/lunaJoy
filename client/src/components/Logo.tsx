export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="inline-flex items-center">
      <img className={compact ? "block w-10.5 object-cover object-left" : "block w-[150px]"} src="/logo+1.webp" alt="LunaJoy" />
    </div>
  );
}
