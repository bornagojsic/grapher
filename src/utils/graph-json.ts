import type { GraphListItem } from "@/types/graph";

export function getGraphAdjacencyLists(
  graph: GraphListItem,
): Map<number, number[]> {
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

export default function getGraphJson(graph: GraphListItem) {
  const adjacencyLists = getGraphAdjacencyLists(graph);
  const json = JSON.stringify(Object.fromEntries(adjacencyLists));
  return `{ "graph": ${json} }`;
}
