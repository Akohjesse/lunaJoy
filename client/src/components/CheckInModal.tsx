import { useEffect, useMemo, useState } from "react";
import { LuArrowLeft as ArrowLeft, LuArrowRight as ArrowRight, LuCheck as Check, LuX as X } from "react-icons/lu";
import { format } from "date-fns";
import { DatePicker } from "./DatePicker";
import { ScaleField } from "./ScaleField";
import type { DailyLog, LogInput, Symptom } from "../types";

type Props = {
  open: boolean;
  existing?: DailyLog;
  saving: boolean;
  onClose(): void;
  onSave(input: LogInput): Promise<void>;
};

const symptomNames = ["Low energy", "Trouble focusing", "Restlessness", "Low motivation", "Worry", "Irritability"];
const severityValues = [1, 2, 3, 4, 5];
const button =
  "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border-0 px-4.5 font-bold transition-[transform,box-shadow,background-color,color] duration-150 ease-[cubic-bezier(.23,1,.32,1)] hover:-translate-y-px active:scale-[.97] disabled:cursor-wait disabled:opacity-65";
const field = "flex flex-col gap-2 text-sm font-bold text-ink";
const input = "min-h-11.5 w-full rounded-[10px] border border-[#dcd8cf] bg-[#fbfaf7] px-3 py-2.5 text-sm text-ink outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(255,178,28,.15)]";
const eyebrow = "block text-xs font-bold tracking-[.11em] text-[#5d807a] uppercase";

const emptyLog = (): LogInput => ({
  date: format(new Date(), "yyyy-MM-dd"),
  mood: 3,
  anxiety: 3,
  sleepHours: 7,
  sleepQuality: 3,
  sleepDisturbances: "",
  activityType: "",
  activityMinutes: 0,
  socialInteractions: 3,
  stress: 3,
  symptoms: [],
  notes: "",
});

export function CheckInModal({ open, existing, saving, onClose, onSave }: Props) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<LogInput>(emptyLog);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setStep(0);
      setError("");
      setForm(existing ? { ...existing } : emptyLog());
    }
  }, [open, existing]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open, onClose]);

  const stepTitles = useMemo(() => ["How are you feeling?", "Sleep and movement", "Anything else?"], []);

  if (!open) return null;

  const update = <K extends keyof LogInput>(key: K, value: LogInput[K]) => setForm((current) => ({ ...current, [key]: value }));

  const toggleSymptom = (name: string) => {
    const current = form.symptoms.find((symptom) => symptom.name === name);
    update("symptoms", current ? form.symptoms.filter((symptom) => symptom.name !== name) : [...form.symptoms, { name, severity: 2 }]);
  };

  const updateSymptom = (name: string, severity: number) => {
    update(
      "symptoms",
      form.symptoms.map((symptom): Symptom => (symptom.name === name ? { ...symptom, severity } : symptom)),
    );
  };

  const submit = async () => {
    setError("");
    try {
      await onSave(form);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Your check-in could not be saved.");
    }
  };

  return (
    <div className="fixed inset-0 z-100 grid animate-[fade-in_.2s_ease] place-items-center bg-[rgba(24,38,34,.48)] p-0 backdrop-blur-[6px] min-[701px]:p-6" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section
        className="flex h-full max-h-none w-full animate-[modal-in_.25s_ease] flex-col overflow-hidden bg-panel shadow-[0_30px_90px_rgba(25,38,34,.28)] min-[701px]:h-auto min-[701px]:max-h-[calc(100vh-48px)] min-[701px]:w-[min(850px,100%)] min-[701px]:rounded-[22px]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkin-title"
      >
        <div className="flex items-start justify-between px-[19px] pt-5 pb-3.5 min-[701px]:px-7 min-[701px]:pt-6 min-[701px]:pb-4">
          <div>
            <span className={eyebrow}>Daily check-in · Step {step + 1} of 3</span>
            <h2 className="mt-1.5 mb-0 text-[25px]" id="checkin-title">
              {stepTitles[step]}
            </h2>
          </div>
          <button className="grid h-10 w-10 cursor-pointer place-items-center rounded-[11px] border border-line bg-white/60" onClick={onClose} aria-label="Close check-in">
            <X size={20} />
          </button>
        </div>
        <div className="h-[3px] bg-[#ece9e2]">
          <span className="block h-full bg-accent transition-[width] duration-300" style={{ width: `${((step + 1) / 3) * 100}%` }} />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5 min-[701px]:min-h-[430px] min-[701px]:flex-none min-[701px]:p-7">
          {step === 0 && (
            <div className="animate-[step-in_.22s_ease]">
              <DatePicker value={form.date} max={format(new Date(), "yyyy-MM-dd")} onChange={(value) => update("date", value)} />
              <div className="grid grid-cols-1 gap-4.5 min-[701px]:grid-cols-2">
                <ScaleField label="Mood" hint="How you’ve felt overall" value={form.mood} low="Very low" high="Very good" onChange={(value) => update("mood", value)} />
                <ScaleField label="Anxiety" hint="How anxious you felt" value={form.anxiety} low="Calm" high="Very anxious" onChange={(value) => update("anxiety", value)} />
                <ScaleField label="Stress" hint="How stressed you felt" value={form.stress} low="Low" high="Very high" onChange={(value) => update("stress", value)} />
                <ScaleField label="Social connection" hint="How connected you felt" value={form.socialInteractions} low="Isolated" high="Connected" onChange={(value) => update("socialInteractions", value)} />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="animate-[step-in_.22s_ease]">
              <div className="mb-5 grid grid-cols-1 gap-4.5 min-[701px]:grid-cols-2">
                <label className={field}>
                  <span>Hours of sleep</span>
                  <input className={input} type="number" min="0" max="24" step="0.5" value={form.sleepHours} onChange={(event) => update("sleepHours", Number(event.target.value))} />
                </label>
                <label className={field}>
                  <span>Sleep quality</span>
                  <select className={input} value={form.sleepQuality} onChange={(event) => update("sleepQuality", Number(event.target.value))}>
                    <option value="1">Very poor</option>
                    <option value="2">Poor</option>
                    <option value="3">Fair</option>
                    <option value="4">Good</option>
                    <option value="5">Restorative</option>
                  </select>
                </label>
                <label className={field}>
                  <span>Activity type</span>
                  <input className={input} value={form.activityType} placeholder="Walking, yoga, gym…" onChange={(event) => update("activityType", event.target.value)} />
                </label>
                <label className={field}>
                  <span>Activity duration</span>
                  <div className="relative flex items-center">
                    <input className={`${input} pr-11`} type="number" min="0" max="1440" value={form.activityMinutes} onChange={(event) => update("activityMinutes", Number(event.target.value))} />
                    <span className="absolute right-3 text-xs font-normal text-muted">min</span>
                  </div>
                </label>
              </div>
              <label className={field}>
                <span>Any sleep disturbances?</span>
                <textarea className={`${input} resize-y leading-normal`} rows={3} value={form.sleepDisturbances} placeholder="Optional — waking up, vivid dreams, trouble falling asleep…" onChange={(event) => update("sleepDisturbances", event.target.value)} />
              </label>
            </div>
          )}

          {step === 2 && (
            <div className="animate-[step-in_.22s_ease]">
              <div>
                <div>
                  <h3 className="mt-0 mb-1 text-[17px]">What showed up today?</h3>
                  <p className="m-0 text-[13px] text-muted">Choose anything that feels relevant.</p>
                </div>
                <div className="my-4.5 flex flex-wrap gap-2">
                  {symptomNames.map((name) => {
                    const active = form.symptoms.some((symptom) => symptom.name === name);
                    return (
                      <button type="button" key={name} className={`flex min-h-9 cursor-pointer items-center gap-1 rounded-full border px-3 text-[13px] ${active ? "border-accent bg-[#fff1c6] text-brand" : "border-[#dbd8d0] bg-[#f8f6f1]"}`} onClick={() => toggleSymptom(name)}>
                        {active && <Check size={15} />}
                        {name}
                      </button>
                    );
                  })}
                </div>
                <div className="space-y-2.5">
                  {form.symptoms.map((symptom) => (
                    <div className="flex flex-col gap-2 rounded-xl border border-line bg-white/45 p-3 min-[501px]:flex-row min-[501px]:items-center min-[501px]:justify-between" key={symptom.name}>
                      <span className="text-sm font-bold text-ink">{symptom.name}</span>
                      <div className="flex gap-1.5" role="group" aria-label={`${symptom.name} severity`}>
                        {severityValues.map((severity) => (
                          <button
                            className={`grid h-9 w-9 cursor-pointer place-items-center rounded-lg border
                              text-sm font-bold transition-[transform,background-color,border-color]
                              duration-150 ease-[cubic-bezier(.23,1,.32,1)] active:scale-[.96]
                              ${symptom.severity === severity ? "border-accent bg-accent text-brand" : "border-[#d9d6ce] bg-[#f8f6f1] text-muted hover:border-[#c9c5bb]"}`}
                            type="button"
                            aria-pressed={symptom.severity === severity}
                            onClick={() => updateSymptom(symptom.name, severity)}
                            key={severity}
                          >
                            {severity}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <label className={`${field} mt-5.5`}>
                <span>Anything else on your mind?</span>
                <textarea className={`${input} resize-y leading-normal`} rows={4} value={form.notes} placeholder="Optional" onChange={(event) => update("notes", event.target.value)} />
              </label>
            </div>
          )}
          {error && (
            <div className="mt-4 rounded-[9px] bg-[#fae8e3] px-3 py-2.5 text-[13px] text-[#8d483c]" role="alert">
              {error}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3.5 border-t border-line px-[19px] py-3.5 min-[701px]:px-7 min-[701px]:py-4">
          <p className="hidden text-xs text-muted min-[701px]:block">Private to your account.</p>
          <div className="flex w-full gap-2 min-[701px]:w-auto">
            {step > 0 && (
              <button className={`${button} flex-1 bg-[#f1efe9] text-ink min-[701px]:flex-none`} onClick={() => setStep((current) => current - 1)}>
                <ArrowLeft size={17} />
                Back
              </button>
            )}
            {step < 2 ? (
              <button className={`${button} flex-1 bg-accent text-brand shadow-[0_8px_20px_rgba(255,178,28,.24)] min-[701px]:flex-none`} onClick={() => setStep((current) => current + 1)}>
                Continue
                <ArrowRight size={17} />
              </button>
            ) : (
              <button className={`${button} flex-1 bg-accent text-brand shadow-[0_8px_20px_rgba(255,178,28,.24)] min-[701px]:flex-none`} disabled={saving} onClick={submit}>
                {saving ? "Saving…" : "Save check-in"}
                <Check size={17} />
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
