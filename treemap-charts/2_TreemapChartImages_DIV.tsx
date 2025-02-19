import React from "react";
import * as d3 from "d3";
import { ClientTooltip, TooltipContent, TooltipTrigger } from "../helpers/ClientTooltip";

interface ExtendedHierarchyNode<T> extends d3.HierarchyNode<T> {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}

type Subtopic = {
  name: string;
  value: number;
  logo: string;
};

type Topic = {
  topic: string;
  subtopics: Subtopic[];
};

type HierarchyData = {
  name: string;
  value: number;
  logo: string;
  children: {
    name: string;
    children: Subtopic[];
  }[];
};

const rawData: Topic[] = [
  {
    topic: "Tech",
    subtopics: [
      {
        name: "Apple",
        value: 100,
        logo: "https://etoro-cdn.etorostatic.com/market-avatars/1001/1001_494D5A_F7F7F7.svg",
      },
      {
        name: "Mercedes",
        value: 120,
        logo: "https://etoro-cdn.etorostatic.com/market-avatars/1206/1206_2F3350_F7F7F7.svg",
      },
      {
        name: "Palantir",
        value: 110,
        logo: "https://etoro-cdn.etorostatic.com/market-avatars/7991/7991_2C2C2C_F7F7F7.svg",
      },
    ],
  },
  {
    topic: "Financials",
    subtopics: [
      {
        name: "Nvidia",
        value: 70,
        logo: "https://etoro-cdn.etorostatic.com/market-avatars/1137/1137_76B900_F7F7F7.svg",
      },
      {
        name: "AMD",
        value: 60,
        logo: "https://etoro-cdn.etorostatic.com/market-avatars/1832/1832_2C2C2C_F7F7F7.svg",
      },
      {
        name: "Google",
        value: 20,
        logo: "https://etoro-cdn.etorostatic.com/market-avatars/1002/1002_3183FF_F7F7F7.svg",
      },
    ],
  },
  {
    topic: "Energy",
    subtopics: [
      {
        name: "Apple",
        value: 70,
        logo: "https://etoro-cdn.etorostatic.com/market-avatars/1001/1001_494D5A_F7F7F7.svg",
      },
      {
        name: "Mercedes",
        value: 50,
        logo: "https://etoro-cdn.etorostatic.com/market-avatars/1206/1206_2F3350_F7F7F7.svg",
      },
      {
        name: "Palantir",
        value: 20,
        logo: "https://etoro-cdn.etorostatic.com/market-avatars/7991/7991_2C2C2C_F7F7F7.svg",
      },
      {
        name: "Google",
        value: 100,
        logo: "https://etoro-cdn.etorostatic.com/market-avatars/1002/1002_3183FF_F7F7F7.svg",
      },
    ],
  },
];
const colors = [
  "bg-violet-500 dark:bg-violet-500",
  "bg-pink-400 dark:bg-pink-400",
  "bg-orange-400 dark:bg-orange-400",
];

const VISIBLE_TEXT_WIDTH = 10;
const VISIBLE_TEXT_HEIGHT = 10;

export function Live2_TreemapChartImages_DIV() {
  // Transform the raw data into a hierarchical structure
  const data: HierarchyData = {
    name: "root",
    value: 0,
    logo: "",
    children: rawData.map((topic) => ({
      name: topic.topic,
      children: topic.subtopics,
    })),
  };

  // Create root node
  const root = d3
    .hierarchy(data)
    .sum((d) => d.value)
    .sort((a, b) => b.value! - a.value!);

  // Compute the treemap layout
  d3
    .treemap<HierarchyData>()
    .size([100, 100])
    .paddingInner(0.75) // Padding between subtopics
    .paddingOuter(1) // Padding between topics
    .round(false)(root);

  const leaves = root.leaves() as ExtendedHierarchyNode<HierarchyData>[];

  // Color scale
  const color = d3
    .scaleOrdinal()
    .domain(rawData.map((d) => d.topic))
    .range(colors);

  return (
    <div className="relative w-full h-[250px]">
      {leaves.map((leaf, i) => {
        const leafWidth = leaf.x1 - leaf.x0;
        const leafHeight = leaf.y1 - leaf.y0;

        return (
          <ClientTooltip key={i}>
            <TooltipTrigger>
              <div
                key={i}
                className={color(leaf.parent!.data.name) as string}
                style={{
                  position: "absolute",
                  left: `${leaf.x0}%`,
                  top: `${leaf.y0}%`,
                  width: `${leafWidth}%`,
                  height: `${leafHeight}%`,
                  borderRadius: "6px",
                  padding: "2px",
                  boxSizing: "border-box",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                title={`${leaf.data.name}\n${d3.format(",d")(leaf.value!)}`}
              >
                {leafWidth > VISIBLE_TEXT_WIDTH && leafHeight > VISIBLE_TEXT_HEIGHT && (
                  <img src={leaf.data.logo} alt={leaf.data.name} className="size-9 object-cover" />
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div>{leaf.data.name}</div>
              <div className="text-gray-500 text-sm">{leaf.value}</div>
            </TooltipContent>
          </ClientTooltip>
        );
      })}
    </div>
  );
}
