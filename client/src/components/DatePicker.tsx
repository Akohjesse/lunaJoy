import { useState, type CSSProperties } from "react";
import * as Popover from "@radix-ui/react-popover";
import { format, parseISO } from "date-fns";
import { DayPicker } from "react-day-picker";
import { LuCalendarDays as CalendarDays, LuChevronDown as ChevronDown } from "react-icons/lu";
import "react-day-picker/style.css";

type DatePickerProps = {
  value: string;
  max: string;
  onChange(value: string): void;
};

const calendarStyle = {
  "--rdp-accent-color": "#2a514c",
  "--rdp-accent-background-color": "#fff1c6",
  "--rdp-day-height": "38px",
  "--rdp-day-width": "38px",
  "--rdp-day_button-height": "36px",
  "--rdp-day_button-width": "36px",
  "--rdp-nav_button-height": "34px",
  "--rdp-nav_button-width": "34px",
} as CSSProperties;

export function DatePicker({ value, max, onChange }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const selected = parseISO(value);
  const latestDate = parseISO(max);

  return (
    <div className="mb-5 max-w-[340px]">
      <span className="mb-2 block text-sm font-bold text-ink">Check-in date</span>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button
            className="flex min-h-13 w-full cursor-pointer items-center gap-3 rounded-xl border
              border-[#dcd8cf] bg-white px-3.5 text-left outline-none
              transition-[border-color,box-shadow,transform] duration-150
              ease-[cubic-bezier(.23,1,.32,1)] hover:border-[#c8c3b9] active:scale-[.99]
              data-[state=open]:border-accent data-[state=open]:shadow-[0_0_0_3px_rgba(255,178,28,.15)]"
            type="button"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-[#fff1c6] text-brand">
              <CalendarDays size={19} />
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <small className="text-xs font-bold tracking-[.08em] text-muted uppercase">Selected date</small>
              <strong className="truncate text-sm text-ink">{format(selected, "EEEE, MMMM d, yyyy")}</strong>
            </span>
            <ChevronDown className="shrink-0 text-muted" size={17} />
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            className="z-150 rounded-2xl border border-line bg-panel p-3 text-ink
              shadow-[0_20px_55px_rgba(31,64,60,.2)] outline-none
              [transform-origin:var(--radix-popover-content-transform-origin)]
              data-[state=open]:animate-[popover-in_180ms_cubic-bezier(.23,1,.32,1)]"
            align="start"
            sideOffset={8}
            collisionPadding={16}
          >
            <DayPicker
              mode="single"
              selected={selected}
              defaultMonth={selected}
              endMonth={latestDate}
              disabled={{ after: latestDate }}
              onSelect={(date) => {
                if (date) {
                  onChange(format(date, "yyyy-MM-dd"));
                  setOpen(false);
                }
              }}
              modifiersClassNames={{
                selected: "[&>button]:!border-accent [&>button]:!bg-accent [&>button]:!text-brand",
                today: "[&>button]:font-extrabold",
              }}
              showOutsideDays
              style={calendarStyle}
            />
            <Popover.Arrow className="fill-panel" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
