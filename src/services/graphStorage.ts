import type { GraphListItem } from "@/types/graph";

const GRAPHS_STORAGE_KEY = "graphsList";
const ACTIVE_GRAPH_ID_STORAGE_KEY = "activeGraphId";

/**
 * Retrieves graphs from localStorage
 * @returns Array of graphs or null if not found or invalid
 */
export function getGraphsFromStorage(): GraphListItem[] | null {
  try {
    const stored = localStorage.getItem(GRAPHS_STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return null;
  } catch (error) {
    console.error("Failed to parse graphs from localStorage:", error);
    return null;
  }
}

/**
 * Saves graphs to localStorage
 * @param graphs Array of graphs to save
 */
export function saveGraphsToStorage(graphs: GraphListItem[]): void {
  try {
    localStorage.setItem(GRAPHS_STORAGE_KEY, JSON.stringify(graphs));
  } catch (error) {
    console.error("Failed to save graphs to localStorage:", error);
  }
}

/**
 * Retrieves the active graph ID from localStorage
 * @returns Active graph ID or null if not found
 */
export function getActiveGraphIdFromStorage(): string | null {
  return localStorage.getItem(ACTIVE_GRAPH_ID_STORAGE_KEY);
}

/**
 * Saves the active graph ID to localStorage
 * @param graphId The ID of the active graph
 */
export function saveActiveGraphIdToStorage(graphId: string): void {
  try {
    localStorage.setItem(ACTIVE_GRAPH_ID_STORAGE_KEY, graphId);
  } catch (error) {
    console.error("Failed to save active graph ID to localStorage:", error);
  }
}
