import React from "react";
import { pie, arc, PieArcDatum } from "d3";
import { ClientTooltip, TooltipContent, TooltipTrigger } from "../helpers/ClientTooltip";

type DataItem = {
  name: string;
  value: number;
  logo: string;
  color: string;
};

const data: DataItem[] = [
  {
    name: "Apple",
    value: 731,
    logo: "https://etoro-cdn.etorostatic.com/market-avatars/1001/1001_494D5A_F7F7F7.svg",
    color: "text-pink-400",
  },
  {
    name: "Mercedes",
    value: 631,
    logo: "https://etoro-cdn.etorostatic.com/market-avatars/1206/1206_2F3350_F7F7F7.svg",
    color: "text-purple-400",
  },
  {
    name: "Palantir",
    value: 331,
    logo: "https://etoro-cdn.etorostatic.com/market-avatars/7991/7991_2C2C2C_F7F7F7.svg",
    color: "text-indigo-400",
  },
  {
    name: "Google",
    value: 232,
    logo: "https://etoro-cdn.etorostatic.com/market-avatars/1002/1002_3183FF_F7F7F7.svg",
    color: "text-sky-400",
  },
  {
    name: "Tesla",
    value: 101,
    logo: "https://etoro-cdn.etorostatic.com/market-avatars/1007/1007_F7F7F7_2C2C2C.svg",
    color: "text-lime-400",
  },
  {
    name: "Meta",
    value: 42,
    logo: "https://etoro-cdn.etorostatic.com/market-avatars/1008/1008_F7F7F7_2C2C2C.svg",
    color: "text-amber-400",
  },
];

export function Live2_PieChartStocks() {
  // Chart dimensions
  const radius = Math.PI * 100;
  const gap = 0.02; // Gap between slices

  // Pie layout and arc generator
  const pieLayout = pie<DataItem>()
    .value((d) => d.value)
    .padAngle(gap); // Creates a gap between slices

  const arcGenerator = arc<PieArcDatum<DataItem>>()
    .innerRadius(20)
    .outerRadius(radius)
    .cornerRadius(8);

  const labelRadius = radius * 0.8;
  const arcLabel = arc<PieArcDatum<DataItem>>().innerRadius(labelRadius).outerRadius(labelRadius);

  const arcs = pieLayout(data);

  // Calculate the angle for each slice
  const computeAngle = (d: PieArcDatum<DataItem>) => {
    return ((d.endAngle - d.startAngle) * 180) / Math.PI;
  };

  // Minimum angle to display text
  const MIN_ANGLE = 20;

  return (
    <div className="p-6">
      <div className="relative max-w-[16rem] mx-auto">
        <svg
          viewBox={`-${radius} -${radius} ${radius * 2} ${radius * 2}`}
          className="overflow-visible"
        >
          {/* Connecting lines */}
          {arcs.map((d, i) => {
            const [labelX, labelY] = arcLabel.centroid(d);
            const [arcX, arcY] = arcGenerator.centroid(d);
            const LINE_LENGTH = 1.35;

            return (
              <g key={`line-${i}`} className="pointer-events-none">
                <line
                  x1={arcX}
                  y1={arcY}
                  x2={labelX * LINE_LENGTH}
                  y2={labelY * LINE_LENGTH}
                  stroke={`currentColor`}
                  className={d.data.color}
                  strokeWidth={4}
                />
              </g>
            );
          })}

          {/* Slices */}
          {arcs.map((d: PieArcDatum<DataItem>, i) => (
            <ClientTooltip key={i}>
              <TooltipTrigger>
                <path
                  key={i}
                  fill={"currentColor"}
                  d={arcGenerator(d)!}
                  className={`${d.data.color}`}
                />
              </TooltipTrigger>
              <TooltipContent>
                <div>{d.data.name}</div>
                <div className="text-gray-500 text-sm">{d.data.value.toLocaleString("en-US")}</div>
              </TooltipContent>
            </ClientTooltip>
          ))}
        </svg>

        {/* Labels as absolutely positioned divs */}
        <div className="absolute inset-0 pointer-events-none">
          {arcs.map((d: PieArcDatum<DataItem>, i) => {
            const angle = computeAngle(d);

            // Get pie center position
            const [x, y] = arcLabel.centroid(d);
            const CENTER_PCT = 50;

            // Convert to percentage positions. Adjust magic numbers to move the labels around
            const logoLeft = `${CENTER_PCT + (x / radius) * 40}%`;
            const logoTop = `${CENTER_PCT + (y / radius) * 40}%`;

            const valueLeft = `${CENTER_PCT + (x / radius) * 74}%`;
            const valueTop = `${CENTER_PCT + (y / radius) * 72}%`;

            return (
              <div key={i}>
                <div
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 text-center"
                  style={{ left: valueLeft, top: valueTop }}
                >
                  {d.data.value}
                </div>
                {angle >= MIN_ANGLE && (
                  <div
                    className="absolute -translate-x-1/2 -translate-y-1/2 size-10"
                    style={{ left: logoLeft, top: logoTop }}
                  >
                    <img src={d.data.logo} alt={d.data.name} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
