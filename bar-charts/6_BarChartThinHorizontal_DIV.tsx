import React, { CSSProperties } from "react";
import { scaleBand, scaleLinear, max } from "d3";
import { ClientTooltip, TooltipContent, TooltipTrigger } from "../helpers/ClientTooltip";

const data = [
  { key: "France", value: 38.1 },
  { key: "Spain", value: 25.3 },
  { key: "Italy", value: 23.1 },
  { key: "Portugal", value: 19.5 },
  { key: "Germany", value: 14.7 },
  { key: "Netherlands", value: 6.1 },
  { key: "Belgium", value: 10.8 },
  { key: "Austria", value: 7.8 },
  { key: "Greece", value: 6.8 },
  { key: "Luxembourg", value: 5.5 },
  { key: "Cyprus", value: 4.8 },
  { key: "Malta", value: 3.5 },
  { key: "Slovenia", value: 3.8 },
  { key: "Estonia", value: 8.8 },
  { key: "Latvia", value: 15.8 },
  { key: "Lithuania", value: 12.8 },
  { key: "Croatia", value: 5.8 },
].toSorted((a, b) => b.value - a.value);

export function Live6_BarChartThinHorizontal_DIV() {
  // Scales
  const yScale = scaleBand()
    .domain(data.map((d) => d.key))
    .range([0, 100])
    .padding(0.6);

  const xScale = scaleLinear()
    .domain([0, max(data.map((d) => d.value)) ?? 0])
    .range([0, 100]);

  const longestWord = max(data.map((d) => d.key.length)) || 1;
  return (
    <div
      className="relative w-full h-72"
      style={
        {
          "--marginTop": "0px",
          "--marginRight": "0px",
          "--marginBottom": "16px",
          "--marginLeft": `${longestWord * 7}px`,
        } as CSSProperties
      }
    >
      {/* Chart Area */}
      <div
        className="absolute inset-0
          z-10
          h-[calc(100%-var(--marginTop)-var(--marginBottom))]
          translate-y-[var(--marginTop)]
          w-[calc(100%-var(--marginLeft)-var(--marginRight))]
          translate-x-[var(--marginLeft)]
          overflow-visible
        "
      >
        {/* Tooltip for each data point */}
        {data.map((d, index) => {
          const barWidth = xScale(d.value);
          const barHeight = yScale.bandwidth();
          const hoverColor =
            barWidth > 50
              ? "hover:bg-pink-200/40"
              : barWidth > 25
              ? "hover:bg-purple-200/40"
              : barWidth > 10
              ? "hover:bg-indigo-200/40"
              : "hover:bg-sky-200/40";
          return (
            <ClientTooltip key={index}>
              <TooltipTrigger>
                <div
                  style={{
                    position: "absolute",
                    left: "0",
                    top: `${yScale(d.key)}%`,
                    width: `100%`,
                    height: `calc(${barHeight}% + 8px)`,
                    transform: "translateY(-4px)",
                  }}
                  className={`${hoverColor} hover:bg-gray-200/50 relative z-10`}
                />
              </TooltipTrigger>
              <TooltipContent>
                <div>{d.key}</div>
                <div className="text-gray-500 text-sm">{d.value}</div>
              </TooltipContent>
            </ClientTooltip>
          );
        })}
        {/* End of Tooltip*/}

        {/* Bars with Rounded Right Corners */}
        {data.map((d, index) => {
          const barWidth = xScale(d.value);
          const barHeight = yScale.bandwidth();
          const barColor =
            barWidth > 50
              ? "bg-pink-300 dark:bg-pink-500"
              : barWidth > 25
              ? "bg-purple-300 dark:bg-purple-500"
              : barWidth > 10
              ? "bg-indigo-300 dark:bg-indigo-500"
              : "bg-sky-300 dark:bg-sky-500";
          return (
            <React.Fragment key={index}>
              <div
                style={{
                  position: "absolute",
                  left: "0",
                  top: `${yScale(d.key)}%`,
                  width: `${barWidth}%`,
                  height: `${barHeight}%`,
                }}
                className={`${barColor}`}
              />
              {/* Tip of the bar */}
              <div
                style={{
                  position: "absolute",
                  left: `${barWidth}%`,
                  top: `${yScale(d.key)! + barHeight / 2}%`,
                  transform: "translate(-100%, -50%)",
                  width: "9px",
                  height: "9px",
                  borderRadius: "2px",
                }}
                className={`${barColor}`}
              />
            </React.Fragment>
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
          {/* Bars with Rounded Right Corners */}
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

      {/* Y Axis (Letters) */}
      <div
        className="
          h-[calc(100%-var(--marginTop)-var(--marginBottom))]
          w-[var(--marginLeft)]
          translate-y-[var(--marginTop)]
          overflow-visible"
      >
        {data.map((entry, i) => (
          <span
            key={i}
            style={{
              left: "0",
              top: `${yScale(entry.key)! + yScale.bandwidth() / 2}%`,
            }}
            className="absolute text-xs text-gray-400 -translate-y-1/2 w-full text-right pr-2"
          >
            {entry.key}
          </span>
        ))}
      </div>
    </div>
  );
}
