const carrierLogos: Record<string, string> = {
  SkyNet: "/logos/skynet.png",
  FedEx: "/logos/fedex.png",
  DTDC: "/logos/dtdc.png",
  BlueDart: "/logos/bluedart.png",
  Delhivery: "/logos/delhivery.png",
  ABCStar: "/logos/abcstar.png",
};

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  User,
  MapPin,
  Truck,
  Package,
  Copy,
  Check,
  Clock,
  ChevronUp,
  ExternalLink,
  Phone,
  Barcode,
  CreditCard,
  ListChecks,
  Calendar,
  Boxes,
  Coins,
} from "lucide-react";
import type { ReactNode } from "react";
import TrackForm from "../components/TrackForm";
import { getShipment } from "../services/tracking.service";

import { useRef } from "react";

export default function Tracking() {
  const [params] = useSearchParams();
  const id = params.get("id") || "";
  console.log("URL ID:", id);
  const [shipment, setShipment] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  
  const redirected = useRef(false);
  useEffect(() => {
    if (!id) return;
    const fetchShipment = async () => {
      try {
        const data = await getShipment(id);

        console.log("Shipment Response:", data);
        
        
if (
  data.booking?.redirectOnly &&
  data.booking?.trackingUrl &&
  !redirected.current
) {
  redirected.current = true;
  window.open(data.booking.trackingUrl, "_blank", "noopener,noreferrer");
  return;
}
        setShipment(data.booking);
      } catch (err) {
        console.error("API Error:", err);
      }
    };

    fetchShipment();
  }, [id]);

 const hasShipment = shipment !== null;

  function copyId() {
    if (!shipment) return;
    navigator.clipboard.writeText(shipment.trackingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const summary = hasShipment? [
    { icon: User, label: "Consignor", value: shipment?.consignor },
    { icon: User, label: "Consignee", value: shipment?.consignee },
    { icon: MapPin, label: "Destination", value: shipment?.destination },
  ]:[];

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-5">
      {/* Track another shipment */}
      <div className="rounded-2xl bg-blue-50/60 p-5 shadow-soft">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Package className="h-6 w-6 text-brand-blue" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">
                Track Another Shipment
              </h2>
              <p className="text-sm text-slate-500">
                Enter your Tracking ID / AWB Number
              </p>
            </div>
          </div>
          <div className="md:w-[55%]">
            <TrackForm compact />
          </div>
        </div>
      </div>
      {hasShipment && (
        <>
          {/* Summary row */}
          <div className="rounded-2xl bg-white p-5 shadow-card">
            <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
              {summary.map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <s.icon className="h-6 w-6 text-brand-blue" />
                  <div>
                    <div className="text-xs text-slate-400">{s.label}</div>
                    <div className="font-bold text-slate-900">{s.value}</div>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-3">
                <Truck className="h-6 w-6 text-brand-blue" />
                <div>
                  <div className="text-xs text-slate-400">Status</div>
                  <span className="mt-0.5 inline-block rounded-md bg-emerald-100 px-2 py-0.5 text-sm font-bold text-emerald-700">
                    {shipment.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Carrier + progress */}
          <div className="rounded-2xl bg-white p-6 shadow-card">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={carrierLogos[shipment.carrier]}
                  alt={shipment.carrier}
                  className="h-10 w-auto object-contain"
                />
                <div>
                  <div className="font-bold text-slate-900">
                    {shipment.carrier}
                  </div>
                  <div className="text-sm text-slate-400">
                    {shipment.service}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-400">Tracking ID</div>
                <div className="inline-flex items-center gap-2">
                  <a
                    href={shipment.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-brand-blue hover:underline"
                  >
                    {shipment.trackingId}
                  </a>

                  <button onClick={copyId}>
                    {copied ? (
                      <Check className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <Copy className="h-4 w-4 text-brand-blue" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <Stepper
              deliveredAt={shipment.deliveredAt}
              confirmedAt={shipment.confirmedAt}
              inTransitAt={shipment.inTransitAt}
            />
          </div>

          {/* Travel history */}
          <Panel title="Travel History" icon={Clock}>
            <ol className="relative space-y-6">
              {shipment.travelHistory.map((e, i) => {
                const isLast = i === shipment.travelHistory.length - 1;
                const dot =
                  e.state === "current"
                    ? "bg-emerald-500"
                    : e.state === "done"
                      ? "bg-brand-blue"
                      : "bg-slate-300";
                return (
                  <li
                    key={i}
                    className="relative grid grid-cols-[110px_1fr] gap-4 pl-6"
                  >
                    {!isLast && (
                      <span className="absolute left-[7px] top-4 h-full w-0.5 bg-slate-200" />
                    )}
                    <span
                      className={`absolute left-0 top-1 h-3.5 w-3.5 rounded-full ring-4 ring-white ${dot}`}
                    />
                    <div className="text-sm">
                      <div className="font-semibold text-slate-700">
                        {e.date}
                      </div>
                      <div className="text-slate-400">{e.time}</div>
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{e.title}</div>
                      <div className="flex items-center gap-1 text-sm text-slate-500">
                        {e.location}
                        {e.hasLink && (
                          <ExternalLink className="h-3.5 w-3.5 text-brand-blue" />
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </Panel>

          {/* Delivery address */}
          <Panel title="Delivery Address" icon={MapPin}>
            <div className="rounded-lg bg-slate-50 px-4 py-3 text-sm">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
                <span className="text-slate-500">
                  🏳️ Origin:{" "}
                  <span className="font-semibold text-slate-800">
                    🇮🇳 {shipment.originCountry}
                  </span>
                </span>
                <span className="hidden sm:inline text-slate-300">|</span>
                <span className="text-slate-500">
                  🏳️ Destination:{" "}
                  <span className="font-semibold text-slate-800">
                    🇳🇿 {shipment.destinationCountry}
                  </span>
                </span>
              </div>
            </div>

            <div className="mt-4 grid gap-6 sm:grid-cols-2">
              <div>
                <div className="flex items-center gap-1 text-sm text-slate-400">
                  <User className="h-4 w-4" /> Sender
                </div>
                <div className="mt-1 font-bold text-slate-900">
                  {shipment.sender.name}
                </div>
                <div className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                  <Phone className="h-4 w-4" /> {shipment.sender.phone}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-sm text-slate-400">
                  <User className="h-4 w-4" /> Receiver
                </div>
                <div className="mt-1 font-bold text-slate-900">
                  {shipment.receiver.name}
                </div>
                <div className="mt-1 text-sm text-slate-500">
                  {shipment.receiver.address.map((l) => (
                    <div key={l}>{l}</div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative mt-4 overflow-hidden rounded-lg">
              <iframe
                title="Delivery location"
                src={`https://www.google.com/maps?q=${encodeURIComponent(shipment.mapQuery)}&output=embed`}
                className="h-56 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                href={`https://www.google.com/maps?q=${encodeURIComponent(shipment.mapQuery)}`}
                target="_blank"
                rel="noreferrer"
                className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-brand-blue shadow-soft"
              >
                Open in Maps <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </Panel>

          {/* Shipment details */}
          <Panel title="Shipment Details" icon={Package}>
            <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
              <div className="space-y-4">
                <Detail
                  icon={Barcode}
                  label="AWB Number"
                  value={shipment.awbNumber}
                  color="text-brand-blue"
                />
                <Detail
                  icon={Truck}
                  label="Service Type"
                  value={shipment.details.serviceType}
                  color="text-brand-red"
                />
                <Detail
                  icon={CreditCard}
                  label="Payment Type"
                  value={shipment.details.paymentType}
                  color="text-brand-blue"
                />
                <Detail
                  icon={ListChecks}
                  label="Contents"
                  value={shipment.details.contents}
                  color="text-violet-600"
                />
                <Detail
                  icon={Calendar}
                  label="Pickup Date"
                  value={shipment.details.pickupDate}
                  color="text-brand-blue"
                />
              </div>
              <div className="space-y-4">
                <Detail
                  icon={Boxes}
                  label="Total Pieces"
                  value={String(shipment.details.totalPieces)}
                  color="text-amber-500"
                />
                <Detail
                  icon={Coins}
                  label="Declared Value"
                  value={shipment.details.declaredValue}
                  color="text-emerald-600"
                />
              </div>
            </div>
          </Panel>
        </>
      )}
    </div>
  );
}

function Stepper({
  confirmedAt,
  inTransitAt,
  deliveredAt,
}: {
  confirmedAt: string;
  inTransitAt: string;
  deliveredAt: string;
}) {
  return (
    <div className="mt-8">
      <div className="relative flex items-start justify-between">
        <span className="absolute left-0 right-0 top-5 h-1 -translate-y-1/2 bg-slate-200" />
        <span className="absolute left-0 top-5 h-1 w-1/2 -translate-y-1/2 bg-gradient-to-r from-emerald-500 to-brand-blue" />

        <Step
          state="done"
          label="Confirmed"
          time={confirmedAt}
          icon={Package}
        />
        <Step
          state="current"
          label="In Transit"
          time={inTransitAt}
          icon={Truck}
        />
        <Step
          state="pending"
          label="Delivered"
          time={deliveredAt}
          icon={Check}
        />
      </div>
    </div>
  );
}

function Step({
  state,
  label,
  time,
  icon: Icon,
}: {
  state: "done" | "current" | "pending";
  label: string;
  time: string;
  icon: typeof Package;
}) {
  const styles =
    state === "done"
      ? "bg-emerald-500 text-white ring-emerald-100"
      : state === "current"
        ? "bg-brand-blue text-white ring-blue-100"
        : "bg-slate-300 text-white ring-slate-100";
  const labelColor = state === "current" ? "text-brand-blue" : "text-slate-700";
  return (
    <div className="relative z-10 flex w-24 flex-col items-center text-center">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full ring-4 ${styles}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className={`mt-2 text-sm font-bold ${labelColor}`}>{label}</div>
      <div className="text-xs text-slate-400">{time}</div>
    </div>
  );
}

function Panel({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof Package;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-card">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-brand-blue" />
          <h3 className="font-bold text-slate-900">{title}</h3>
        </div>
        <ChevronUp className="h-5 w-5 text-slate-400" />
      </div>
      {children}
    </div>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Package;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="grid grid-cols-[150px_1fr] items-start gap-2">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
        <Icon className={`h-4 w-4 ${color}`} />
        {label}
      </div>
      <div className="text-sm text-slate-700">{value}</div>
    </div>
  );
}

