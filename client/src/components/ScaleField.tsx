import * as Slider from "@radix-ui/react-slider";
import { useEffect, useState } from "react";

type ScaleFieldProps = {
  label: string;
  hint: string;
  value: number;
  low: string;
  high: string;
  onChange(value: number): void;
};

const values = [1, 2, 3, 4, 5];

export function ScaleField({ label, hint, value, low, high, onChange }: ScaleFieldProps) {
  const [sliderValue, setSliderValue] = useState(value);
  const selectedValue = Math.round(sliderValue);

  useEffect(() => setSliderValue(value), [value]);

  const commitValue = (nextValue: number) => {
    const roundedValue = Math.round(nextValue);
    setSliderValue(roundedValue);
    onChange(roundedValue);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>) => {
    const increments: Record<string, number> = {
      ArrowDown: -1,
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: 1,
    };

    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      commitValue(event.key === "Home" ? 1 : 5);
      return;
    }

    const increment = increments[event.key];
    if (!increment) return;

    event.preventDefault();
    commitValue(Math.min(5, Math.max(1, selectedValue + increment)));
  };

  return (
    <fieldset className="m-0 min-w-0 rounded-2xl border border-line bg-white/45 p-5">
      <div>
        <legend className="text-[15px] font-bold text-ink">{label}</legend>
        <p className="mt-1 mb-0 text-[13px] leading-5 text-muted">{hint}</p>
      </div>

      <Slider.Root className="relative mt-4 flex h-14 w-full touch-none items-center select-none" min={1} max={5} step={0.05} value={[sliderValue]} onValueChange={([nextValue]) => setSliderValue(nextValue)} onValueCommit={([nextValue]) => commitValue(nextValue)}>
        <Slider.Track className="relative h-11 grow overflow-hidden rounded-full border border-[#d2d4d1] bg-[#e4e5e3]">
          <Slider.Range className="absolute h-full rounded-full bg-accent" />
          <span className="pointer-events-none absolute inset-x-6 top-1/2 z-10 flex -translate-y-1/2 justify-between">
            {values.map((option) => (
              <span className={`h-2 w-2 rounded-full ${option <= sliderValue ? "bg-white/55" : "bg-[#aeb2af]"}`} key={option} />
            ))}
          </span>
        </Slider.Track>
        <Slider.Thumb
          className="relative z-20 block h-13 w-13 cursor-grab rounded-full border
            border-[#d9d9d4] bg-white shadow-[0_2px_9px_rgba(34,57,50,.18)] outline-none
            transition-[transform,box-shadow] duration-150 ease-[cubic-bezier(.23,1,.32,1)]
            focus-visible:shadow-[0_0_0_4px_rgba(255,178,28,.22)] active:scale-[.96]
            active:cursor-grabbing"
          aria-label={label}
          onKeyDown={handleKeyDown}
        />
      </Slider.Root>

      <div className="grid grid-cols-5 px-3 text-center text-xs font-bold text-muted">
        {values.map((option) => (
          <span className={option === selectedValue ? "text-brand" : undefined} key={option}>
            {option}
          </span>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-xs font-medium text-muted">
        <span>{low}</span>
        <span>{high}</span>
      </div>
    </fieldset>
  );
}
