import { useState } from "react";
import { format, parseISO } from "date-fns";
import { LuChevronDown as ChevronDown, LuMoonStar as MoonStar, LuSun as Sun, LuTrash2 as Trash } from "react-icons/lu";
import type { DailyLog } from "../types";
import { describeDay, metricKeys } from "../wellbeing";
import { MetricCard } from "./MetricCard";

type TodayReflectionProps = {
  log?: DailyLog;
  deleting: boolean;
  onCheckIn(): void;
  onDelete(date: string): Promise<void>;
};

const sleepQuality = ["", "Very poor", "Poor", "Fair", "Good", "Restorative"];

export function TodayReflection({ log, deleting, onCheckIn, onDelete }: TodayReflectionProps) {
  const [expanded, setExpanded] = useState(false);

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

  const deleteLog = () => {
    if (window.confirm("Delete today’s check-in? This cannot be undone.")) void onDelete(log.date);
  };

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
          <h3 className="mt-1 mb-0 text-[20px]">You took time to check in.</h3>
          <p className="mt-1.5 mb-0 max-w-[680px] text-sm leading-6 text-muted">{describeDay(log)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 min-[1001px]:grid-cols-4">
        {metricKeys.map((metric) => (
          <MetricCard metric={metric} value={log[metric]} key={metric} />
        ))}
      </div>

      <button className="mt-4 flex min-h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-line bg-transparent text-sm font-bold text-brand active:scale-[.99]" type="button" aria-expanded={expanded} onClick={() => setExpanded((current) => !current)}>
        {expanded ? "Hide details" : "View details"}
        <ChevronDown className={`transition-transform duration-150 ${expanded ? "rotate-180" : ""}`} size={17} />
      </button>

      {expanded && (
        <div className="mt-4 rounded-2xl border border-line bg-[#fbfaf6] p-4.5">
          <dl className="m-0 grid grid-cols-2 gap-x-5 gap-y-4 text-sm min-[701px]:grid-cols-4">
            <div>
              <dt className="text-xs font-bold tracking-[.08em] text-muted uppercase">Sleep quality</dt>
              <dd className="mt-1.5 ml-0 font-bold text-ink">{sleepQuality[log.sleepQuality]}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold tracking-[.08em] text-muted uppercase">Movement</dt>
              <dd className="mt-1.5 ml-0 font-bold text-ink">{log.activityType ? `${log.activityType} · ${log.activityMinutes} min` : "No movement added"}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold tracking-[.08em] text-muted uppercase">Connection</dt>
              <dd className="mt-1.5 ml-0 font-bold text-ink">{log.socialInteractions}/5</dd>
            </div>
            <div>
              <dt className="text-xs font-bold tracking-[.08em] text-muted uppercase">Symptoms</dt>
              <dd className="mt-1.5 ml-0 font-bold text-ink">{log.symptoms.length ? log.symptoms.map((symptom) => symptom.name).join(", ") : "None recorded"}</dd>
            </div>
          </dl>
          {log.notes && (
            <div className="mt-4 border-t border-line pt-4">
              <span className="text-xs font-bold tracking-[.08em] text-muted uppercase">Notes</span>
              <p className="mt-1.5 mb-0 text-sm leading-6 text-ink">{log.notes}</p>
            </div>
          )}
          <div className="mt-4 flex justify-end border-t border-line pt-4">
            <button className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-xl border border-[#e7c6bf] bg-transparent px-3.5 text-sm font-bold text-[#9b493e] active:scale-[.97] disabled:cursor-wait disabled:opacity-60" type="button" disabled={deleting} onClick={deleteLog}>
              <Trash size={16} />
              {deleting ? "Deleting…" : "Delete check-in"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
