# TrackMyCourier.in

A courier & logistics website with real-time shipment tracking UI, built with **React + TypeScript + Vite + Tailwind CSS**.

## Pages

- **Landing (`/`)** — hero with tracking search, service categories, about section with global partners, and a "Locate Us" section with an embedded Google Map and branch offices.
- **Tracking (`/track?id=<AWB>`)** — shipment summary, carrier progress stepper, travel history timeline, delivery address with map, and full shipment details.

## Getting started

```bash
npm install
npm run dev      # start dev server
npm run build    # type-check + production build
npm run preview  # preview the production build
npm run lint     # run oxlint
```

## Tech

- React 19 + React Router
- Vite 6
- Tailwind CSS 3
- lucide-react icons

## Notes

Tracking data is currently served from a mock in `src/data/tracking.ts`. Any AWB
number entered returns the sample shipment; wire `getShipment` up to a real API
to make it live.
