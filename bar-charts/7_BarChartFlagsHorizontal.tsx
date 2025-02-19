import React, { CSSProperties } from "react";
import { scaleBand, scaleLinear, max } from "d3";

const data = [
  { key: "Portugal", value: 55.8, flag: "pt" },
  { key: "France", value: 34.3, flag: "fr" },
  { key: "Sweden", value: 27.1, flag: "se" },
  { key: "Spain", value: 22.5, flag: "es" },
  { key: "Italy", value: 18.7, flag: "it" },
  { key: "Germany", value: 10.8, flag: "de" },
];

export function Live7_BarChartFlagsHorizontal() {
  // Scales
  const yScale = scaleBand()
    .domain(data.map((d) => d.key) as string[])
    .range([0, 100]) // Represents the height of the chart
    .padding(0.2);

  const xScale = scaleLinear()
    .domain([0, max(data.map((d) => d.value)) ?? 0])
    .range([0, 100]); // Represents the width of the chart

  return (
    <div
      className="relative w-full h-72"
      style={
        {
          "--marginTop": "0px",
          "--marginRight": "35px",
          "--marginBottom": "16px",
          "--marginLeft": `35px`,
        } as CSSProperties
      }
    >
      {/* Bars and Text */}
      <div
        className="absolute inset-0
          h-[calc(100%-var(--marginTop)-var(--marginBottom))]
          translate-y-[var(--marginTop)]
          left-[var(--marginLeft)]
          right-[var(--marginRight)]
          overflow-visible z-20"
      >
        {data.map((entry, i) => {
          const barWidth = xScale(entry.value);
          const barHeight = yScale.bandwidth();

          return (
            <div
              key={i}
              className="relative bg-zinc-200 dark:bg-zinc-700"
              style={{
                top: `${yScale(entry.key ?? "")}%`,
                height: `${barHeight}%`,
                width: `${barWidth}%`,
                borderRadius: `0 4px 4px 0`,
                position: "absolute",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "100%",
                  transform: "translate(-50%, -50%)",
                  fontSize: "0.75rem",
                  fontWeight: "500",
                }}
                className="text-gray-500 dark:text-gray-300"
              >
                {entry.key}
              </span>
            </div>
          );
        })}
        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Grid lines */}
          {xScale
            .ticks(8)
            .map(xScale.tickFormat(8, "d"))
            .map((active, i) => (
              <g
                transform={`translate(${xScale(+active)},0)`}
                className="text-gray-300/80 dark:text-gray-800/80"
                key={i}
              >
                <line
                  y1={0}
                  y2={100}
                  stroke="currentColor"
                  strokeDasharray="6,5"
                  strokeWidth={0.5}
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            ))}
        </svg>
        {/* X Axis (Values) */}
        {xScale.ticks(4).map((value, i) => (
          <div
            key={i}
            style={{
              left: `${xScale(value)}%`,
              top: "100%",
            }}
            className="absolute text-xs -translate-x-1/2 tabular-nums text-gray-400"
          >
            {value}
          </div>
        ))}
      </div>

      {/* Y Axis (Images) */}
      <div
        className="absolute inset-0 z-10
          h-[calc(100%-var(--marginTop)-var(--marginBottom))]
          w-[var(--marginLeft)]
          translate-y-[var(--marginTop)]
          overflow-visible"
      >
        {data.map((entry, i) => (
          <div
            key={i}
            style={{
              top: `${yScale(entry.key)! + yScale.bandwidth() / 2}%`,
              left: `0`,
            }}
            className="absolute rounded-full overflow-hidden size-7 text-sm text-gray-700 -translate-y-1/2 pointer-events-none"
          >
            <img
              key={i}
              src={`https://hatscripts.github.io/circle-flags/flags/${entry.flag}.svg`}
              className="opacity-80"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
