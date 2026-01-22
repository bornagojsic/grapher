import type { GraphListItem } from "@/types/graph";
import { graphManipulationService } from "./graphManipulationService";

function getGraphAdjacencyLists(graph: GraphListItem): Map<number, number[]> {
  const adjacencyLists = new Map<number, number[]>();

  const nodes = graph.nodes.map((node) => node.id);

  const nodeToIntMap = new Map<string, number>();
  for (let i = 0; i < nodes.length; i++) {
    nodeToIntMap.set(nodes[i], i);
  }

  graph.links.forEach((edge) => {
    const { source, target } = edge;
    const sourceIndex = nodeToIntMap.get(source);
    const targetIndex = nodeToIntMap.get(target);
    if (sourceIndex === undefined || targetIndex === undefined) {
      throw new Error(`Node not found: ${source} or ${target}`);
    }
    if (!adjacencyLists.has(sourceIndex)) {
      adjacencyLists.set(sourceIndex, []);
    }
    if (!adjacencyLists.has(targetIndex)) {
      adjacencyLists.set(targetIndex, []);
    }
    adjacencyLists.get(sourceIndex)!.push(targetIndex);
    adjacencyLists.get(targetIndex)!.push(sourceIndex);
  });

  return adjacencyLists;
}

export const crossingNumberOperation = {
  id: "crossing-number",
  name: "Crossing Number",
  description: "Calculate the crossing number of the graph",
  icon: "❎",
  async execute(graph: GraphListItem): Promise<void> {
    console.log("Current crossing number:", graph.crossingNumber);

    if (graph.crossingNumber !== undefined && graph.crossingNumber !== null) {
      console.log("Crossing Number:", graph.crossingNumber);
    } else {
      // local url

      // const PORT = 7271;
      // const HOST = "localhost";
      // const PATH = "/crossing-num";
      // const URL = `http://${HOST}:${PORT}${PATH}`;

      // prod URL
      const URL = "https://grapher-api.bornagojsic.dev/crossing-num";

      const adjacencyLists = getGraphAdjacencyLists(graph);
      const json = JSON.stringify(Object.fromEntries(adjacencyLists));
      const fullJson = `{ "graph": ${json} }`;

      console.log("Full JSON:", fullJson);

      const req = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: fullJson,
      };

      const response = await fetch(URL, req);

      if (!response.ok) {
        throw new Error(`Failed to calculate the crossing number`);
      }

      const result = await response.json();
      console.log("Crossing Number:", result);

      if (!("crossing_number" in result)) {
        throw new Error(`Failed to get the crossing number`);
      }

      graph.crossingNumber = result.crossing_number;

      console.log("Set crossing number!");

      if (graph.crossingNumber === 0) {
        alert("The crossing number is 0 (i.e., the graph is planar).");
      } else {
        alert(`The crossing number is ${graph.crossingNumber}.`);
      }
    }
  },
};

// Register the operation when this module is imported
graphManipulationService.registerOperation(crossingNumberOperation);
