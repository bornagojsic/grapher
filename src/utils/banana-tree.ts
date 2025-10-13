import type { GraphLink, GraphNode } from "@/components/ForceGraph";

export default function createBananaTree(
  n: number,
  k: number,
): { nodes: GraphNode[]; links: GraphLink[] } {
  const nodes = [{ id: "r" }];
  const links = [];

  for (let i = 1; i <= n; i++) {
    nodes.push({ id: `a_{${i}}` });
  }
  for (let i = 1; i <= n; i++) {
    links.push({ source: `r`, target: `a_{${i}}` });
  }

  if (k === 1) {
    return { nodes, links };
  }

  for (let i = 1; i <= n; i++) {
    nodes.push({ id: `c_{${i}}` });
  }
  for (let i = 1; i <= n; i++) {
    links.push({ source: `a_{${i}}`, target: `c_{${i}}` });
  }

  for (let j = 2; j < k; j++) {
    for (let i = 1; i <= n; i++) {
      nodes.push({ id: `l_{${i},${j - 1}}` });
      links.push({ source: `c_{${i}}`, target: `l_{${i},${j - 1}}` });
    }
  }

  return { nodes, links };
}
