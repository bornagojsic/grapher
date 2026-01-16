import type { GraphListItem } from "@/types/graph";

export default function parseEdgeList(
  edgeList: string,
  defaultColor: string,
): GraphListItem {
  const nodeNames = Array.from(
    new Set(
      edgeList
        .split(";")
        .flatMap((edge) => edge.split("-").map((part) => part.trim())),
    ),
  );

  const nodes = nodeNames.map((name) => ({
    id: name,
    name: name,
    label: name,
    color: defaultColor,
  }));

  const edges = edgeList.split(";").map((edge) => {
    const parts = edge.split("-");
    return {
      source: parts[0].trim(),
      target: parts[1].trim(),
    };
  });

  return {
    id: crypto.randomUUID(),
    name: "Edge Graph",
    description: `Graph with edges: ${edgeList}`,
    active: false,
    links: edges,
    nodes,
  };
}
