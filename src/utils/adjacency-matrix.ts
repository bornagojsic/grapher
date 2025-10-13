function createAdjacencyMatrix(
  nodes: { id: string }[],
  links: { source: string; target: string }[],
) {
  const matrix: number[][] = Array.from({ length: nodes.length }, () =>
    Array(nodes.length).fill(0),
  );

  links.forEach((link) => {
    const sourceIndex = nodes.findIndex((node) => node.id === link.source);
    const targetIndex = nodes.findIndex((node) => node.id === link.target);
    if (sourceIndex !== -1 && targetIndex !== -1) {
      matrix[sourceIndex][targetIndex] = 1;
    }
  });

  return matrix;
}

function createGraphFromAdjacencyMatrix(
  matrix: number[][],
  nodes: { id: string }[],
) {
  const links: { source: string; target: string }[] = [];

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] === 1) {
        links.push({ source: nodes[i].id, target: nodes[j].id });
      }
    }
  }

  return { nodes, links };
}

export { createAdjacencyMatrix, createGraphFromAdjacencyMatrix };
