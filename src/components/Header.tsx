import { useNavigate } from "react-router-dom";
import { MapPin, ArrowRight } from "lucide-react";
import Logo from "./Logo";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          <Logo className="text-2xl sm:text-3xl" />
          <button
            onClick={() => navigate("/track")}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-blue px-4 sm:px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-blue-700"
          >
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">Track My Courier</span>
            <span className="sm:hidden">Track</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
