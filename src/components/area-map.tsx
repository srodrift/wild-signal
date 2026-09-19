"use client";

import { useEffect, useRef } from "react";
import type { MapArea } from "@/lib/areas";

export function AreaMap({
  areas,
  focusId,
}: {
  areas: MapArea[];
  focusId?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const focus = areas.find((area) => area.id === focusId) ?? areas[0];

  useEffect(() => {
    const el = host.current;
    if (!el || areas.length === 0 || !focus) return;
    let cancelled = false;
    let map: import("leaflet").Map | undefined;
    const timers: number[] = [];

    void (async () => {
      const leaflet = await import("leaflet");
      const L = leaflet.default ?? leaflet;
      if (cancelled || !host.current) return;

      if ("_leaflet_id" in host.current) {
        host.current.innerHTML = "";
        delete (host.current as HTMLDivElement & { _leaflet_id?: number })._leaflet_id;
      }

      map = L.map(host.current, {
        zoomControl: true,
        attributionControl: true,
      }).setView([focus.lat, focus.lng], 14);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
      }).addTo(map);

      for (const area of areas) {
        const active = area.id === focus.id;
        L.circle([area.lat, area.lng], {
          radius: area.radiusMeters,
          color: active ? "#c4461a" : "#3f5c4a",
          weight: active ? 3 : 1.5,
          fillColor: active ? "#c4461a" : "#3f5c4a",
          fillOpacity: active ? 0.38 : 0.14,
        })
          .bindPopup(
            `<strong>${area.name}</strong><br/>Generalized area only — not a live pin.`,
          )
          .addTo(map);
      }

      timers.push(
        window.setTimeout(() => map?.invalidateSize(), 80),
        window.setTimeout(() => map?.invalidateSize(), 400),
      );
    })();

    return () => {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
      map?.remove();
    };
  }, [areas, focus]);

  return (
    <div className="relative z-0 isolate overflow-hidden rounded-2xl border border-[color:var(--rule)] bg-[color:var(--bay)]/10">
      <div
        ref={host}
        className="area-map-host h-72 w-full min-h-[18rem]"
        style={{ height: 288 }}
      />
      {focus ? (
        <p className="pointer-events-none absolute bottom-2 left-2 rounded-full bg-black/70 px-2.5 py-1 text-[11px] text-[color:var(--amber)]">
          {focus.name} · generalized area — not a pin
        </p>
      ) : null}
    </div>
  );
}
