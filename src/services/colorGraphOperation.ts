import type { GraphListItem, GraphNode } from "@/types/graph";
import { graphManipulationService } from "./graphManipulationService";

function getRandomColor(): string {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export const colorGraphOperation = {
  id: "color-graph",
  name: "Color the graph",
  description: "Apply random colors to all nodes in the graph",
  icon: "🎨",
  async execute(graph: GraphListItem): Promise<void> {
    const updatedNodes = graph.nodes.map((node: GraphNode) => ({
      ...node,
      color: getRandomColor(),
    }));

    // Update the graph with new node colors
    graph.nodes = updatedNodes;
  },
};

// Register the operation when this module is imported
graphManipulationService.registerOperation(colorGraphOperation);
