const carrierLogos: Record<string, string> = {
  SkyNet: "/logos/skynet.png",
  FedEx: "/logos/fedex.png",
  DTDC: "/logos/dtdc.png",
  BlueDart: "/logos/bluedart.png",
  Delhivery: "/logos/delhivery.png",
  ABCStar: "/logos/abcstar.png",
  M5C: "/logos/m5c.png",
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
  ListChecks,
  Calendar,
  Boxes,
} from "lucide-react";
import type { ReactNode } from "react";
import TrackForm from "../components/TrackForm";
import { getShipment } from "../services/tracking.service";

import { useRef } from "react";

export default function Tracking() {
  const [loading, setLoading] = useState(false);

  const [params] = useSearchParams();
  const id = params.get("id") || "";
  const [trackingNumber, setTrackingNumber] = useState(id);

  useEffect(() => {
    setTrackingNumber(id);
  }, [id]);

  console.log("URL ID:", id);
  console.log("trackingNumber =", trackingNumber);
  const [shipment, setShipment] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const [error, setError] = useState("");

  const redirected = useRef(false);
  useEffect(() => {
    if (!id) return;

    redirected.current = false;
    const fetchShipment = async () => {
      setLoading(true);

      try {
        const data = await getShipment(id);
        setError("");
        console.log("Shipment Response:", data);

        // Invalid tracking number
        if (!data || !data.booking) {
          setShipment(null);
          setError("Invalid Tracking / AWB Number");
          return;
        }

        // Redirect providers (FedEx, DHL, etc.)
        if (
          data.booking?.redirectOnly &&
          data.booking?.trackingUrl &&
          !redirected.current
        ) {
          redirected.current = true;

          // Pehle page par shipment dikhao
          setShipment(data.booking);

          // Fir external tracking kholo
          setTimeout(() => {
            window.open(
              data.booking.trackingUrl,
              "_blank",
              "noopener,noreferrer",
            );
          }, 300);
        } else {
          setShipment(data.booking);
        }
      } catch (err) {
        console.error("API Error:", err);

        setShipment(null);
        setError("Invalid Tracking / AWB Number");
      } finally {
        setLoading(false);
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

  const summary = hasShipment
    ? [
        {
          icon: User,
          label: "Consignor",
          value: shipment?.sender?.name || shipment?.consignor || "-",
        },
        {
          icon: User,
          label: "Consignee",
          value: shipment?.receiver?.name || shipment?.consignee || "-",
        },
        { icon: MapPin, label: "Destination", value: shipment?.destination },
      ]
    : [];
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
              <h2 className="font-bold text-slate-900">Track Courier</h2>
              <p className="text-sm text-slate-500">
                Enter your Airway Bill Number
              </p>
            </div>
          </div>
          <div className="md:w-[55%]">
            <div>
              <TrackForm
                compact
                value={trackingNumber}
                onChange={setTrackingNumber}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </div>
      {error && !hasShipment && !loading && (
        <div className="rounded-2xl bg-white p-8 shadow-card text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <Package className="h-8 w-8 text-red-500" />
          </div>

          <h2 className="mt-4 text-xl font-bold text-slate-900">
            Invalid Tracking / AWB Number
          </h2>
        </div>
      )}
      {hasShipment && !shipment.redirectOnly && (
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
                  <div className="text-sm text-slate-400">
                    {shipment.service}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-400">
                  Partner Tracking Id
                </div>
                <div className="inline-flex items-center gap-2">
                  <a
                    href={shipment.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-brand-blue hover:underline"
                  >
                    {shipment.apiFailed ||
                    shipment.trackingId === "AWB number not found"
                      ? "Shipment Data Prepared"
                      : shipment.trackingId}
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
              status={shipment.status}
            />
          </div>

          {/* Travel history */}
          <Panel title="Shipment History" icon={Clock}>
            <ol className="relative space-y-6">
              {shipment.travelHistory.map((e, i) => {
                const currentIndex =
                  shipment.travelHistory.findIndex(
                    (e: any) => e.state === "current",
                  ) === -1
                    ? shipment.travelHistory.length - 1
                    : shipment.travelHistory.findIndex(
                        (e: any) => e.state === "current",
                      );
                const isLast = i === shipment.travelHistory.length - 1;
                const dot =
                  i <= currentIndex ? "bg-emerald-500" : "bg-slate-300";
                return (
                  <li
                    key={i}
                    className="relative grid grid-cols-[110px_1fr] gap-4 pl-6"
                  >
                    {!isLast && (
                      <>
                        <span className="absolute left-[7px] top-4 h-full w-0.5 bg-slate-200" />
                        {i < currentIndex && (
                          <span className="absolute left-[7px] top-4 h-full w-0.5 bg-emerald-500" />
                        )}
                      </>
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

          {/* Delivery Address */}
          <Panel title="Delivery Address" icon={MapPin}>
            <div className="rounded-lg bg-slate-50 px-4 py-3 text-sm">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <span className="text-slate-500">
                  Origin:{" "}
                  <span className="font-semibold text-slate-800">
                    {shipment.originCountry || "-"}
                  </span>
                </span>

                <span className="hidden sm:inline text-slate-300">|</span>

                <span className="text-slate-500">
                  Destination:{" "}
                  <span className="font-semibold text-slate-800">
                    {shipment.destinationCountry || "-"}
                  </span>
                </span>
              </div>
            </div>

            <div className="mt-5 grid gap-6 sm:grid-cols-2">
              {/* Sender */}
              <div className="rounded-lg border border-slate-100 p-4">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <User className="h-4 w-4" />
                  Sender
                </div>

                <div className="mt-2 font-bold text-slate-900">
                  {shipment?.sender?.name || shipment?.consignor || "-"}
                </div>

                <div className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                  <Phone className="h-4 w-4" />
                  {shipment.sender?.phone
                    ? maskPhone(shipment.sender.phone)
                    : "-"}
                </div>
              </div>

              {/* Receiver */}
              <div className="rounded-lg border border-slate-100 p-4">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <User className="h-4 w-4" />
                  Receiver
                </div>

                <div className="mt-2 font-bold text-slate-900">
                  {shipment?.receiver?.name || shipment?.consignee || "-"}
                </div>

                <div className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                  <Phone className="h-4 w-4" />
                  {shipment.receiver?.phone
                    ? maskPhone(shipment.receiver.phone)
                    : "-"}
                </div>
              </div>
            </div>
          </Panel>

          {/* Shipment Details */}
          <Panel title="Shipment Details" icon={Package}>
            <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
              <Detail
                icon={Barcode}
                label="AWB Number"
                value={shipment.awbNumber || shipment.consignmentA || "-"}
                color="text-brand-blue"
              />

              <Detail
                icon={Calendar}
                label="Booking Date"
                value={shipment.bookingDate || "-"}
                color="text-brand-blue"
              />

              <Detail
                icon={ListChecks}
                label="Contents"
                value={shipment.contents || "-"}
                color="text-violet-600"
              />

              <Detail
                icon={Boxes}
                label="Pieces"
                value={
                  shipment.pieces !== undefined && shipment.pieces !== null
                    ? String(shipment.pieces)
                    : "-"
                }
                color="text-amber-500"
              />

              <Detail
                icon={Package}
                label="Weight"
                value={
                  shipment.weight !== undefined && shipment.weight !== null
                    ? `${shipment.weight}`
                    : "-"
                }
                color="text-emerald-600"
              />
            </div>
          </Panel>
        </>
      )}
    </div>
  );
}
function maskPhone(phone: string) {
  if (!phone) return "-";

  if (phone.length <= 4) {
    return "*".repeat(phone.length);
  }

  return `${phone.slice(0, 2)}${"*".repeat(
    phone.length - 4,
  )}${phone.slice(-2)}`;
}

function Stepper({
  confirmedAt,
  inTransitAt,
  deliveredAt,
  status,
}: {
  confirmedAt: string;
  inTransitAt: string;
  deliveredAt: string;
  status: string;
}) {
  const isDelivered = status?.toUpperCase() === "DELIVERED";
  return (
    <div className="mt-8">
      <div className="relative flex items-start justify-between">
        <span
          className={`absolute left-0 top-5 h-1 -translate-y-1/2 bg-gradient-to-r from-emerald-500 to-brand-blue ${
            isDelivered ? "w-full" : "w-1/2"
          }`}
        />
        <span
          className={`absolute left-0 top-5 h-1 -translate-y-1/2 ${
            isDelivered
              ? "w-full bg-emerald-500"
              : "w-1/2 bg-gradient-to-r from-emerald-500 to-brand-blue"
          }`}
        />

        <Step
          state="done"
          label="Confirmed"
          time={confirmedAt}
          icon={Package}
        />
        <Step
          state={isDelivered ? "done" : "current"}
          label="In Transit"
          time={isDelivered ? "" : inTransitAt}
          icon={Truck}
        />
        <Step
          state={isDelivered ? "done" : "pending"}
          label="Delivered"
          time={isDelivered ? deliveredAt?.substring(0, 10) : ""}
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
