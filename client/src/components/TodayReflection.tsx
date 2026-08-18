import { format, parseISO } from "date-fns";
import { LuMoonStar as MoonStar, LuSun as Sun } from "react-icons/lu";
import type { DailyLog } from "../types";
import { describeDay, metricKeys } from "../wellbeing";
import { MetricCard } from "./MetricCard";

type TodayReflectionProps = {
  log?: DailyLog;
  onCheckIn(): void;
};

export function TodayReflection({ log, onCheckIn }: TodayReflectionProps) {
  if (!log) {
    return (
      <section className="grid grid-cols-[auto_1fr] items-center gap-5 rounded-[20px] border border-[#efd791] bg-[#fff2cd] p-5 min-[701px]:grid-cols-[auto_1fr_auto] min-[701px]:px-7 min-[701px]:py-6">
        <div className="grid h-13.5 w-13.5 place-items-center rounded-[17px] bg-white/50 text-[#b6764b]">
          <MoonStar size={28} />
        </div>
        <div>
          <span className="text-xs font-bold tracking-[.11em] text-[#5d807a] uppercase">Today’s reflection</span>
          <h2 className="my-1 text-[19px]">Start with a simple check-in.</h2>
          <p className="m-0 text-sm leading-6 text-muted">Notice your mood, anxiety, stress, and sleep. No judgment.</p>
        </div>
        <button className="col-span-2 min-h-11 cursor-pointer rounded-xl border-0 bg-accent px-4.5 font-bold text-brand active:scale-[.97] min-[701px]:col-span-1" onClick={onCheckIn}>
          Check in now
        </button>
      </section>
    );
  }

  return (
    <section className="rounded-[22px] border border-line bg-panel p-5 min-[701px]:p-7">
      <div className="flex items-center justify-between gap-4">
        <h2 className="m-0 text-[22px]">Today’s reflection</h2>
        <span className="rounded-full bg-[#e2ece6] px-3 py-1.5 text-xs font-bold text-[#527469]">Complete</span>
      </div>

      <div className="my-6 flex items-center gap-3.5 border-b border-line pb-6">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[15px] bg-[#fceddc] text-[#d8864f]">
          <Sun size={23} />
        </span>
        <div>
          <p className="m-0 text-sm text-muted">{format(parseISO(log.date), "EEEE, MMMM d")}</p>
          <h3 className="mt-1 mb-0 text-[20px]">Here’s how you’re feeling today.</h3>
          <p className="mt-1.5 mb-0 max-w-[680px] text-sm leading-6 text-muted">{describeDay(log)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 min-[1001px]:grid-cols-4">
        {metricKeys.map((metric) => (
          <MetricCard metric={metric} value={log[metric]} key={metric} />
        ))}
      </div>
    </section>
  );
}
