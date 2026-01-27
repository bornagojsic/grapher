import type { GraphListItem } from "@/types/graph";

export interface GraphOperation {
  id: string;
  name: string;
  description: string;
  icon?: string;
  execute(graph: GraphListItem, theme: string, params?: any): Promise<void>; // eslint-disable-line @typescript-eslint/no-explicit-any
  validate?(graph: GraphListItem, params?: any): boolean; // eslint-disable-line @typescript-eslint/no-explicit-any
}
