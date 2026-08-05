import { MapPin, Building2, Clock } from "lucide-react";

const branches = [
  {
    name: "Kurali Branch",
    color: "text-brand-blue",
    pin: "text-brand-blue",
    hours: "bg-blue-50 text-brand-blue",
    address: ["Ropar Rd, opposite punjab national bank, Ward No.5, Ward No. 6, Kurali, Punjab 140103"],
  },
  {
    name: "Ludhiana Branch",
    color: "text-emerald-600",
    pin: "text-emerald-600",
    hours: "bg-emerald-50 text-emerald-600",
    address: ["Opening Soon"],
  },
  {
    name: "Kharar Branch",
    color: "text-amber-500",
    pin: "text-amber-500",
    hours: "bg-amber-50 text-amber-600",
    address: ["Opening Soon"],
  },
];

export default function LocateUs() {
  const mapSrc =
    "https://www.google.com/maps?q=Anuj Communication, 2837, Mata Rani Rd, Gugga Mari Mohalla, Rupnagar, Punjab 140001&output=embed";

  return (
    <section id="locate" className="bg-gradient-to-b from-white to-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-bold uppercase tracking-wide text-brand-blue">
              <MapPin className="h-4 w-4" />
              Locate Us
            </span>
            <h2 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">
              We Are Here
              <br /> to Serve You Better
            </h2>
            <div className="mt-4 h-1 w-16 rounded bg-brand-blue" />
            <p className="mt-6 max-w-md text-slate-500">
              Track My Courier is proudly based in Rupnagar, Punjab and serves
              customers across India &amp; worldwide with fast, secure and reliable
              courier solutions.
            </p>

            <div className="mt-8 overflow-hidden rounded-2xl bg-brand-navy text-white shadow-card">
              <div className="flex items-start gap-4 p-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white">
                  <Building2 className="h-7 w-7 text-brand-blue" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-blue-200">
                    Main Office
                  </p>
                  <p className="text-xl font-bold">Anuj Communication</p>
                  <p className="mt-2 flex items-start gap-1 text-blue-100">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                    2837, Mata Rani Rd, Gugga Mari Mohalla, Rupnagar, Punjab-140001
                  </p>
                </div>
              </div>
              <div className="mx-6 border-t border-white/10" />
              <div className="flex items-center gap-4 p-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <Clock className="h-7 w-7 text-white" />
                </div>
                <div>
                  <p className="font-semibold">Working Hours</p>
                  <p className="text-blue-100">Mon – Sat: 9:00 AM – 7:00 PM</p>
                  <p className="text-blue-100">Sunday: <span className="font-bold text-white">Closed</span></p>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl shadow-card">
            <iframe
              title="Track My Courier location"
              src={mapSrc}
              className="h-[420px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-card">
          <div className="grid gap-6 lg:grid-cols-4 lg:divide-x lg:divide-slate-100">
            <div className="flex items-start gap-4 border-l-4 border-brand-blue pl-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50">
                <Building2 className="h-6 w-6 text-brand-blue" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Branch Offices</h3>
                <p className="text-sm text-slate-500">Our growing network to serve you better.</p>
              </div>
            </div>
            {branches.map((b) => (
              <div key={b.name} className="lg:pl-6">
                <div className="flex items-center gap-2">
                  <MapPin className={`h-5 w-5 ${b.pin}`} />
                  <h4 className={`font-bold ${b.color}`}>{b.name}</h4>
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  {b.address[0]}
                  <br />
                  {b.address[1]}
                </p>
                <div className={`mt-3 inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold ${b.hours}`}>
                  <Clock className="h-3.5 w-3.5" />
                  Mon – Sat: 9:00 AM – 7:00 PM
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
