import React, { CSSProperties } from "react";

const data = [
  {
    key: "Gross Revenue",
    value: 47.1,
    color: "from-pink-300 to-pink-400 dark:from-pink-500 dark:to-pink-700",
  },
  {
    key: "Net Revenue",
    value: 32.3,
    color: "from-purple-400 to-purple-500 dark:from-purple-500 dark:to-purple-700",
  },
  {
    key: "EBITDA",
    value: 27.1,
    color: "from-indigo-400 to-indigo-500 dark:from-indigo-500 dark:to-indigo-700",
  },
  {
    key: "Gross Profit",
    value: 17.5,
    color: "from-sky-400 to-sky-500 dark:from-sky-500 dark:to-sky-700",
  },
  {
    key: "Net Profit",
    value: 12.7,
    color: "from-orange-300 to-orange-400 dark:from-amber-500 dark:to-amber-700",
  },
].sort((a, b) => b.value - a.value);

export function Live5_FunnelChart() {
  const gap = 0.3; // gap between bars
  const maxFrequency = Math.max(...data.map((d) => d.value));
  const barHeight = 54;
  let cumulativeHeight = 0;

  return (
    <div
      className="relative mt-4 h-72"
      style={
        {
          "--marginTop": "8px",
          "--marginRight": "0px",
          "--marginBottom": "0px",
          "--marginLeft": "0px",
          "--height": `${barHeight * data.length + gap * (data.length - 1)}px`,
        } as CSSProperties
      }
    >
      {/* Bars with Gradient Fill and Lighter Stroke for 3D Effect */}
      {data.map((d, index) => {
        const barWidth = (d.value / maxFrequency) * 100;
        const yPosition = cumulativeHeight;
        cumulativeHeight += barHeight + gap + 2;

        return (
          <div
            key={index}
            className={`relative bg-gradient-to-b ${d.color} rounded-md`}
            style={{
              position: "absolute",
              top: `${yPosition}px`,
              left: `${(100 - barWidth) / 2}%`,
              width: `${barWidth}%`,
              height: `${barHeight}px`,
              // clipPath: `polygon(0% 0%, 100% 0%, 96% 100%, 4% 100%)`,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: `${barHeight / 6}px`,
                width: "100%",
                textAlign: "center",
                color: "white",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              {d.key}
            </div>
            <div
              style={{
                position: "absolute",
                top: `${barHeight / 2}px`,
                width: "100%",
                textAlign: "center",
                color: "white",
                fontSize: "12px",
                fontWeight: "bold",
                fontFamily: "monospace",
              }}
            >
              {d.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}
