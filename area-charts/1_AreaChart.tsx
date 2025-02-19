import { scaleTime, scaleLinear, line as d3line, max, area as d3area, curveMonotoneX } from "d3";
import { CSSProperties } from "react";
import { ClientTooltip, TooltipContent, TooltipTrigger } from "../helpers/ClientTooltip";

const sales = [
  { date: "2023-04-30", value: 4 },
  { date: "2023-05-01", value: 6 },
  { date: "2023-05-02", value: 8 },
  { date: "2023-05-03", value: 7 },
  { date: "2023-05-04", value: 10 },
  { date: "2023-05-05", value: 12 },
  { date: "2023-05-06", value: 10.5 },
  { date: "2023-05-07", value: 6 },
  { date: "2023-05-08", value: 8 },
  { date: "2023-05-09", value: 7.5 },
  { date: "2023-05-10", value: 6 },
  { date: "2023-05-11", value: 8 },
  { date: "2023-05-12", value: 9 },
  { date: "2023-05-13", value: 10 },
  { date: "2023-05-14", value: 17 },
  { date: "2023-05-15", value: 14 },
  { date: "2023-05-16", value: 15 },
  { date: "2023-05-17", value: 20 },
  { date: "2023-05-18", value: 18 },
  { date: "2023-05-19", value: 16 },
  { date: "2023-05-20", value: 15 },
  { date: "2023-05-21", value: 16 },
  { date: "2023-05-22", value: 13 },
  { date: "2023-05-23", value: 11 },
  { date: "2023-05-24", value: 11 },
  { date: "2023-05-25", value: 13 },
  { date: "2023-05-26", value: 12 },
  { date: "2023-05-27", value: 9 },
  { date: "2023-05-28", value: 8 },
  { date: "2023-05-29", value: 10 },
  { date: "2023-05-30", value: 11 },
  { date: "2023-05-31", value: 8 },
  { date: "2023-06-01", value: 9 },
  { date: "2023-06-02", value: 10 },
  { date: "2023-06-03", value: 12 },
  { date: "2023-06-04", value: 13 },
  { date: "2023-06-05", value: 15 },
  { date: "2023-06-06", value: 13.5 },
  { date: "2023-06-07", value: 13 },
  { date: "2023-06-08", value: 13 },
  { date: "2023-06-09", value: 14 },
  { date: "2023-06-10", value: 13 },
  { date: "2023-06-11", value: 12.5 },
];
let data = sales.map((d) => ({ ...d, date: new Date(d.date) }));

export function Live1_AreaChart() {
  let xScale = scaleTime()
    .domain([data[0].date, data[data.length - 1].date])
    .range([0, 100]);

  let yScale = scaleLinear()
    .domain([0, max(data.map((d) => d.value)) ?? 0])
    .range([100, 0]);

  let line = d3line<(typeof data)[number]>()
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.value))
    .curve(curveMonotoneX);

  // Area generator
  let area = d3area<(typeof data)[number]>()
    .x((d) => xScale(d.date))
    .y0(yScale(0))
    .y1((d) => yScale(d.value))
    .curve(curveMonotoneX);

  let areaPath = area(data) ?? undefined;

  let d = line(data);

  if (!d) {
    return null;
  }

  return (
    <div
      className="relative h-72 w-full"
      style={
        {
          "--marginTop": "0px",
          "--marginRight": "10px",
          "--marginBottom": "15px",
          "--marginLeft": "0px",
        } as CSSProperties
      }
    >
      {/* Chart area */}
      <div
        className="absolute inset-0
          h-[calc(100%-var(--marginTop)-var(--marginBottom))]
          w-[calc(100%-var(--marginLeft)-var(--marginRight))]
          translate-x-[var(--marginLeft)]
          translate-y-[var(--marginTop)]
          overflow-visible
          "
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          {/* Area */}
          <path d={areaPath} className="text-purple-200 dark:text-purple-400" fill="currentColor" />

          {/* Line */}
          <path
            d={d}
            fill="none"
            className="text-gray-50 dark:text-zinc-800"
            stroke="currentColor"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
          {/* Invisible Tooltip Area */}
          {data.map((d, index) => (
            <ClientTooltip key={index}>
              <TooltipTrigger>
                <g className="group/tooltip">
                  {/* Tooltip Line */}
                  <line
                    x1={xScale(d.date)}
                    y1={0}
                    x2={xScale(d.date)}
                    y2={100}
                    stroke="currentColor"
                    strokeWidth={1}
                    className="opacity-0 group-hover/tooltip:opacity-100 text-zinc-300 dark:text-zinc-700 transition-opacity"
                    vectorEffect="non-scaling-stroke"
                    style={{ pointerEvents: "none" }}
                  />
                  {/* Invisible area closest to a specific point for the tooltip trigger */}
                  <rect
                    x={(() => {
                      const prevX = index > 0 ? xScale(data[index - 1].date) : xScale(d.date);
                      return (prevX + xScale(d.date)) / 2;
                    })()}
                    y={0}
                    width={(() => {
                      const prevX = index > 0 ? xScale(data[index - 1].date) : xScale(d.date);
                      const nextX =
                        index < data.length - 1 ? xScale(data[index + 1].date) : xScale(d.date);
                      const leftBound = (prevX + xScale(d.date)) / 2;
                      const rightBound = (xScale(d.date) + nextX) / 2;
                      return rightBound - leftBound;
                    })()}
                    height={100}
                    fill="transparent"
                    className="cursor-pointer"
                  />
                </g>
              </TooltipTrigger>
              <TooltipContent>
                <div>
                  {d.date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                  })}
                </div>
                <div className="text-gray-500 text-sm">{d.value.toLocaleString("en-US")}</div>
              </TooltipContent>
            </ClientTooltip>
          ))}
        </svg>

        {/* X Axis */}
        <div className="translate-y-1">
          {data.map((day, i) => {
            const isFirst = i === 0;
            const isLast = i === data.length - 1;
            const isMax = day.value === Math.max(...data.map((d) => d.value));
            if (!isFirst && !isLast && !isMax) return null;
            return (
              <div key={i} className="overflow-visible text-zinc-500">
                <div
                  style={{
                    left: `${xScale(day.date)}%`,
                    top: "100%",
                    transform: `translateX(${
                      i === 0 ? "0%" : i === data.length - 1 ? "-100%" : "-50%"
                    })`, // The first and last labels should be within the chart area
                  }}
                  className="text-xs absolute whitespace-nowrap"
                >
                  {day.date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Y axis */}
      <div
        className="absolute right-0 top-0
          h-[calc(100%-var(--marginTop)-var(--marginBottom))]
          translate-y-[var(--marginTop)]
          w-[var(--marginRight)]
          overflow-visible
        "
      >
        {yScale
          .ticks(8)
          .map(yScale.tickFormat(8, "d"))
          .map((value, i) => (
            <div
              key={i}
              style={{
                top: `${yScale(+value)}%`,
                left: "0%",
              }}
              className="absolute text-xs -translate-y-1/2 text-gray-400 w-full text-right pl-1"
            >
              {value}
            </div>
          ))}
      </div>
    </div>
  );
}
