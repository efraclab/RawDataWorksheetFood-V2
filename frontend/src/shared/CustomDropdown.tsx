import React, { useEffect, useRef, useState } from "react";

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

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className="w-full px-3 py-2 text-left text-xs border border-emerald-300 rounded-lg bg-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className={selected ? "text-gray-800" : "text-gray-400"}>
          {selected?.label ?? placeholder}
        </span>
      </button>

      {open && !disabled && (
        <div className="absolute z-[100] mt-1 w-full max-h-60 overflow-y-auto rounded-lg border border-emerald-300 bg-white shadow-xl">
          {options.map((option) => (
            <button
              type="button"
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className="w-full px-3 py-2 text-left text-xs hover:bg-emerald-50"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
