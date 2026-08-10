import { MapPin, Building2, Clock, ExternalLink } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";


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
              Track My Courier is proudly based in Rupnagar & Kurali, Punjab and serves
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
                    Rupnagar Office
                  </p>
                  <p className="text-xl font-bold"></p>
                  <p className="mt-2 flex items-start gap-1 text-blue-100">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                    Anuj Communication <br />
                    2837, Mata Rani Rd, Rupnagar, Punjab-140001
                  </p>

                  <a
                    href="https://maps.google.com/?q=Anuj Communication, 2837,+Mata+Rani+Road,+Gugga+Mari+Mohalla,+Rupnagar,+Punjab+140001"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 flex items-center gap-1 text-sm font-medium text-blue-200 hover:text-white hover:underline transition-colors"
                  >
                    View on Map
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href="https://wa.me/919216401935?text=Hello,%20I%20have%20an%20enquiry"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 flex items-center gap-1 text-sm font-medium text-green-300 hover:text-green-200 hover:underline transition-colors"
                  >
                    <FaWhatsapp className="h-4 w-4 text-green-400" />
                    +91 92164 01935
                  </a>
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

            <div className="mt-8 overflow-hidden rounded-2xl bg-brand-navy text-white shadow-card">
              <div className="flex items-start gap-4 p-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white">
                  <Building2 className="h-7 w-7 text-brand-blue" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-blue-200">
                    Kurali Office
                  </p>
                  <p className="text-xl font-bold"></p>
                  <p className="mt-2 flex items-start gap-1 text-blue-100">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                    Surinder Enterprises <br />
                    Ropar Rd, opposite punjab national bank, Ward No.5, Kurali, Punjab 140103
                  </p>

                  <a
                    href="https://maps.google.com/?q=TRACKON+COURIER Ropar Rd, opposite punjab national bank, Ward No.5, Ward No. 6, Kurali, Punjab 140103"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 flex items-center gap-1 text-sm font-medium text-blue-200 hover:text-white hover:underline transition-colors"
                  >
                    View on Map
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href="https://wa.me/919023532827?text=Hello,%20I%20have%20an%20enquiry"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 flex items-center gap-1 text-sm font-medium text-green-300 hover:text-green-200 hover:underline transition-colors"
                  >
                    <FaWhatsapp className="h-4 w-4 text-green-400" />
                    +91 90235 32827
                  </a>
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
            <br />
            <iframe
              title="Track My Courier location"
              src="https://www.google.com/maps?q=TRACKON+COURIER Ropar Rd, opposite punjab national bank, Ward No.5, Ward No. 6, Kurali, Punjab 140103&output=embed"
              className="h-[420px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
