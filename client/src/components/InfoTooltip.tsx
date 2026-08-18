import * as Tooltip from "@radix-ui/react-tooltip";
import { LuInfo as Info } from "react-icons/lu";
import type { ReactNode } from "react";

export function TooltipProvider({ children }: { children: ReactNode }) {
  return (
    <Tooltip.Provider delayDuration={350} skipDelayDuration={100}>
      {children}
    </Tooltip.Provider>
  );
}

export function InfoTooltip({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <button className="grid h-6 w-6 cursor-help place-items-center rounded-full border-0 bg-transparent text-muted outline-none hover:bg-[#eeece6] focus-visible:bg-[#fff1c6] focus-visible:text-brand" type="button" aria-label={label}>
          <Info size={14} />
        </button>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          className="z-200 max-w-60 rounded-[10px] bg-brand-dark px-3 py-2 text-xs leading-5 text-white shadow-[0_10px_28px_rgba(24,43,38,.22)] outline-none [transform-origin:var(--radix-tooltip-content-transform-origin)] data-[state=delayed-open]:animate-[popover-in_150ms_cubic-bezier(.23,1,.32,1)]"
          sideOffset={7}
        >
          {children}
          <Tooltip.Arrow className="fill-brand-dark" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
