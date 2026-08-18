import { useMemo, useState } from "react";
import { LuBell as Bell, LuMenu as Menu, LuPlus as Plus } from "react-icons/lu";
import { format, isToday, parseISO } from "date-fns";
import type { DailyLog, LogInput, User } from "../types";
import { averageMetric, describePeriod, metricDetails, metricKeys } from "../wellbeing";
import { AccountMenu } from "./AccountMenu";
import { CheckInModal } from "./CheckInModal";
import { InfoTooltip } from "./InfoTooltip";
import { MetricCard } from "./MetricCard";
import { Sidebar } from "./Sidebar";
import { TodayReflection } from "./TodayReflection";
import { TrendChart } from "./TrendChart";

type DashboardProps = {
  user: User;
  logs: DailyLog[];
  period: "week" | "month";
  loadingLogs: boolean;
  saving: boolean;
  deleting: boolean;
  toast: string;
  onPeriodChange(period: "week" | "month"): void;
  onSave(input: LogInput): Promise<void>;
  onDelete(date: string): Promise<void>;
  onLogout(): Promise<void>;
};

const button = [
  "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl",
  "border-0 px-4.5 font-bold transition-[transform,box-shadow,background-color,color]",
  "duration-150 ease-[cubic-bezier(.23,1,.32,1)] hover:-translate-y-px",
  "active:scale-[.97] disabled:cursor-wait disabled:opacity-65",
].join(" ");

const iconButton = ["grid h-10 w-10 cursor-pointer place-items-center rounded-[11px] border border-line", "bg-white/60 transition-transform duration-150 ease-[cubic-bezier(.23,1,.32,1)]", "active:scale-[.96]"].join(" ");

const eyebrow = ["block text-[11px] font-bold tracking-[.13em] text-[#5d807a] uppercase"].join(" ");

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function Dashboard({ user, logs, period, loadingLogs, saving, deleting, toast, onPeriodChange, onSave, onDelete, onLogout }: DashboardProps) {
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const todayLog = useMemo(() => logs.find((log) => isToday(parseISO(log.date))), [logs]);

  const openCheckIn = () => {
    setCheckInOpen(true);
    setMobileNav(false);
  };

  const saveLog = async (input: LogInput) => {
    await onSave(input);
    setCheckInOpen(false);
  };

  return (
    <div className="min-h-screen">
      <Sidebar open={mobileNav} onClose={() => setMobileNav(false)} onCheckIn={openCheckIn} />

      <div className="min-h-screen min-[1001px]:ml-[245px]">
        <header
          className="sticky top-0 z-20 flex h-[67px] items-center justify-between border-b
            border-line bg-[rgba(255,252,238,.88)] px-4 backdrop-blur-xl
            min-[701px]:h-[76px] min-[701px]:px-6 min-[1001px]:px-10"
        >
          <button className={`${iconButton} mr-auto min-[1001px]:hidden`} onClick={() => setMobileNav(true)} aria-label="Open navigation">
            <Menu size={21} />
          </button>

          <div className="hidden text-[13px] text-muted min-[1001px]:block">
            <span className="mr-2 font-bold text-ink">{format(new Date(), "EEEE")}</span>
            {format(new Date(), "MMMM d, yyyy")}
          </div>

          <div className="flex items-center gap-3.5">
            <button className={`${iconButton} hidden min-[701px]:grid`} aria-label="Notifications">
              <Bell size={19} />
            </button>

            <AccountMenu user={user} onLogout={onLogout} />
          </div>
        </header>

        <main
          className="mx-auto max-w-[1180px] px-4 pt-7.5 pb-15 min-[701px]:px-6.5
            min-[701px]:pt-9.5 min-[1001px]:px-11 min-[1001px]:pt-12
            min-[1001px]:pb-20"
          id="overview"
        >
          <section
            className="mb-8.5 flex flex-col items-start justify-between gap-7.5
              min-[701px]:flex-row min-[701px]:items-end"
          >
            <div>
              <span className={eyebrow}>Your wellbeing journey</span>
              <h1
                className="my-2 text-[32px] tracking-[-.035em]
                  min-[701px]:text-[38px]"
              >
                {greeting()}, {user.name.split(" ")[0]}.
              </h1>
              <p className="m-0 text-muted">Take a moment to check in on how you’re really doing.</p>
            </div>
            <button
              className={`${button} w-full whitespace-nowrap bg-accent text-brand
                shadow-[0_8px_20px_rgba(255,178,28,.24)] hover:bg-[#f5a800]
                min-[701px]:w-auto`}
              onClick={openCheckIn}
            >
              <Plus size={19} />
              {todayLog ? "Update today’s check-in" : "Start today’s check-in"}
            </button>
          </section>

          <TodayReflection log={todayLog} deleting={deleting} onCheckIn={openCheckIn} onDelete={onDelete} />

          <section className="my-5.5 rounded-[20px] border border-line bg-panel p-5 min-[701px]:p-7">
            <div className="mb-5 flex flex-col justify-between gap-3 min-[701px]:flex-row min-[701px]:items-end">
              <div>
                <span className={eyebrow}>{period === "week" ? "Past 7 days" : "Past 30 days"}</span>
                <h2 className="my-1.5 text-[22px]">Your {period === "week" ? "weekly" : "monthly"} averages</h2>
                <p className="m-0 max-w-[680px] text-sm leading-6 text-muted">{describePeriod(logs)}</p>
              </div>
              <span className="text-xs text-muted">
                Based on {logs.length} {logs.length === 1 ? "check-in" : "check-ins"}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-3 min-[501px]:grid-cols-2 min-[1101px]:grid-cols-4">
              {metricKeys.map((metric) => (
                <MetricCard metric={metric} value={averageMetric(logs, metric)} averaged key={metric} />
              ))}
            </div>
          </section>

          <section
            className="mt-5.5 rounded-[20px] border border-line bg-panel p-5
              min-[701px]:p-7"
            id="trends"
          >
            <div
              className="flex flex-col items-start justify-between gap-7.5
                min-[701px]:flex-row"
            >
              <div>
                <span className={eyebrow}>Your patterns</span>
                <h2 className="my-1.5 text-[22px]">Wellbeing trends</h2>
                <p className="m-0 text-[13px] text-muted">A clear view of how you’ve been feeling.</p>
              </div>
              <div
                className="flex w-full self-stretch rounded-[10px] bg-[#efede7]
                  p-1 min-[701px]:w-auto"
              >
                {(["week", "month"] as const).map((value) => (
                  <button
                    className={`h-8 flex-1 cursor-pointer rounded-lg border-0 px-3
                      text-xs font-bold min-[701px]:flex-none ${period === value ? "bg-white text-brand-dark shadow-[0_2px_8px_rgba(29,47,41,.08)]" : "bg-transparent text-muted"}`}
                    onClick={() => onPeriodChange(value)}
                    key={value}
                  >
                    {value === "week" ? "7 days" : "30 days"}
                  </button>
                ))}
              </div>
            </div>

            <div className="my-6 flex flex-wrap items-center gap-4.5 text-[11px] text-muted">
              {metricKeys.map((metric) => (
                <span className="flex items-center gap-1.5" key={metric}>
                  <i className="h-2 w-2 rounded-full" style={{ backgroundColor: metricDetails[metric].color }} />
                  {metricDetails[metric].label}
                  <InfoTooltip label={`About ${metricDetails[metric].label.toLowerCase()} in this chart`}>{metricDetails[metric].tooltip}</InfoTooltip>
                </span>
              ))}
              <small
                className="w-full text-[#729087] min-[701px]:ml-auto
                  min-[701px]:w-auto"
              >
                {loadingLogs ? "Refreshing…" : "Updates live"}
              </small>
            </div>
            <TrendChart logs={logs} />
          </section>

          <section
            className="mt-5.5 rounded-[20px] border border-line bg-panel p-5
              min-[701px]:p-7"
            id="history"
          >
            <div>
              <span className={eyebrow}>Recent reflections</span>
              <h2 className="my-1.5 text-[22px]">Your check-in history</h2>
            </div>

            {logs.length ? (
              <div className="mt-5 border-t border-line">
                {[...logs]
                  .reverse()
                  .slice(0, 5)
                  .map((log) => {
                    const date = parseISO(log.date);

                    return (
                      <button
                        className="grid min-h-[66px] w-full cursor-pointer
                          grid-cols-[45px_1fr_20px] items-center gap-3.5 border-0
                          border-b border-line bg-transparent text-left
                          hover:bg-[#faf8f3]
                          min-[701px]:grid-cols-[45px_1fr_auto_20px]"
                        key={log.id}
                        onClick={openCheckIn}
                      >
                        <span
                          className="grid h-[43px] w-[39px] place-content-center
                            rounded-[11px] bg-[#edeae2] text-center"
                        >
                          <strong className="leading-none">{format(date, "d")}</strong>
                          <small className="text-[11px] text-muted">{format(date, "MMM")}</small>
                        </span>
                        <span className="flex flex-col gap-1">
                          <strong>{isToday(date) ? "Today’s check-in" : format(date, "EEEE")}</strong>
                          <small className="text-[11px] text-muted">
                            {log.activityType || "A quiet day"} · {log.sleepHours}h sleep
                          </small>
                        </span>
                        <span
                          className="hidden rounded-full bg-[#e5ede8] px-2.5 py-1.5
                            text-xs text-brand min-[701px]:block"
                        >
                          Mood {log.mood}/5
                        </span>
                        <span>›</span>
                      </button>
                    );
                  })}
              </div>
            ) : (
              <p className="text-[13px] text-muted">Your check-ins will appear here.</p>
            )}
          </section>
        </main>
      </div>

      <CheckInModal open={checkInOpen} existing={todayLog} saving={saving} onClose={() => setCheckInOpen(false)} onSave={saveLog} />

      {toast && (
        <div
          className="fixed right-4 bottom-4 left-4 z-120 flex animate-[toast-in_.3s_ease]
            items-center gap-2.5 rounded-xl bg-brand-dark px-4 py-3.5 text-[13px]
            text-white shadow-[0_15px_35px_rgba(27,48,41,.3)]
            min-[701px]:right-7 min-[701px]:bottom-7 min-[701px]:left-auto"
        >
          <span className="text-[#f5d49e]">✓</span>
          {toast}
        </div>
      )}
    </div>
  );
}
