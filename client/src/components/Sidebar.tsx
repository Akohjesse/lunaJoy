import { LuActivity as Activity, LuCalendarDays as CalendarDays, LuHeartPulse as HeartPulse, LuLayoutDashboard as LayoutDashboard, LuSettings as Settings, LuX as X } from "react-icons/lu";
import { Logo } from "./Logo";

type SidebarProps = {
  open: boolean;
  onClose(): void;
  onCheckIn(): void;
};

const navItem = [
  "flex h-11.5 w-full cursor-pointer items-center gap-3 rounded-[11px] border-0",
  "bg-transparent px-3.5 text-[13px] font-bold text-[#e9f0ee] no-underline",
  "transition-[transform,background-color,color] duration-150",
  "ease-[cubic-bezier(.23,1,.32,1)] hover:bg-white/10 hover:text-white active:scale-[.98]",
].join(" ");

const closeButton = ["grid h-10 w-10 cursor-pointer place-items-center rounded-[11px] border border-line", "bg-white/60 transition-transform duration-150 ease-[cubic-bezier(.23,1,.32,1)]", "active:scale-[.96] min-[1001px]:hidden"].join(" ");

export function Sidebar({ open, onClose, onCheckIn }: SidebarProps) {
  const position = open ? "translate-x-0" : "-translate-x-full";

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 flex w-[245px] flex-col border-r
        border-[#21433e] bg-brand px-[19px] pt-7 pb-5.5
        shadow-[15px_0_40px_rgba(31,48,42,.18)] transition-transform duration-250
        min-[1001px]:translate-x-0 min-[1001px]:shadow-none ${position}`}
    >
      <div className="flex justify-between px-2.5 pb-9">
        <Logo />
        <button className={closeButton} onClick={onClose} aria-label="Close navigation">
          <X size={20} />
        </button>
      </div>

      <nav className="flex flex-col gap-1.5">
        <a className={`${navItem} !bg-accent !text-brand`} href="#overview">
          <LayoutDashboard size={19} />
          Overview
        </a>
        <button className={navItem} onClick={onCheckIn}>
          <HeartPulse size={19} />
          Daily check-in
        </button>
        <a className={navItem} href="#trends">
          <Activity size={19} />
          My trends
        </a>
        <a className={navItem} href="#history">
          <CalendarDays size={19} />
          History
        </a>
      </nav>

      <nav className="mt-auto">
        <button className={navItem}>
          <Settings size={19} />
          Settings
        </button>
      </nav>
    </aside>
  );
}
