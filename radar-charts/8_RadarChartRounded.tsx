import React from "react";
import { curveCardinalClosed, lineRadial, scaleLinear } from "d3";

const rawData = [
  { topic: "Tech", value: 320 },
  { topic: "Financials", value: 190 },
  { topic: "Energy", value: 170 },
  { topic: "Healthcare", value: 250 },
  { topic: "Utilities", value: 210 },
];
const maxValue = Math.max(...rawData.map((d) => d.value));
const numAxes = rawData.length;

export function Live8_RadarChartRounded() {
  const radius = 150;
  const angleSlice = (Math.PI * 2) / numAxes;

  // Scale for the radius
  const rScale = scaleLinear().range([0, radius]).domain([0, maxValue]);

  // Create the radar line
  const radarLine = lineRadial<{ value: number }>()
    .radius((d) => rScale(d.value))
    .angle((d, i) => i * angleSlice)
    .curve(curveCardinalClosed); // Ensure the path is closed

  // Generate the radar chart path
  const radarPath = radarLine(rawData);

  return (
    <div className="relative mt-10 mb-2">
      <svg
        viewBox={`0 0 ${radius * 2} ${radius * 2}`}
        className="max-w-[18rem] mx-auto overflow-visible"
      >
        {/* <svg width={radius} height={radius} className="overflow-visible m-4 py-2"> */}
        <g transform={`translate(${radius}, ${radius})`}>
          {/* Draw concentric circles */}
          {[...Array(5)].map((_, i) => {
            const circleRadius = (radius / 5) * (i + 1);
            return (
              <React.Fragment key={i}>
                <circle
                  cx={0}
                  cy={0}
                  r={(radius / 5) * (i + 1)}
                  fill="none"
                  strokeOpacity={1}
                  className={
                    i % 2 === 0
                      ? "stroke-gray-100 dark:stroke-zinc-800"
                      : "stroke-gray-50 dark:stroke-zinc-900"
                  }
                  strokeWidth={radius / 5}
                />
              </React.Fragment>
            );
          })}

          {/* Add labels to each circle */}
          {/* {rawData.map((d, i) => (
            <text
              key={`label-${i}`}
              x={rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2)}
              y={rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2)}
              dy="-0.5em" // Adjust vertical position
              textAnchor="middle"
              fontSize="12px"
              className="fill-black"
            >
              {d.value}
            </text>
          ))} */}

          {/* Draw axes */}
          {/* {rawData.map((d, i) => {
            if (i === 0) return null; // hide the first axis so it doesn't cover the labels
            return (
              <line
                key={i}
                x1={0}
                y1={0}
                x2={rScale(maxValue) * Math.cos(angleSlice * i - Math.PI / 2)}
                y2={rScale(maxValue) * Math.sin(angleSlice * i - Math.PI / 2)}
                className="stroke-gray-300 dark:stroke-zinc-800"
              />
            );
          })} */}

          {/* Draw the radar chart path */}
          <path d={radarPath ?? ""} strokeWidth="1" className="fill-lime-200/70" />

          {/* Draw circles for each data point */}
          {rawData.map((d, i) => (
            <React.Fragment key={i}>
              <circle
                cx={rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2)}
                cy={rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2)}
                r={12}
                strokeWidth="1"
                className="fill-gray-100/70 stroke-lime-300"
              />
              <text
                x={rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2)}
                y={rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2)}
                dy="0.35em" // Center the text vertically
                textAnchor="middle"
                fontSize="10px"
                className="fill-lime-700 dark:fill-lime-950"
              >
                {d.value}
              </text>
            </React.Fragment>
          ))}

          {/* Add labels for each axis */}
          {rawData.map((d, i) => {
            const angle = (angleSlice * i * 180) / Math.PI;
            const x = (rScale(maxValue) + 10) * Math.cos(angleSlice * i - Math.PI / 2);
            const y = (rScale(maxValue) + 10) * Math.sin(angleSlice * i - Math.PI / 2);
            const adjustedAngle = angle > 90 && angle < 270 ? angle + 180 : angle;

            return (
              <text
                key={i}
                x={x}
                y={angle > 90 && angle < 270 ? y + 20 : y - 15}
                textAnchor="middle"
                fontSize="14px"
                className="fill-lime-700 dark:fill-lime-300"
                transform={`rotate(${adjustedAngle}, ${x}, ${y})`}
              >
                {d.topic}
              </text>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
