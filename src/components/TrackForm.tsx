import { type FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScanLine, ArrowRight } from "lucide-react";


type Props = {
  compact?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  loading?: boolean;
};

export default function TrackForm({
  compact = false,
  value: externalValue,
  onChange,
  loading = false,
}: Props) {
  const [value, setValue] = useState(externalValue || "");

  const navigate = useNavigate();

  useEffect(() => {
    if (externalValue !== undefined) {
      setValue(externalValue);
    }
  }, [externalValue]);
  
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
    onChange?.(e.target.value);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();

    const trackingId = value.trim();

    if (!trackingId) return;

    const url = `/track?id=${encodeURIComponent(trackingId)}`;

    // Agar same page par same tracking ID hai,
    // to page reload kar do taaki API dubara call ho.
    if (window.location.pathname + window.location.search === url) {
      window.location.reload();
      return;
    }
    navigate(url);
  }
console.log("External Value:", externalValue);
console.log("Input Value:", value);
console.log("TrackForm value =", value);
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <input
          value={value}
          onChange={handleChange}
          placeholder="Enter Tracking / AWB Number"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 pr-11 text-slate-700 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-blue-100"
        />

        {!compact && (
          <ScanLine className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-blue px-6 py-3.5 font-semibold text-white shadow-soft transition hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? "Loading..." : "Track My Courier"}
        {!loading && <ArrowRight className="h-4 w-4" />}
      </button>
    </form>
  );
}
