import { Users, ShieldCheck, Truck, Globe, ArrowRight, MapPin } from "lucide-react";
import warehouseImg from "../assets/warehouse.png";

const features = [
  {
    icon: ShieldCheck,
    title: "Safe & Secure Handling",
    desc: "Your parcels are handled with utmost care and security.",
  },
  {
    icon: Truck,
    title: "Doorstep Pickup & Delivery",
    desc: "Convenient pickup and delivery at your doorstep.",
  },
  {
    icon: Globe,
    title: "Domestic & International Network",
    desc: "Extensive network to deliver across India and worldwide.",
  },
];

const partners = [
  { name: "DHL Express", node: <span className="rounded bg-[#ffcc00] px-3 py-1 text-xl font-extrabold italic text-[#d40511]">DHL</span> },
  { name: "FedEx Express", node: <span className="text-2xl font-extrabold italic"><span className="text-[#4d148c]">Fed</span><span className="text-[#ff6600]">Ex</span></span> },
  { name: "SkyNet Worldwide", node: <span className="text-xl font-extrabold italic text-[#e2231a]">SKYNET</span> },
  { name: "UPS", node: <span className="rounded bg-[#351c15] px-3 py-1 text-xl font-extrabold italic text-[#ffb500]">UPS</span> },
];

export default function About() {
  return (
    <section id="about" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-bold uppercase tracking-wide text-brand-blue">
              <Users className="h-4 w-4" />
              About Us
            </span>
            <h2 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">
              Leading Courier Service Provider in{" "}
              <span className="text-brand-blue">Rupnagar, Punjab</span>
            </h2>
            <div className="mt-4 h-1 w-16 rounded bg-brand-blue" />
            <p className="mt-6 text-slate-500">
              We are a trusted name in the courier and logistics industry, proudly
              serving customers in Rupnagar and beyond. Our commitment is to
              deliver every shipment with speed, safety and reliability.
            </p>
            <p className="mt-4 text-slate-500">
              With advanced tracking technology, a dedicated team and a strong
              network of partners, we ensure your parcels reach their destination —
              on time, every time.
            </p>

            <div className="mt-8 space-y-5">
              {features.map((f) => (
                <div key={f.title} className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50">
                    <f.icon className="h-6 w-6 text-brand-blue" />
                  </div>
                  <div className="border-l border-slate-100 pl-4">
                    <h3 className="font-bold text-slate-900">{f.title}</h3>
                    <p className="text-slate-500">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-8 inline-flex items-center gap-2 rounded-lg bg-brand-blue px-6 py-3 font-semibold text-white shadow-soft transition hover:bg-blue-700">
              Learn More About Us
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </button>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-3xl shadow-card">
              <img
                src={warehouseImg}
                alt="Track My Courier warehouse with delivery trucks and parcels"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 left-6 right-6 rounded-2xl bg-white p-5 shadow-card sm:left-auto sm:right-6 sm:w-64">
              <div className="flex items-center gap-2 text-slate-500">
                <MapPin className="h-5 w-5 text-brand-blue" />
                <span className="text-sm">Proudly Serving</span>
              </div>
              <div className="mt-1 text-xl font-extrabold text-brand-blue">Rupnagar, Punjab</div>
              <div className="mt-2 h-0.5 w-10 bg-brand-blue" />
              <div className="mt-2 font-bold text-slate-900">Since 2020</div>
            </div>
          </div>
        </div>

        <div className="mt-20 rounded-2xl bg-white p-8 shadow-card">
          <div className="mb-6 flex items-center justify-center gap-4">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
              Our Global Partners
            </span>
          </div>
          <div className="grid grid-cols-2 items-center gap-6 sm:grid-cols-4 sm:divide-x sm:divide-slate-100">
            {partners.map((p) => (
              <div key={p.name} className="flex flex-col items-center gap-3 px-4 text-center">
                <div className="flex h-12 items-center">{p.node}</div>
                <span className="text-sm font-medium text-slate-600">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
