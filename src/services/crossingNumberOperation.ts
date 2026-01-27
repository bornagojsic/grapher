import type { GraphListItem } from "@/types/graph";
import { graphManipulationService } from "./graphManipulationService";
import { fetchGraphService } from "@/utils/fetch-graph-service";

export const crossingNumberOperation = {
  id: "crossing-number",
  name: "Crossing Number",
  description: "Calculate the crossing number of the graph",
  icon: "❎",
  async execute(graph: GraphListItem, theme: string): Promise<void> {
    console.log("Current crossing number:", graph.crossingNumber);

    console.log("Current color:", theme);

    if (graph.crossingNumber !== undefined && graph.crossingNumber !== null) {
      console.log("Crossing Number:", graph.crossingNumber);
    } else {
      // local URL

      // const PORT = 7271;
      // const HOST = "localhost";
      // const PATH = "/crossing-num";
      // const url = `http://${HOST}:${PORT}${PATH}`;

      // prod URL

      const url = "https://grapher-api.bornagojsic.dev/crossing-num";
      const response = await fetchGraphService({ graph, url });

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
