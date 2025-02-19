import React, { CSSProperties } from "react";

const data = [
  {
    key: "Utils",
    value: 17.1,
    color: "from-fuchsia-300/80 to-fuchsia-400/80 dark:from-fuchsia-500 dark:to-fuchsia-700",
  },
  {
    key: "Tech",
    value: 14.3,
    color: "from-violet-300 to-violet-400 dark:from-violet-500 dark:to-violet-700",
  },
  {
    key: "Energy",
    value: 27.1,
    color: "from-blue-300 to-blue-400 dark:from-blue-500 dark:to-blue-700",
  },
  {
    key: "Cyclicals",
    value: 42.5,
    color: "from-sky-300 to-sky-400 dark:from-sky-500 dark:to-sky-700",
  },
  {
    key: "Fuel",
    value: 12.7,
    color: "from-orange-200 to-orange-300 dark:from-amber-500 dark:to-amber-700",
  },
];

export function Live4_BarChartBreakdown() {
  const gap = 0.3; // gap between bars
  const totalValue = data.reduce((acc, d) => acc + d.value, 0);
  const barHeight = 54;
  const totalWidth = totalValue + gap * (data.length - 1);
  let cumulativeWidth = 0;

  const cornerRadius = 4; // Adjust this value to change the roundness

  return (
    <div
      className="relative h-[var(--height)] mb-1.5"
      style={
        {
          "--marginTop": "0px",
          "--marginRight": "0px",
          "--marginBottom": "0px",
          "--marginLeft": "0px",
          "--height": `${barHeight}px`,
        } as CSSProperties
      }
    >
      {/* Chart Area */}
      <div
        className="absolute inset-0 
          h-[calc(100%-var(--marginTop)-var(--marginBottom))]
          w-[calc(100%-var(--marginLeft)-var(--marginRight))]
          translate-x-[var(--marginLeft)]
          translate-y-[var(--marginTop)]
          overflow-visible
        "
      >
        {/* Bars with Gradient Fill and Lighter Stroke for 3D Effect */}
        {data.map((d, index) => {
          const barWidth = (d.value / totalWidth) * 100;
          const xPosition = cumulativeWidth;
          cumulativeWidth += barWidth + gap;

          return (
            <div
              key={index}
              className="relative"
              style={{
                width: `${barWidth}%`,
                height: `${barHeight}px`,
                left: `${xPosition}%`,
                position: "absolute",
              }}
            >
              <div
                className={`bg-gradient-to-b ${d.color}`}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: `${cornerRadius}px`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: `${barHeight / 5}px`,
                  left: "50%",
                  transform: "translateX(-50%)",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                {d.key}
              </div>
              <div
                style={{
                  position: "absolute",
                  top: `${barHeight / 2}px`,
                  left: "50%",
                  transform: "translateX(-50%)",
                  color: "white",
                  fontSize: "12px",
                  fontWeight: "bold",
                  textAlign: "center",
                  fontFamily: "monospace",
                }}
              >
                {d.value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
