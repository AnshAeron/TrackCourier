export type ShipmentStatus = "Confirmed" | "In Transit" | "Delivered";

export interface TravelEvent {
  date: string;
  time: string;
  title: string;
  location: string;
  hasLink?: boolean;
  state: "done" | "current" | "pending";
}

export interface Shipment {
  trackingId: string;
  awbNumber: string;
  carrier: string;
  service: string;
  consignor: string;
  consignee: string;
  destination: string;
  status: ShipmentStatus;
  confirmedAt: string;
  inTransitAt: string;
  deliveredAt: string;
  originCountry: string;
  destinationCountry: string;
  sender: { name: string; phone: string };
  receiver: { name: string; address: string[] };
  mapQuery: string;
  details: {
    serviceType: string;
    paymentType: string;
    contents: string;
    pickupDate: string;
    totalPieces: number;
    declaredValue: string;
  };
  travelHistory: TravelEvent[];
}

const SAMPLE: Shipment = {
  trackingId: "873782899633",
  awbNumber: "37504177",
  carrier: "FedEx Express®",
  service: "International Priority",
  consignor: "PARAMJIT SINGH",
  consignee: "ATINDERPAL KAUR",
  destination: "New Zealand",
  status: "In Transit",
  confirmedAt: "16 May 2025, 02:30 PM",
  inTransitAt: "18 May 2025, 10:30 AM",
  deliveredAt: "—",
  originCountry: "India",
  destinationCountry: "New Zealand",
  sender: { name: "PARAMJIT SINGH", phone: "(94****2267)" },
  receiver: {
    name: "ATINDERPAL KAUR",
    address: ["17 CRAWSHAW DRIVE", "NAWTON HAMILTON 3200", "New Zealand"],
  },
  mapQuery: "17 Crawshaw Drive, Nawton, Hamilton 3200, New Zealand",
  details: {
    serviceType: "Express International",
    paymentType: "Pre-Paid",
    contents: "Personal items for gift purpose only (Non-Commercial)",
    pickupDate: "2026-06-29",
    totalPieces: 1,
    declaredValue: "₹ 5000 INR",
  },
  travelHistory: [
    {
      date: "18 May 2025",
      time: "10:30 AM",
      title: "At local FedEx facility",
      location: "Auckland, New Zealand",
      state: "current",
    },
    {
      date: "17 May 2025",
      time: "08:45 AM",
      title: "Departed FedEx hub",
      location: "Singapore, Singapore",
      state: "done",
    },
    {
      date: "16 May 2025",
      time: "11:20 PM",
      title: "Arrived at FedEx hub",
      location: "Singapore, Singapore",
      state: "done",
    },
    {
      date: "16 May 2025",
      time: "04:15 PM",
      title: "Shipment information sent to FedEx",
      location: "New Delhi, India",
      hasLink: true,
      state: "pending",
    },
    {
      date: "16 May 2025",
      time: "02:30 PM",
      title: "Picked up",
      location: "New Delhi, India",
      hasLink: true,
      state: "pending",
    },
  ],
};

export function getShipment(trackingId: string): Shipment {
  return { ...SAMPLE, trackingId: trackingId || SAMPLE.trackingId };
}
