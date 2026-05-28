"use client";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

const GEO_URL = "/india-states.json";

const stateApplicants: Record<string, number> = {
  "Uttar Pradesh": 9200, "Delhi": 8200, "Bihar": 5600,
  "Maharashtra": 5800, "West Bengal": 2900, "Tamil Nadu": 3200,
  "Rajasthan": 3800, "Gujarat": 2700, "Karnataka": 2100,
  "Madhya Pradesh": 2400, "Andhra Pradesh": 1900,
  "Orissa": 1200, "Punjab": 2100, "Haryana": 2600, "Kerala": 1500,
  "Jharkhand": 900, "Assam": 700, "Chhattisgarh": 600,
  "Uttaranchal": 850, "Himachal Pradesh": 400, "Jammu and Kashmir": 350,
  "Tripura": 200, "Meghalaya": 180, "Manipur": 160, "Nagaland": 140,
  "Goa": 320, "Arunachal Pradesh": 120, "Mizoram": 110, "Sikkim": 90,
};

const getStateColor = (count: number) => {
  if (count >= 8000) return "#1a2744";
  if (count >= 5000) return "#243560";
  if (count >= 3000) return "#2d4a8a";
  if (count >= 2000) return "#3b63b8";
  if (count >= 1000) return "#6b8fd4";
  if (count >= 500)  return "#a8bceb";
  return "#d4dff5";
};

export const CITIES = [
  { name: "Delhi",     coords: [77.1025, 28.7041] as [number, number], count: "8,200", color: "#ef4444" },
  { name: "Mumbai",    coords: [72.8777, 19.0760] as [number, number], count: "5,800", color: "#3b82f6" },
  { name: "Kolkata",   coords: [88.3639, 22.5726] as [number, number], count: "2,900", color: "#8b5cf6" },
  { name: "Chennai",   coords: [80.2707, 13.0827] as [number, number], count: "3,200", color: "#10b981" },
  { name: "Bengaluru", coords: [77.5946, 12.9716] as [number, number], count: "2,100", color: "#f59e0b" },
  { name: "Hyderabad", coords: [78.4867, 17.3850] as [number, number], count: "1,800", color: "#06b6d4" },
];

export default function IndiaMap() {
  return (
    <ComposableMap
      projection="geoMercator"
      projectionConfig={{ scale: 420, center: [82.8, 22] }}
      style={{ width: "100%", height: "100%" }}
    >
      <Geographies geography={GEO_URL}>
        {({ geographies }: { geographies: Array<Record<string, unknown>> }) =>
          geographies
            .filter((geo: Record<string, unknown>) => {
              try {
                const geom = geo.geometry as { coordinates?: unknown[][] } | undefined;
                const coords = geom?.coordinates;
                return coords && coords.length > 0 && coords[0] && coords[0].length > 2;
              } catch { return false; }
            })
            .map((geo: Record<string, unknown>) => {
              const props = geo.properties as { NAME_1?: string } | undefined;
              const name = props?.NAME_1 ?? "";
              const count = stateApplicants[name] ?? 0;
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={getStateColor(count)}
                  stroke="#ffffff"
                  strokeWidth={0.6}
                  style={{
                    default: { outline: "none" },
                    hover:   { fill: "#f59e0b", outline: "none", cursor: "pointer" },
                    pressed: { outline: "none" },
                  }}
                />
              );
            })
        }
      </Geographies>
      {CITIES.map(({ name, coords, count, color }) => (
        <Marker key={name} coordinates={coords}>
          <circle r={6} fill={color} stroke="#fff" strokeWidth={1.5} opacity={0.95} />
          <circle r={2.5} fill="#fff" opacity={0.8} />
          <text
            textAnchor="middle"
            y={-10}
            style={{ fontSize: 7.5, fontWeight: 700, fill: "#1a2744", fontFamily: "sans-serif" }}
          >
            {name}
          </text>
          <text
            textAnchor="middle"
            y={-2}
            style={{ fontSize: 6.5, fill: color, fontWeight: 600, fontFamily: "sans-serif" }}
          >
            {count}
          </text>
        </Marker>
      ))}
    </ComposableMap>
  );
}
