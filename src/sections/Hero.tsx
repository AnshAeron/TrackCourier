import { Globe, Package, Truck, Zap, Clock, MapPin } from "lucide-react";
import TrackForm from "../components/TrackForm";
import heroImg from "../assets/hero.png";

const stats = [
  { icon: MapPin, color: "text-brand-blue", bg: "bg-blue-50", value: "500+", label: "Service Locations", sub: "Across India & Worldwide" },
  { icon: Globe, color: "text-emerald-600", bg: "bg-emerald-50", value: "120+", label: "Countries Served", sub: "Worldwide Coverage" },
  { icon: Package, color: "text-amber-500", bg: "bg-amber-50", value: "50K+", label: "Shipments Delivered", sub: "Successfully Delivered" },
  { icon: Clock, color: "text-violet-600", bg: "bg-violet-50", value: "24×7", label: "Tracking Available", sub: "Real-time Updates" },
];

const pills = [
  { icon: Truck, label: ["Domestic", "Courier"] },
  { icon: Globe, label: ["International", "Courier"] },
  { icon: Zap, label: ["Express", "Delivery"] },
  { icon: Clock, label: ["Live", "Tracking"] },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-8 lg:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-100/70 px-4 py-2 text-sm font-semibold text-brand-blue">
              <Globe className="h-4 w-4" />
              Delivering Across India &amp; Worldwide
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              Reliable Domestic &amp;{" "}
              <span className="text-brand-blue">International</span> Courier Services
            </h1>
            <p className="mt-5 max-w-xl text-lg text-slate-500">
              Fast, secure and affordable courier solutions for documents, parcels
              and commercial shipments. Track your courier anytime with real-time
              updates.
            </p>

            <div className="mt-8 rounded-2xl bg-white p-6 shadow-card">
              <div className="mb-4 flex items-center gap-2">
                <Package className="h-6 w-6 text-brand-blue" />
                <h2 className="text-xl font-bold text-slate-900">Track Your Shipment</h2>
              </div>
              <TrackForm />
              <p className="mt-2 text-sm text-slate-400">Enter your 9–20 digit tracking number</p>
              <div className="mt-4 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-4">
                {pills.map((p) => (
                  <div key={p.label.join(" ")} className="flex items-center gap-2">
                    <p.icon className="h-5 w-5 shrink-0 text-brand-blue" />
                    <span className="text-sm font-semibold leading-tight text-slate-700">
                      {p.label[0]}
                      <br />
                      {p.label[1]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <img
              src={heroImg}
              alt="TrackMyCourier delivery truck with global shipping network"
              className="w-full drop-shadow-xl"
            />
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 rounded-2xl bg-white p-6 shadow-card md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex items-center gap-3 md:justify-center">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${s.bg}`}>
                <s.icon className={`h-6 w-6 ${s.color}`} />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-slate-900">{s.value}</div>
                <div className="text-sm font-semibold text-slate-700">{s.label}</div>
                <div className="text-xs text-slate-400">{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

