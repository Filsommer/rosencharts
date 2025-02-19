import { pie, arc, PieArcDatum } from "d3";

type Item = { name: string; value: number };

export function Live8_DonutChartFillable() {
  const radius = 420; // Chart base dimensions
  const lightStrokeEffect = 10; // 3d light effect around the slice

  // Update the data order to fill clockwise
  const data = [
    { name: "Filled", value: 31 },
    { name: "Empty", value: 70 },
  ];

  // Modify the pie layout to create a full donut filling clockwise from 12 o'clock
  const pieLayout = pie<Item>()
    .value((d) => d.value)
    .startAngle(0) // Start at 0 degrees (12 o'clock)
    .endAngle(2 * Math.PI) // End at 360 degrees (12 o'clock again)
    .sort((a, b) => a.value - b.value)
    .padAngle(0.0);

  // Adjust innerRadius to create a donut shape
  const innerRadius = radius / 1.625;
  const arcGenerator = arc<PieArcDatum<Item>>().innerRadius(innerRadius).outerRadius(radius);

  // Create an arc generator for the clip path that matches the outer path of the arc
  const arcClip =
    arc<PieArcDatum<Item>>()
      .innerRadius(innerRadius + lightStrokeEffect / 2)
      .outerRadius(radius)
      .cornerRadius(lightStrokeEffect + 2) || undefined;

  const arcs = pieLayout(data);

  const colors = {
    purple: "fill-violet-600 dark:fill-violet-500",
    gray: "fill-[#e0e0e0] dark:fill-zinc-700",
  };

  return (
    <div className="relative">
      <svg
        viewBox={`-${radius} -${radius} ${radius * 2} ${radius * 2}`}
        className="max-w-[16rem] mx-auto overflow-visible"
      >
        <defs>
          {arcs.map((d, i) => (
            <clipPath key={`fillable-donut-clip-${i}`} id={`fillable-donut-clip-${i}`}>
              <path d={arcClip(d) || undefined} />
            </clipPath>
          ))}
        </defs>
        <g>
          {/* Slices */}
          {arcs.map((d, i) => (
            <g key={i} clipPath={`url(#fillable-donut-clip-${i})`}>
              <path
                className={`stroke-white/30 dark:stroke-zinc-400/10 ${
                  i === 1 ? colors.gray : colors.purple
                }`}
                strokeWidth={lightStrokeEffect}
                d={arcGenerator(d) || undefined}
              />
            </g>
          ))}
        </g>
      </svg>
      {/* Centered value display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-semibold leading-5">Filled</span>
        <div className="text-xl font-bold">
          <span className="text-violet-600 dark:text-violet-400">{data[0].value}</span>
          <span className="text-zinc-400 dark:text-zinc-600"> / 100</span>
        </div>
      </div>
    </div>
  );
}
