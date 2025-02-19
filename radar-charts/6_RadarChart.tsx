import React from "react";
import * as d3 from "d3";

const rawData = [
  { topic: "Tech", value: 330 },
  { topic: "Financials", value: 160 },
  { topic: "Energy", value: 140 },
  { topic: "Healthcare", value: 200 },
  { topic: "Utilities", value: 180 },
];
const maxValue = Math.max(...rawData.map((d) => d.value));
const numAxes = rawData.length;

export function Live6_RadarChart() {
  const radius = 150;
  const angleSlice = (Math.PI * 2) / numAxes;

  // Scale for the radius
  const rScale = d3.scaleLinear().range([0, radius]).domain([0, maxValue]);

  // Create the radar line
  const radarLine = d3
    .lineRadial<{ value: number }>()
    .radius((d) => rScale(d.value))
    .angle((d, i) => i * angleSlice)
    .curve(d3.curveLinearClosed); // Ensure the path is closed

  // Generate the radar chart path
  const radarPath = radarLine(rawData);

  return (
    <div className="relative mt-8 mb-2">
      <svg
        viewBox={`0 0 ${radius * 2} ${radius * 2}`}
        className="max-w-[18rem] mx-auto overflow-visible"
      >
        {/* <svg width={radius} height={radius} className="overflow-visible m-4 py-2"> */}
        <g transform={`translate(${radius}, ${radius})`}>
          {/* Draw concentric circles */}
          {[...Array(5)].map((_, i) => (
            <circle
              key={i}
              cx={0}
              cy={0}
              r={(radius / 5) * (i + 1)}
              fill="none"
              className="stroke-gray-200 dark:stroke-zinc-700"
              strokeWidth="0.5"
            />
          ))}

          {/* Draw axes */}
          {rawData.map((d, i) => (
            <line
              key={i}
              x1={0}
              y1={0}
              x2={rScale(maxValue) * Math.cos(angleSlice * i - Math.PI / 2)}
              y2={rScale(maxValue) * Math.sin(angleSlice * i - Math.PI / 2)}
              className="stroke-lime-300 dark:stroke-zinc-700"
            />
          ))}

          {/* Draw the radar chart path */}
          <path d={radarPath || ""} strokeWidth="1" className="stroke-lime-400 fill-lime-200/70" />

          {/* Add labels for each axis */}
          {rawData.map((d, i) => (
            <text
              key={i}
              x={(rScale(maxValue) + 10) * Math.cos(angleSlice * i - Math.PI / 2)}
              y={(rScale(maxValue) + 10) * Math.sin(angleSlice * i - Math.PI / 2)}
              textAnchor="middle"
              fontSize="14px"
              className="fill-lime-700 dark:fill-lime-300"
            >
              {d.topic}
            </text>
          ))}
        </g>
      </svg>
    </div>
  );
}
