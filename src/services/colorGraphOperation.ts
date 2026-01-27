import type { GraphListItem, GraphNode } from "@/types/graph";
import { graphManipulationService } from "./graphManipulationService";
import { fetchGraphService } from "@/utils/fetch-graph-service";
import { getTextColorForBackground } from "@/utils/textColor";
import { rgbStringHueDifference } from "@/utils/color";

function getRandomColor(): string {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getMatchingColor(theme: string): string {
  const textColor = theme === "light" ? "black" : "white";

  let color = getRandomColor();
  while (getTextColorForBackground(color) !== textColor) {
    color = getRandomColor();
  }
  return color;
}

function getColors(n: number, theme: string): string[] {
  const colors = [];

  let lastColor = getMatchingColor(theme);
  colors.push(lastColor);

  for (let i = 0; i <= n; i++) {
    let newColor = getMatchingColor(theme);
    while (rgbStringHueDifference(lastColor, newColor) < 40) {
      newColor = getMatchingColor(theme);
    }
    console.log(lastColor, newColor);
    console.log(rgbStringHueDifference(lastColor, newColor));
    colors.push(newColor);
    lastColor = newColor;
  }

  return colors;
}

async function getProperColoring(
  graph: GraphListItem,
  theme: string,
): Promise<Map<string, string>> {
  const url = "https://grapher-api.bornagojsic.dev/graph-coloring";
  const response = await fetchGraphService({ graph, url });

  if (!response.ok) {
    throw new Error(`Failed to calculate the crossing number`);
  }

  const result = await response.json();

  if (!("graph" in result)) {
    throw new Error(`Failed to get the crossing number`);
  }

  const coloringWithNumbers: Record<string, string> = result.graph;

  console.log("Current coloring:", coloringWithNumbers);

  const numberOfColors =
    Math.max(...Object.keys(coloringWithNumbers).map(Number)) + 1;

  const colors = getColors(numberOfColors, theme);

  const coloring = new Map<string, string>(
    Object.entries(coloringWithNumbers).map(([node, colorIndex]) => [
      node,
      colors[parseInt(colorIndex, 10)], // colorIndex is already a number
    ]),
  );

  return coloring;
}

export const colorGraphOperation = {
  id: "color-graph",
  name: "Color the graph",
  description: "Apply an equitable vertex coloring to the graph",
  icon: "🎨",
  async execute(graph: GraphListItem, theme: string): Promise<void> {
    const coloring = await getProperColoring(graph, theme);

    console.log("Proper coloring:", coloring);

    const updatedNodes = graph.nodes.map((node: GraphNode, index: number) => ({
      ...node,
      color: coloring.get(index.toString())!,
    }));

    // Update the graph with new node colors
    graph.nodes = updatedNodes;
  },
};

// Register the operation when this module is imported
graphManipulationService.registerOperation(colorGraphOperation);
