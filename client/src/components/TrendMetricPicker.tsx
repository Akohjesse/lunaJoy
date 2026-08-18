import * as Popover from "@radix-ui/react-popover";
import { useState } from "react";
import { LuCheck as Check, LuChevronsRight as ChevronsRight } from "react-icons/lu";
import { trendMetricDetails, trendMetricKeys, type TrendMetricKey } from "../wellbeing";

type TrendMetricPickerProps = {
  value: TrendMetricKey[];
  onChange(value: TrendMetricKey[]): void;
};

export function TrendMetricPicker({ value, onChange }: TrendMetricPickerProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);

  const changeOpen = (nextOpen: boolean) => {
    if (nextOpen) setDraft(value);
    setOpen(nextOpen);
  };

  const toggleMetric = (metric: TrendMetricKey) => {
    if (draft.includes(metric)) {
      setDraft(draft.filter((item) => item !== metric));
      return;
    }

    if (draft.length < 3) setDraft([...draft, metric]);
  };

  const applySelection = () => {
    if (draft.length !== 3) return;
    onChange(draft);
    setOpen(false);
  };

  return (
    <Popover.Root open={open} onOpenChange={changeOpen}>
      <Popover.Trigger asChild>
        <button className="grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-[10px] border border-line bg-white text-brand outline-none active:scale-[.96] data-[state=open]:bg-[#fff1c6]" type="button" aria-label="Choose graph parameters">
          <ChevronsRight size={19} />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="z-150 w-67 rounded-2xl border border-line bg-panel p-2 shadow-[0_20px_55px_rgba(31,64,60,.2)] outline-none [transform-origin:var(--radix-popover-content-transform-origin)] data-[state=open]:animate-[popover-in_180ms_cubic-bezier(.23,1,.32,1)]"
          align="end"
          sideOffset={8}
          collisionPadding={16}
        >
          <div className="px-2.5 pt-2 pb-2.5">
            <strong className="block text-sm text-ink">Choose graph parameters</strong>
            <small className="mt-1 block text-xs leading-5 text-muted">Select exactly three parameters.</small>
          </div>
          <div className="space-y-0.5">
            {trendMetricKeys.map((metric) => {
              const selected = draft.includes(metric);
              const disabled = !selected && draft.length === 3;

              return (
                <button
                  className="flex min-h-10 w-full cursor-pointer items-center gap-2.5 rounded-[10px] border-0 bg-transparent px-2.5 text-left text-sm text-ink hover:bg-[#f3f0e8] disabled:cursor-not-allowed disabled:opacity-40"
                  type="button"
                  aria-pressed={selected}
                  disabled={disabled}
                  onClick={() => toggleMetric(metric)}
                  key={metric}
                >
                  <span className={`grid h-5 w-5 place-items-center rounded-md border ${selected ? "border-accent bg-accent text-brand" : "border-[#d4d0c7]"}`}>{selected && <Check size={14} />}</span>
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: trendMetricDetails[metric].color }} />
                  {trendMetricDetails[metric].label}
                </button>
              );
            })}
          </div>
          <div className="mt-1 flex items-center justify-between gap-3 border-t border-line px-2.5 pt-2 pb-1">
            <span className="text-xs text-muted">{draft.length}/3 selected</span>
            <button className="min-h-9 cursor-pointer rounded-lg border-0 bg-accent px-3 text-xs font-bold text-brand active:scale-[.97] disabled:cursor-not-allowed disabled:opacity-45" type="button" disabled={draft.length !== 3} onClick={applySelection}>
              Apply
            </button>
          </div>
          <Popover.Arrow className="fill-panel" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
