import React, { CSSProperties } from "react";
import { scaleBand, scaleLinear, max, line as d3_line, min, curveMonotoneX } from "d3";
import { ClientTooltip, TooltipContent, TooltipTrigger } from "../helpers/ClientTooltip";

const data = [
  { key: "Jan", metric1: 18.1, metric2: 700 },
  { key: "Feb", metric1: 14.3, metric2: 1000 },
  { key: "Mar", metric1: 27.1, metric2: 900 },
  { key: "Apr", metric1: 40, metric2: 1000 },
  { key: "May", metric1: 12.7, metric2: 500 },
  { key: "Jun", metric1: 22.8, metric2: 600 },
  { key: "Jul", metric1: 17.8, metric2: 900 },
  { key: "Aug", metric1: 5.8, metric2: 800 },
  { key: "Sep", metric1: 42, metric2: 700 },
  { key: "Oct", metric1: 12.7, metric2: 900 },
  { key: "Nov", metric1: 24.7, metric2: 1000 },
  { key: "Dec", metric1: 19.7, metric2: 1220 },
];

export function Live14_BarChartLine() {
  const minBars = 10;
  const filledData = [
    ...data,
    ...Array.from({ length: Math.max(0, minBars - data.length) }, (_, i) => ({
      key: `Empty ${i + 1}`,
      metric1: 0,
      metric2: 0,
    })),
  ];
  const maxMetric1 = max(data.map((d) => d.metric1)) ?? 0;
  const maxMetric2 = max(data.map((d) => d.metric2)) ?? 0;
  const minMetric2 = min(data.map((d) => d.metric2)) ?? 0;

  const xScale = scaleBand()
    .domain(data.map((d) => d.key))
    .range([0, 100])
    .padding(0.3);

  const yScaleMetric1 = scaleLinear().domain([0, maxMetric1]).range([100, 0]);

  const yScaleMetric2 = scaleLinear().domain([minMetric2, maxMetric2]).range([100, 0]);

  const line = d3_line<(typeof data)[number]>()
    .x((d) => {
      const xPosition = xScale(d.key) ?? 0;
      const bandwidth = xScale.bandwidth() ?? 0;
      return xPosition + bandwidth / 2;
    })
    .y((d) => yScaleMetric2(d.metric2))
    .curve(curveMonotoneX);

  const d = line(data);

  return (
    <div
      className="relative h-72 w-full grid"
      style={
        {
          "--marginTop": "0px",
          "--marginRight": "25px",
          "--marginBottom": "55px",
          "--marginLeft": "25px",
        } as CSSProperties
      }
    >
      {/* Left Y-axis */}
      <div
        className="absolute 
          h-[calc(100%-var(--marginTop)-var(--marginBottom))]
          translate-y-[var(--marginTop)]
          w-[var(--marginLeft)]
          left-0
          overflow-visible
        "
      >
        {yScaleMetric1
          .ticks(8)
          .map(yScaleMetric1.tickFormat(8, "d"))
          .map((value, i) => (
            <div
              key={i}
              style={{
                right: "0%",
                top: `${yScaleMetric1(+value)}%`,
              }}
              className="absolute -translate-y-1/2 text-xs tabular-nums text-violet-300 text-right w-full"
            >
              {value}
            </div>
          ))}
      </div>

      {/* Right Y-axis */}
      <div
        className="absolute 
          h-[calc(100%-var(--marginTop)-var(--marginBottom))]
          translate-y-[var(--marginTop)]
          w-[var(--marginRight)]
          right-0
          overflow-visible
        "
      >
        {yScaleMetric2
          .ticks(8)
          .map(yScaleMetric2.tickFormat(8, "d"))
          .map((value, i) => (
            <div
              key={i}
              style={{
                right: "0%",
                top: `${yScaleMetric2(+value)}%`,
              }}
              className="absolute -translate-y-1/2 text-xs tabular-nums text-rose-400 w-full text-right pr-2"
            >
              {value}
            </div>
          ))}
      </div>

      {/* Chart Area */}
      <div
        className="absolute inset-0
          z-10
          h-[calc(100%-var(--marginTop)-var(--marginBottom))]
          w-[calc(100%-var(--marginLeft)-var(--marginRight))]
          translate-x-[var(--marginLeft)]
          translate-y-[var(--marginTop)]
          overflow-visible
        "
      >
        {/* Bars */}
        <div className="relative w-full h-full z-10">
          {filledData.map((d, index) => {
            const barWidth = xScale.bandwidth();
            const barHeight = yScaleMetric1(0) - yScaleMetric1(d.metric1);

            return (
              <>
                <ClientTooltip key={index}>
                  <TooltipTrigger>
                    {/* Full height invisible bar */}
                    <div
                      style={{
                        width: `${barWidth}%`,
                        height: `100%`,
                        borderRadius: "6px 6px 0 0",
                        marginLeft: `${xScale(d.key)}%`,
                      }}
                      className="absolute bottom-0 z-10"
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-sm text-gray-400">{d.key}</div>
                    <div className="flex gap-4">
                      <div className="flex gap-1.5 items-center text-sm">
                        <div className="h-3.5 w-1 rounded-full bg-violet-300"></div>
                        <div>{d.metric1}</div>
                      </div>
                      <div className="flex gap-1.5 items-center text-sm">
                        <div className="h-3.5 w-1 rounded-full bg-rose-300"></div>
                        <div>{d.metric2}</div>
                      </div>
                    </div>
                  </TooltipContent>
                </ClientTooltip>

                {/* Real bar */}
                <div
                  style={{
                    width: `${barWidth}%`,
                    height: `${barHeight}%`,
                    borderRadius: "6px 6px 0 0",
                    marginLeft: `${xScale(d.key)}%`,
                  }}
                  className="absolute bottom-0 bg-gradient-to-b from-violet-200 to-violet-300"
                />
              </>
            );
          })}
          {/* X Axis (Labels) */}
          {data.map((entry, i) => {
            const xPosition = xScale(entry.key)! + xScale.bandwidth() / 2;

            return (
              <div
                key={i}
                className="absolute overflow-visible text-gray-400"
                style={{
                  left: `${xPosition}%`,
                  top: "100%",
                  transform: "rotate(45deg) translateX(4px) translateY(8px)",
                }}
              >
                <div className={`absolute text-xs -translate-y-1/2 whitespace-nowrap`}>
                  {entry.key}
                </div>
              </div>
            );
          })}
        </div>

        {/* Line */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full overflow-visible pointer-events-none z-20"
          preserveAspectRatio="none"
        >
          <path
            d={d ?? ""}
            fill="none"
            className="text-rose-300"
            stroke="currentColor"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </div>
  );
}
