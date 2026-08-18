import { useEffect } from "react";
import { format, parseISO } from "date-fns";
import { LuX as X } from "react-icons/lu";
import type { DailyLog } from "../types";

type LogDetailsModalProps = {
  log: DailyLog;
  onClose(): void;
};

const sleepQuality = ["", "Very poor", "Poor", "Fair", "Good", "Restorative"];

export function LogDetailsModal({ log, onClose }: LogDetailsModalProps) {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  const details = [
    ["Mood", `${log.mood}/5`],
    ["Anxiety", `${log.anxiety}/5`],
    ["Stress", `${log.stress}/5`],
    ["Sleep", `${log.sleepHours} hours`],
    ["Sleep quality", sleepQuality[log.sleepQuality]],
    ["Social engagement", `${log.socialInteractions}/5`],
    ["Movement", log.activityType || "No movement recorded"],
    ["Movement duration", `${log.activityMinutes} minutes`],
  ];

  return (
    <div className="fixed inset-0 z-100 grid animate-[fade-in_.2s_ease] place-items-center bg-[rgba(24,38,34,.48)] p-4 backdrop-blur-[6px]" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="max-h-[calc(100vh-32px)] w-full max-w-[720px] animate-[modal-in_.25s_ease] overflow-y-auto rounded-[22px] bg-panel p-5 shadow-[0_30px_90px_rgba(25,38,34,.28)] min-[701px]:p-7" role="dialog" aria-modal="true" aria-labelledby="history-log-title">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-bold tracking-[.11em] text-[#5d807a] uppercase">Past check-in</span>
            <h2 className="mt-1.5 mb-0 text-[25px]" id="history-log-title">
              {format(parseISO(log.date), "EEEE, MMMM d, yyyy")}
            </h2>
          </div>
          <button className="grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-[11px] border border-line bg-white/60" type="button" onClick={onClose} aria-label="Close past check-in">
            <X size={20} />
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 min-[701px]:grid-cols-4">
          {details.map(([label, value]) => (
            <div className="rounded-xl bg-[#f3f1eb] p-3.5" key={label}>
              <span className="block text-xs font-bold tracking-[.08em] text-muted uppercase">{label}</span>
              <strong className="mt-1.5 block text-sm text-ink">{value}</strong>
            </div>
          ))}
        </div>

        <div className="mt-5 space-y-4 border-t border-line pt-5 text-sm">
          <div>
            <strong className="text-ink">Sleep disturbances</strong>
            <p className="mt-1 mb-0 leading-6 text-muted">{log.sleepDisturbances || "None reported"}</p>
          </div>
          <div>
            <strong className="text-ink">Symptoms</strong>
            <div className="mt-2 flex flex-wrap gap-2">
              {log.symptoms.length ? (
                log.symptoms.map((symptom) => (
                  <span className="rounded-full bg-[#fff1c6] px-3 py-1.5 text-xs font-bold text-brand" key={symptom.name}>
                    {symptom.name} · {symptom.severity}/5
                  </span>
                ))
              ) : (
                <span className="text-muted">None reported</span>
              )}
            </div>
          </div>
          <div>
            <strong className="text-ink">Notes</strong>
            <p className="mt-1 mb-0 leading-6 text-muted">{log.notes || "No notes added"}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
