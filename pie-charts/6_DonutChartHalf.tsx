import { pie, arc, PieArcDatum } from "d3";

type Item = { name: string; value: number };
const data: Item[] = [
  { name: "AAPL", value: 30 },
  { name: "BTC", value: 22 },
  { name: "GOLD", value: 11 },
  { name: "PLTR", value: 9 },
  { name: "ADA", value: 7 },
  { name: "MSFT", value: 3 },
];

export function Live6_DonutChartHalf() {
  const radius = 420; // Chart base dimensions
  const gap = 0.01; // Gap between slices
  const lightStrokeEffect = 10; // 3d light effect around the slice

  // Modify the pie layout to create a half donut
  const pieLayout = pie<Item>()
    .value((d) => d.value)
    .padAngle(gap)
    .startAngle(-Math.PI / 2) // Start at -90 degrees
    .endAngle(Math.PI / 2); // End at 90 degrees

  // Adjust innerRadius to create a donut shape
  const innerRadius = radius / 1.625;
  const arcGenerator = arc<PieArcDatum<Item>>()
    .innerRadius(innerRadius)
    .outerRadius(radius)
    .cornerRadius(lightStrokeEffect + 2);

  // Create an arc generator for the clip path that matches the outer path of the arc
  const arcClip =
    arc<PieArcDatum<Item>>()
      .innerRadius(innerRadius + lightStrokeEffect / 2)
      .outerRadius(radius)
      .cornerRadius(lightStrokeEffect + 2) || undefined;

  const labelRadius = (innerRadius + radius) / 2;
  const arcLabel = arc<PieArcDatum<Item>>().innerRadius(labelRadius).outerRadius(labelRadius);

  const arcs = pieLayout(data);

  // Calculate the angle for each slice
  function computeAngle(d: PieArcDatum<Item>) {
    return ((d.endAngle - d.startAngle) * 180) / Math.PI;
  }

  // Minimum angle to display text
  const minAngle = 18; // Adjust this value as needed

  const colors = ["#7e4cfe", "#895cfc", "#956bff", "#a37fff", "#b291fd", "#b597ff"];

  return (
    <div className="relative">
      <svg
        viewBox={`-${radius} -${radius} ${radius * 2} ${radius}`}
        className="max-w-[16rem] mx-auto overflow-visible"
      >
        {/* Define clip paths and colors for each slice */}
        <defs>
          {arcs.map((d, i) => (
            <clipPath key={`half-donut-clip-${i}`} id={`half-donut-clip-${i}`}>
              <path d={arcClip(d) || undefined} />
              <linearGradient key={i} id={`half-donut-gradient-${i}`}>
                <stop offset="55%" stopColor={colors[i]} stopOpacity={0.95} />
              </linearGradient>
            </clipPath>
          ))}
        </defs>

        {/* Slices */}
        {arcs.map((d, i) => {
          const angle = computeAngle(d);
          let centroid = arcLabel.centroid(d);
          if (d.endAngle > Math.PI) {
            centroid[0] += 10;
            centroid[1] += 20;
          } else {
            centroid[0] += 10;
            centroid[1] -= 0;
          }
          return (
            <g key={i}>
              {/* Use the clip path on this group or individual path */}
              <g key={i} clipPath={`url(#half-donut-clip-${i})`}>
                <path
                  fill={`url(#half-donut-gradient-${i})`}
                  stroke="#ffffff33" // Lighter stroke for a 3D effect
                  strokeWidth={lightStrokeEffect} // Adjust stroke width for the desired effect
                  d={arcGenerator(d) || undefined}
                />
              </g>
              {/* Labels with conditional rendering */}
              <g opacity={angle > minAngle ? 1 : 0}>
                <text transform={`translate(${centroid})`} textAnchor="middle" fontSize={38}>
                  <tspan y="-0.4em" fontWeight="600" fill={"#eee"}>
                    {d.data.name}
                  </tspan>
                  {angle > minAngle && (
                    <tspan x={0} y="0.7em" fillOpacity={0.7} fill={"#eee"}>
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
