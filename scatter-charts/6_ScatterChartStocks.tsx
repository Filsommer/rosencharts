import { CSSProperties } from "react";
import { scaleLinear, max, min } from "d3";
import { ClientTooltip, TooltipContent, TooltipTrigger } from "../helpers/ClientTooltip";

const data = [
  { revenue: 10, value: 500, company: "Company A" },
  { revenue: 20, value: 800, company: "Company B" },
  { revenue: 30, value: 400, company: "Company C" },
  { revenue: 40, value: 650, company: "Company D" },
  { revenue: 50, value: 500, company: "Company E" },
  { revenue: 60, value: 850, company: "Spanish or vanish" },
  { revenue: 70, value: 450, company: "Company G" },
  { revenue: 80, value: 750, company: "Company H" },
  { revenue: 90, value: 350, company: "Company I" },
  { revenue: 100, value: 700, company: "Company J" },
];

export function Live6_ScatterChartStocks() {
  let xScale = scaleLinear()
    .domain([data[0].revenue, data[data.length - 1].revenue])
    .range([0, 100]);
  let yScale = scaleLinear()
    .domain([(min(data.map((d) => d.value)) ?? 0) - 1, (max(data.map((d) => d.value)) ?? 0) + 1])
    .range([100, 0]);

  return (
    <div
      className="relative h-72 w-full"
      style={
        {
          "--marginTop": "0px",
          "--marginRight": "0px",
          "--marginBottom": "25px",
          "--marginLeft": "25px",
        } as CSSProperties
      }
    >
      {/* Y axis */}
      <div
        className="absolute inset-0
        h-[calc(100%-var(--marginTop)-var(--marginBottom))]
        w-[var(--marginLeft)]
        translate-y-[var(--marginTop)]
        overflow-visible
      "
      >
        {yScale
          .ticks(3)
          .map(yScale.tickFormat(3, "d"))
          .map((value, i) => (
            <div
              key={i}
              style={{
                top: `${yScale(+value)}%`,
                left: "0%",
              }}
              className="absolute text-xs tabular-nums -translate-y-1/2 text-gray-500 w-full text-right pr-2"
            >
              {value}
            </div>
          ))}
      </div>

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
          {/* Horizontal grid lines */}
          {yScale
            .ticks(8)
            .map(yScale.tickFormat(8, "d"))
            .map((active, i) => (
              <g
                transform={`translate(0,${yScale(+active)})`}
                className="text-zinc-500/20 dark:text-zinc-700/50"
                key={i}
              >
                <line
                  x1={0}
                  x2={100}
                  stroke="currentColor"
                  strokeDasharray="6,5"
                  strokeWidth={0.5}
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            ))}

          {/* Vertical grid lines */}
          {xScale.ticks(8).map((active, i) => (
            <g
              transform={`translate(${xScale(active)},0)`}
              className="text-zinc-500/20 dark:text-zinc-700/50"
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

        {/* X Axis */}
        <div className="translate-y-1">
          {data.map((d, i) => {
            const isFirst = i === 0;
            const isLast = i === data.length - 1;
            if (!isFirst && !isLast && i % 5 !== 0) return null;
            return (
              <div key={i} className="overflow-visible text-zinc-500">
                <div
                  style={{
                    left: `${xScale(d.revenue)}%`,
                    top: "100%",
                    transform: `translateX(${
                      i === 0 ? "0%" : i === data.length - 1 ? "-100%" : "-50%"
                    })`, // The first and last labels should be within the chart area
                  }}
                  className="text-xs absolute"
                >
                  {d.revenue}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Images and Tooltips */}
      <div
        className="relative z-50
          h-[calc(100%-var(--marginTop)-var(--marginBottom))]
          w-[calc(100%-var(--marginLeft)-var(--marginRight))]
          translate-x-[var(--marginLeft)]
          translate-y-[var(--marginTop)]
          overflow-visible"
      >
        {data.map((d, index) => (
          <ClientTooltip key={index}>
            <TooltipTrigger>
              <div
                key={index}
                style={{
                  top: `${yScale(d.value)}%`,
                  left: `${xScale(d.revenue)}%`,
                  transform: "translate(-50%, -50%)",
                }}
                className="absolute rounded-full overflow-hidden size-7 text-sm text-gray-700 hover:size-9 transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
                  {companyLogos[index % companyLogos.length]}
                </svg>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div>{d.company}</div>
              <div className="text-gray-500 text-sm">
                {d.value} / {d.revenue}
              </div>
            </TooltipContent>
          </ClientTooltip>
        ))}
      </div>
    </div>
  );
}

const companyLogos = [
  <g key={0}>
    <path fill="currentColor" className="text-pink-400" d="M0 0h18v18H0V0Z" />
    <path
      fill="#fff"
      d="M3 5.308h1.895v4.439c0 .729.336 1.163.6 1.35-.28.248-1.306.465-1.946-.063-.377-.31-.549-.822-.549-1.303V5.308ZM14.369 9v-.616H15V6.846h-.631C14.21 5.77 13.249 5 12.158 5c-1.258 0-2.526.923-2.526 2.318v3.99c.358.05.928-.08 1.292-.38.377-.31.605-.831.605-1.312l-.003-.308H12V7.766h-.473l-.002-.205.002-.1c0-.317.154-.615.473-.615.32 0 .474.298.474.616V9c0 1.425 1.268 2.308 2.526 2.308v-1.7c-.32 0-.631-.29-.631-.608ZM7.5 6.846v2.43c0 .142-.07.34-.236.34-.15 0-.264-.198-.264-.34v-2.43H5.211v2.87c0 .527.18 1.194.998 1.411.82.218 1.1-.232 1.1-.232-.044.296-.129.513-.581.56a2.58 2.58 0 0 1-1.044-.146v1.538c.557.163 1.358.197 1.886.095 1.045-.201 1.746-1.07 1.746-2.226v-3.87H7.5Z"
    />
  </g>,
  <g key={1}>
    <path fill="currentColor" className="text-purple-400" d="M0 0h18v18H0V0Z" />
    <path
      fill="#fff"
      d="M13.865 10.01h-3.69a.643.643 0 0 1-.636-.64V5.64c0-.35.288-.641.635-.641h3.69c.348 0 .636.29.636.641v3.73a.643.643 0 0 1-.635.642Zm-3.391 1.066H8.988a.535.535 0 0 1-.527-.533V6.95a.596.596 0 0 0-.6-.606H4.1a.597.597 0 0 0-.599.606v3.8c0 .34.264.605.6.605h3.594c.287 0 .527.243.527.533v1.464c0 .182.144.34.336.34h1.929c.18 0 .335-.146.335-.34v-1.948c-.024-.182-.167-.327-.347-.327Z"
    />
  </g>,
  <g key={2}>
    <path fill="#432780" d="M0 0h18v18H0V0Z" />
    <path
      fill="#F6F8FD"
      d="M8.12 4.068c-1.867.31-3.38 1.679-3.97 3.58-.22.701-.185 2.167.062 2.895.65 1.892 2.209 3.171 4.171 3.42.344.044.867.037.867.037s-.4-.17-.444-.17c-.044 0-.423-.618-.423-1.026 0-.444.069-.645.35-.947l.603-.24-.679-.045c-.845-.151-1.655-.683-2.043-1.42-.317-.613-.334-1.679-.035-2.247.431-.835 1.188-1.395 2.007-1.501.58-.08.713-.16.915-.569.22-.444.22-.826 0-1.288-.264-.55-.493-.63-1.382-.48l.001.001Z"
    />
    <path
      fill="#00B5E2"
      d="M9.885 13.932c1.866-.31 3.38-1.678 3.969-3.58.22-.7.185-2.166-.062-2.895-.65-1.892-2.209-3.17-4.171-3.42-.344-.044-.758-.03-.758-.03l.313.18c.232.202.471.588.471.996 0 .322-.125.683-.346.875l-.461.301.574.042c.845.151 1.588.71 1.976 1.447.316.613.334 1.679.035 2.247-.431.835-1.188 1.395-2.007 1.502-.58.08-.713.16-.915.568-.22.444-.22.826 0 1.288.264.55.493.63 1.382.48v-.001Z"
    />
  </g>,
  <>
    <g key={3}>
      <path fill="#00A5DD" d="M0 0h18v18H0V0Z" />
      <path
        fill="#fff"
        d="M7.524 18c.693-1.69 1.292-3.406 1.292-5.858 0-.139 0-.244-.004-.35a1.952 1.952 0 0 1-.042-.079c-.68.554-2.014 1.597-3.035 1.597-1.23 0-1.75-.518-1.75-1.017 0-.43.426-.77.716-1l.083-.066c-.228-.135-.63-.297-.912-.297a.995.995 0 0 0-.335.06l-.01.004a.871.871 0 0 1-.272.052c-.212 0-.359-.199-.359-.482 0-.332.218-.642.534-.838.125-.088.26-.18.402-.276.558-.377 1.213-.82 1.692-1.357.484-.542.712-1.45.87-2.08.035-.136.066-.26.095-.363h.002c.129-.71.523-1.365.959-1.864C7.905 3.266 8.833 3 9.5 3c1.844-.145 5.11 1.842 3.5 15H7.524Z"
      />
      <path
        fill="url(#b)"
        d="M9.487 10.507c.447-.42.615-.642.615-1.052 0-.579-1.116-.877-1.202-2.282-.056-.93-.13-1.213-.262-1.213-.235 0-.49.576-1.117.576-.436 0-.303-.688-.505-.688-.212 0-.265 1.639-1.08 2.494-.928.972-1.88 1.423-2.305 1.672-.303.176-.35.295-.35.49 0 .064-.003.171.098.171.11 0 .198-.13.498-.13.724 0 1.466.83 2.332.83 1.034 0 2.776-1.473 2.987-1.669l.214.243c-.592.651-2.875 2.453-3.82 2.453-.383 0-.799-.112-.799-.283 0-.198.329-.472.53-.646a4.2 4.2 0 0 0-.258-.12c-.305.22-.71.447-.71.906 0 .48.696.644 1.209.652.47.007.909-.275 1.152-.397.86-.433 2.3-1.563 2.773-2.007Z"
      />
      <path
        fill="#0D4D84"
        d="M10.828 6.369c-.284 0-.381-.201-.381-.445 0-.348.13-.667.37-.667.204 0 .346.28.353.679.004.268-.14.433-.342.433Z"
      />
    </g>
    <defs>
      <linearGradient
        id="b"
        x1="5.225"
        x2="6.744"
        y1="8.225"
        y2="9.404"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FBCD94" />
        <stop offset="1" stopColor="#F68B1B" />
      </linearGradient>
    </defs>
  </>,

  <g key={4}>
    <path fill="currentColor" className="text-orange-400" d="M0 0h18v18H0V0Z" />
    <path
      fill="#fff"
      fillRule="evenodd"
      d="M13.05 9.339H8.439c-.209 0-.304.095-.304.27 0 .42.228.819.684 1.198.456.384.952.575 1.487.575a3.74 3.74 0 0 0 1.047-.171c.38-.119.703-.27.95-.442.228-.152.403-.228.537-.228.171 0 .342.095.494.304a1 1 0 0 1 .247.651c0 .476-.285.913-.874 1.35-1.031.784-2.23 1.165-3.584 1.165-1.368 0-2.514-.4-3.445-1.203a4.735 4.735 0 0 1-1.108-1.406A5.02 5.02 0 0 1 4 9.072c0-1.083.323-2.076.989-2.95a5.219 5.219 0 0 1 2.19-1.698 5.37 5.37 0 0 1 2.154-.423c1.24 0 2.285.348 3.16 1.051.442.342.785.76 1.05 1.259.305.551.457 1.085.457 1.602 0 .418-.096.76-.266 1.045-.191.248-.42.38-.684.38Zm-4.345-1.83h.99c.42 0 .63-.19.63-.57 0-.342-.094-.647-.308-.856-.209-.233-.456-.328-.799-.328-.361 0-.646.153-.855.442-.19.266-.285.533-.285.817 0 .191.038.324.133.419.095.038.247.076.494.076Z"
      clipRule="evenodd"
    />
  </g>,
  <>
    <g key={5} className="group is-published">
      <path fill="#F0F3FA" d="M0 0h18v18H0V0Z" />
      <path fill="#50C800" d="M0 0h18v18H0V0Z" />
      <path
        fill="#8EE000"
        d="M16 11.2V7.166a3.163 3.163 0 0 0-.686-1.036c.028-.42-.07-.868-.28-1.26a.434.434 0 0 0-.714-.07l-.462.504a2.292 2.292 0 0 0-.238-1.358c-.14-.266-.448-.308-.658-.098l-2.17 2.198-.07.07c-.952.868-2.436.896-3.332.112a3.082 3.082 0 0 0-.168-.182L5.038 3.85c-.21-.21-.504-.154-.644.098-.224.42-.308.896-.252 1.344l-.462-.49a.434.434 0 0 0-.7.07 2.24 2.24 0 0 0-.294 1.246c-.28.28-.518.616-.686.98v4.172a3.166 3.166 0 0 0 2.912 1.89h.14c1.288 0 2.394-.77 2.898-1.862h2.114a3.179 3.179 0 0 0 2.898 1.862h.098A3.18 3.18 0 0 0 16 11.2Z"
      />
      <path
        fill="#F0F3FA"
        d="M5.066 6.38c1.204 0 2.184.98 2.184 2.211v1.302c0 1.218-.98 2.212-2.184 2.212a2.196 2.196 0 0 1-2.198-2.212V8.591c0-1.232.98-2.212 2.198-2.212Zm7.868 0c1.204 0 2.184.98 2.184 2.211v1.302c0 1.218-.98 2.212-2.184 2.212a2.193 2.193 0 0 1-2.184-2.212V8.591c0-1.232.98-2.212 2.184-2.212Z"
      />
      <path
        fill="currentColor"
        className="fill-[#4B4B4B]"
        d="M5.276 7.642c.602 0 1.092.476 1.092 1.05v1.12c0 .588-.476 1.05-1.092 1.05a1.079 1.079 0 0 1-1.092-1.05v-1.12c0-.574.49-1.05 1.092-1.05Z"
      />
      <path
        fill="#F48000"
        d="M9 10.19c.658 0 1.204.533 1.204 1.205v.42a1.204 1.204 0 0 1-2.408 0v-.42c0-.672.546-1.204 1.204-1.204Z"
      />
      <path
        fill="#FFC200"
        d="M7.348 11.507c.14-.77.84-1.316 1.694-1.316.77 0 1.47.56 1.61 1.316v.056c0 .056 0 .07-.056.07l-1.54.28h-.098l-1.554-.28c-.042 0-.056-.014-.056-.07v-.056Z"
      />
      <path
        fill="currentColor"
        className="fill-[#4B4B4B]"
        d="M12.724 7.642c.602 0 1.092.476 1.092 1.05v1.12c0 .588-.49 1.05-1.092 1.05a1.078 1.078 0 0 1-1.106-1.05v-1.12c0-.574.504-1.05 1.106-1.05Z"
      />
    </g>
  </>,
];
