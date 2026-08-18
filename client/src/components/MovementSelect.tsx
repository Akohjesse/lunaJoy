import * as Popover from "@radix-ui/react-popover";
import { Command } from "cmdk";
import { useState } from "react";
import { LuCheck as Check, LuChevronDown as ChevronDown, LuSearch as Search } from "react-icons/lu";

type MovementSelectProps = {
  value: string;
  onChange(value: string): void;
};

const movementGroups = [
  {
    label: "Everyday movement",
    options: ["Walking", "Hiking", "Stair climbing", "Gardening", "Household chores", "Dog walking"],
  },
  {
    label: "Mind and body",
    options: ["Yoga", "Pilates", "Stretching", "Mobility work", "Tai chi", "Breathwork with movement"],
  },
  {
    label: "Cardio",
    options: ["Running", "Jogging", "Cycling", "Swimming", "Dancing", "Rowing", "Jump rope", "Elliptical"],
  },
  {
    label: "Strength and sport",
    options: ["Strength training", "Bodyweight training", "Gym workout", "HIIT", "Boxing", "Football", "Basketball", "Tennis", "Badminton", "Volleyball"],
  },
  {
    label: "Recovery",
    options: ["Physical therapy", "Gentle recovery", "Foam rolling", "Water exercise"],
  },
];

export function MovementSelect({ value, onChange }: MovementSelectProps) {
  const [open, setOpen] = useState(false);

  const selectMovement = (movement: string) => {
    onChange(movement);
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-2 text-sm font-bold text-ink">
      <span id="movement-label">Movement type</span>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button
            className="flex min-h-11.5 w-full cursor-pointer items-center justify-between rounded-[10px] border border-[#dcd8cf] bg-[#fbfaf7] px-3 py-2.5 text-left text-sm font-normal text-ink outline-none hover:border-[#c9c4b8] focus-visible:border-accent focus-visible:shadow-[0_0_0_3px_rgba(255,178,28,.15)]"
            type="button"
            aria-labelledby="movement-label"
          >
            <span className={value ? "text-ink" : "text-muted"}>{value || "Choose a movement"}</span>
            <ChevronDown className="shrink-0 text-muted" size={17} />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className="z-180 w-[var(--radix-popover-trigger-width)] min-w-64 rounded-xl border border-line bg-panel p-1.5 shadow-[0_18px_50px_rgba(31,64,60,.2)] outline-none [transform-origin:var(--radix-popover-content-transform-origin)] data-[state=open]:animate-[popover-in_180ms_cubic-bezier(.23,1,.32,1)]"
            align="start"
            sideOffset={7}
            collisionPadding={16}
          >
            <Command className="overflow-hidden" loop>
              <div className="flex items-center gap-2 border-b border-line px-2.5">
                <Search className="shrink-0 text-muted" size={16} />
                <Command.Input className="h-10 w-full border-0 bg-transparent text-sm text-ink outline-none placeholder:text-muted" placeholder="Search movements…" autoFocus />
              </div>
              <Command.List className="max-h-64 overflow-y-auto overscroll-contain py-1">
                <Command.Empty className="px-3 py-5 text-center text-sm text-muted">No movement found.</Command.Empty>
                <Command.Group
                  heading="No movement"
                  className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:tracking-[.1em] [&_[cmdk-group-heading]]:text-muted [&_[cmdk-group-heading]]:uppercase"
                >
                  <Command.Item className="flex min-h-10 cursor-pointer items-center justify-between rounded-lg px-3 text-sm text-ink outline-none data-[selected=true]:bg-[#f3f0e8]" value="No movement today" onSelect={() => selectMovement("")}>
                    No movement today
                    {!value && <Check size={16} />}
                  </Command.Item>
                </Command.Group>
                {movementGroups.map((group) => (
                  <Command.Group
                    heading={group.label}
                    className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:tracking-[.1em] [&_[cmdk-group-heading]]:text-muted [&_[cmdk-group-heading]]:uppercase"
                    key={group.label}
                  >
                    {group.options.map((option) => (
                      <Command.Item className="flex min-h-10 cursor-pointer items-center justify-between rounded-lg px-3 text-sm text-ink outline-none data-[selected=true]:bg-[#f3f0e8]" value={option} onSelect={() => selectMovement(option)} key={option}>
                        {option}
                        {value === option && <Check size={16} />}
                      </Command.Item>
                    ))}
                  </Command.Group>
                ))}
              </Command.List>
            </Command>
            <Popover.Arrow className="fill-panel" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
