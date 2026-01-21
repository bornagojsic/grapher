export interface GraphNode {
  id: string;
  label: string;
  color: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface GraphLink {
  source: string;
  target: string;
  [key: string]: string;
}

export type GraphListItem = {
  id: string;
  name: string;
  description?: string;
  nodes: Array<GraphNode>;
  links: Array<GraphLink>;
  active: boolean;
  crossingNumber?: number;
};
