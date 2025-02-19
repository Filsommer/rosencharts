import { pie, arc, PieArcDatum } from "d3";
import { ClientTooltip, TooltipContent, TooltipTrigger } from "../helpers/ClientTooltip";

type Item = { name: string; value: number };
const data: Item[] = [
  { name: "AAPL", value: 30 },
  { name: "BTC", value: 22 },
  { name: "GOLD", value: 11 },
  { name: "PLTR", value: 9 },
  { name: "ADA", value: 7 },
  { name: "MSFT", value: 3 },
];

export function Live5_DonutChartCenterText() {
  const radius = 420; // Chart base dimensions
  const gap = 0.01; // Gap between slices
  const lightStrokeEffect = 10; // 3d light effect around the slice

  // Pie layout and arc generator
  const pieLayout = pie<Item>()
    .value((d) => d.value)
    .padAngle(gap); // Creates a gap between slices

  // Adjust innerRadius to create a donut shape
  const innerRadius = radius / 1.625;
  const arcGenerator = arc<PieArcDatum<Item>>()
    .innerRadius(innerRadius)
    .outerRadius(radius)
    .cornerRadius(lightStrokeEffect + 2); // Apply rounded corners

  // Create an arc generator for the clip path that matches the outer path of the arc
  const arcClip =
    arc<PieArcDatum<Item>>()
      .innerRadius(innerRadius + lightStrokeEffect / 2)
      .outerRadius(radius)
      .cornerRadius(lightStrokeEffect + 2) || undefined;

  const labelRadius = radius * 0.825;
  const arcLabel = arc<PieArcDatum<Item>>().innerRadius(labelRadius).outerRadius(labelRadius);

  const arcs = pieLayout(data);

  // Calculate the angle for each slice
  function computeAngle(d: PieArcDatum<Item>) {
    return ((d.endAngle - d.startAngle) * 180) / Math.PI;
  }

  // Minimum angle to display text
  const minAngle = 20; // Adjust this value as needed

  const colors = ["#7e4cfe", "#895cfc", "#956bff", "#a37fff", "#b291fd", "#b597ff"]; // add more colors if needed

  return (
    <div className="relative">
      {/* Add a new div for centered text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <p className={`text-lg text-zinc-500`}>Total</p>
          <p className={`text-4xl transition-colors duration-300 font-bold`}>184</p>
        </div>
      </div>
      <svg
        viewBox={`-${radius} -${radius} ${radius * 2} ${radius * 2}`}
        className="max-w-[16rem] mx-auto overflow-visible"
      >
        {/* Slices */}
        {arcs.map((d, i) => (
          <ClientTooltip key={i}>
            <TooltipTrigger>
              <clipPath key={`donut-c1-clip-${i}`} id={`donut-c1-clip-${i}`}>
                <path d={arcClip(d) || undefined} />
                <linearGradient key={i} id={`donut-c1-gradient-${i}`}>
                  <stop offset="55%" stopColor={colors[i]} stopOpacity={0.95} />
                </linearGradient>
              </clipPath>
            </TooltipTrigger>
            <TooltipContent>
              <div>{d.data.name}</div>
              <div className="text-gray-500 text-sm">{d.data.value.toLocaleString("en-US")}</div>
            </TooltipContent>
          </ClientTooltip>
        ))}

        {/* Labels with conditional rendering */}
        {arcs.map((d, i) => {
          const angle = computeAngle(d);
          let centroid = arcLabel.centroid(d);
          if (d.endAngle > Math.PI) {
            centroid[0] += 10;
            centroid[1] += 0;
          } else {
            centroid[0] -= 20;
            centroid[1] -= 0;
          }

          return (
            <g key={i}>
              <g clipPath={`url(#donut-c1-clip-${i})`}>
                <path
                  fill={`url(#donut-c1-gradient-${i})`}
                  stroke="#ffffff33" // Lighter stroke for a 3D effect
                  strokeWidth={lightStrokeEffect} // Adjust stroke width for the desired effect
                  d={arcGenerator(d) || undefined}
                />
              </g>

              <g opacity={angle > minAngle ? 1 : 0}>
                <text transform={`translate(${centroid})`} textAnchor="middle" fontSize={38}>
                  <tspan y="-0.4em" fontWeight="600" fill="#eee">
                    {d.data.name}
                  </tspan>
                  {angle > minAngle && (
                    <tspan x={0} y="0.7em" fillOpacity={0.7} fill="#eee">
                      {d.data.value.toLocaleString("en-US")}%
                    </tspan>
                  )}
                </text>
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
