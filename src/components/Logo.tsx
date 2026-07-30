import { Link } from "react-router-dom";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`inline-flex items-baseline font-extrabold tracking-tight ${className}`}>
      <span className="text-slate-900">Track</span>
      <span className="text-brand-red">My</span>
      <span className="text-slate-900">Courier</span>
      <span className="text-slate-500 text-[0.6em] font-bold ml-0.5">.in</span>
    </Link>
  );
}
