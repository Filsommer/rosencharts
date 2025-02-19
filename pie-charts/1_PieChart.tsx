import React from "react";
import { pie, arc, PieArcDatum } from "d3";
import { ClientTooltip, TooltipContent, TooltipTrigger } from "../helpers/ClientTooltip";

type DataItem = {
  name: string;
  value: number;
};

const data: DataItem[] = [
  {
    name: "Rent",
    value: 731,
  },
  {
    name: "Food",
    value: 631,
  },
  {
    name: "Household",
    value: 331,
  },
  {
    name: "Transportation",
    value: 232,
  },
  {
    name: "Entertainment",
    value: 101,
  },
  {
    name: "Other",
    value: 42,
  },
];

export function Live1_PieChart() {
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
  const minAngle = 20; // Adjust this value as needed

  const gradients = [
    { id: "gradient-green", colors: ["#F5A5DB", "green"] },
    { id: "gradient-green", colors: ["#B89DFB", "green"] },
    { id: "gradient-green", colors: ["#758bcf", "green"] },
    { id: "gradient-orange", colors: ["#33C2EA", "#EC8E7B"] },
    { id: "gradient-blue", colors: ["#FFC182", "#7DCEDC"] },
    { id: "gradient-purple", colors: ["#73DC5A", "#CF91D8"] },
    { id: "gradient-green", colors: ["#B89DFB", "green"] },
    { id: "gradient-green", colors: ["#2999F5", "green"] },
  ];

  return (
    <div className="overflow-visible">
      <div className="relative max-w-[16rem] mx-auto">
        <svg viewBox={`-${radius} -${radius} ${radius * 2} ${radius * 2}`}>
          {/* Sectors with Gradient Fill */}
          {arcs.map((d: PieArcDatum<DataItem>, i) => (
            <ClientTooltip key={i}>
              <TooltipTrigger>
                <path key={i} fill={gradients[i].colors[0]} d={arcGenerator(d)!} />
              </TooltipTrigger>
              <TooltipContent>
                <div>{d.data.name}</div>
              </TooltipContent>
            </ClientTooltip>
          ))}
        </svg>
        {/* Labels as absolutely positioned divs */}
        {arcs.map((d: PieArcDatum<DataItem>, i) => {
          const angle = computeAngle(d);
          if (angle <= minAngle) return null;

          let centroid = arcLabel.centroid(d);

          // Converts SVG coordinates to container-relative 0-100% positioning. Tweak as needed.
          const leftLabel = `${50 + (centroid[0] / radius) * 70}%`;
          const topLabel = `${50 + (centroid[1] / radius) * 70}%`;
          const leftLogo = `${50 + (centroid[0] / radius) * 40}%`;
          const topLogo = `${50 + (centroid[1] / radius) * 40}%`;

          return (
            <div key={i}>
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none size-10 text-white text-md font-extrabold"
                style={{ left: leftLogo, top: topLogo }}
              >
                {d.data.value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
