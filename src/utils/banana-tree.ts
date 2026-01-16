import type { GraphLink, GraphNode } from "@/types/graph";

export default function createBananaTree(
  n: number,
  k: number,
  defaultColor: string,
): { nodes: GraphNode[]; links: GraphLink[] } {
  const nodes = [{ id: "r", label: "r", color: defaultColor }];
  const links = [];

  for (let i = 1; i <= n; i++) {
    nodes.push({ id: `a_{${i}}`, label: `a_{${i}}`, color: defaultColor });
  }
  for (let i = 1; i <= n; i++) {
    links.push({ source: `r`, target: `a_{${i}}` });
  }

  if (k === 1) {
    return { nodes, links };
  }

  for (let i = 1; i <= n; i++) {
    nodes.push({ id: `c_{${i}}`, label: `c_{${i}}`, color: defaultColor });
  }
  for (let i = 1; i <= n; i++) {
    links.push({ source: `a_{${i}}`, target: `c_{${i}}` });
  }

  for (let j = 2; j < k; j++) {
    for (let i = 1; i <= n; i++) {
      nodes.push({
        id: `l_{${i},${j - 1}}`,
        label: `l_{${i},${j - 1}}`,
        color: defaultColor,
      });
      links.push({ source: `c_{${i}}`, target: `l_{${i},${j - 1}}` });
    }
  }

  return { nodes, links };
}
