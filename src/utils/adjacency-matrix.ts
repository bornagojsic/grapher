import parseEdgeList from "@/utils/edge-list";
import type { GraphListItem } from "@/types/graph";

export default function parseAdjacencyMatrix(
  adjacencyMatrix: string,
  defaultColor: string,
): GraphListItem {
  const rows = adjacencyMatrix.split("\n");

  let edgeList = "";

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i].split(" ");
    for (let j = i + 1; j < row.length; j++) {
      if (row[j] === "1") {
        edgeList += `${i + 1}-${j + 1};`;
      }
    }
  }

  edgeList = edgeList.slice(0, -1);

  return parseEdgeList(edgeList, defaultColor);
}
