import React, { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export interface CustomDropdownOption {
  value: string;
  label: string;
}

interface Props {
  options: CustomDropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  colorScheme?: "emerald" | string;
  disabled?: boolean;
}

const CustomDropdown: React.FC<Props> = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className={`flex w-full items-center justify-between rounded-lg border bg-white px-3 py-2 text-left text-sm outline-none transition-colors duration-150 ${
          open
            ? "border-emerald-500 ring-2 ring-emerald-100"
            : "border-emerald-300 hover:border-emerald-500"
        } ${
          disabled
            ? "cursor-not-allowed bg-slate-100 opacity-60"
            : "cursor-pointer"
        }`}
      >
        <span
          className={
            selected
              ? "font-medium text-slate-700"
              : "font-normal text-slate-400"
          }
        >
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-emerald-700 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && !disabled && (
        <div className="absolute z-[100] mt-1 w-full overflow-hidden rounded-lg border border-emerald-400 bg-white shadow-xl">
          <div className="max-h-60 overflow-y-auto p-1">
            {options.length === 0 ? (
              <div className="px-3 py-2 text-xs text-slate-400">
                No options available
              </div>
            ) : (
              options.map((option) => {
                const isSelected = option.value === value;

                return (
                  <button
                    type="button"
                    key={option.value}
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors ${
                      isSelected
                        ? "bg-emerald-100 font-semibold text-emerald-800"
                        : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
                    }`}
                  >
                    <span>{option.label}</span>
                    {isSelected && (
                      <Check className="h-4 w-4 shrink-0 text-emerald-600" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
