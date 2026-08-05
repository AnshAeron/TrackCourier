import { Package, Truck, Plane, ArrowRight } from "lucide-react";

const services = [
  {
    icon: Package,
    title: "Standard Courier",
    accent: "text-brand-blue",
    ring: "bg-blue-50",
    bar: "bg-brand-blue",
    desc: "This service involves transferring the parcels to the closest depot to the delivery location.",
  },
  {
    icon: Truck,
    title: "Express Courier",
    accent: "text-emerald-600",
    ring: "bg-emerald-50",
    bar: "bg-emerald-500",
    desc: "This is a service provided to those who need urgent delivery to be sent and received on the same day.",
  },
  {
    icon: Plane,
    title: "International Courier",
    accent: "text-violet-600",
    ring: "bg-violet-50",
    bar: "bg-violet-500",
    desc: "This is a transport service of goods or documents from one country to another country.",
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-bold uppercase tracking-wide text-brand-blue">
            <Package className="h-4 w-4" />
            Services
          </span>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            We Provide Various Category
            <br className="hidden sm:block" /> Delivery Services
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-500">
            Choose from a range of reliable delivery solutions designed to meet
            your personal and business shipping needs.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {services.map((s) => (
            <div
              key={s.title}
              className="group relative overflow-hidden rounded-2xl bg-white p-8 text-center shadow-card transition hover:-translate-y-1"
            >
              <div className={`absolute inset-x-0 bottom-0 h-1 ${s.bar}`} />
              <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${s.ring}`}>
                <s.icon className={`h-9 w-9 ${s.accent}`} strokeWidth={1.6} />
              </div>
              <h3 className="mt-6 text-xl font-bold text-slate-900">{s.title}</h3>
              <div className={`mx-auto mt-3 h-0.5 w-10 ${s.bar}`} />
              <p className="mt-5 text-slate-500">{s.desc}</p>
              {/* <button className={`mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide ${s.accent}`}>
                Read More
                <span className={`flex h-7 w-7 items-center justify-center rounded-full border ${s.accent} border-current`}>
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </button> */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
