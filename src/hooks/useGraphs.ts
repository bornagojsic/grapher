import { useState, useCallback } from "react";
import type { GraphListItem, GraphNode } from "@/types/graph";
import {
  getGraphsFromStorage,
  saveGraphsToStorage,
  getActiveGraphIdFromStorage,
  saveActiveGraphIdToStorage,
} from "@/services/graphStorage";
import createBananaTree from "@/utils/banana-tree";

interface UseGraphsOptions {
  defaultColor: string;
}

interface UseGraphsReturn {
  graphsList: GraphListItem[];
  activeGraph: GraphListItem;
  selectGraph: (graph: GraphListItem) => void;
  addGraph: (graph: GraphListItem) => void;
  removeGraph: (graph: GraphListItem) => void;
  updateActiveGraph: (updater: (graph: GraphListItem) => GraphListItem) => void;
  updateNodeInActiveGraph: (
    nodeId: string,
    updates: Partial<GraphNode>,
  ) => void;
  removeNodeFromActiveGraph: (nodeId: string) => void;
  saveActiveGraph: () => void;
}

/**
 * Custom hook for managing graph state and operations
 */
export function useGraphs({ defaultColor }: UseGraphsOptions): UseGraphsReturn {
  // Initialize default graph list
  const getDefaultGraphsList = useCallback((): GraphListItem[] => {
    const defaultGraph: GraphListItem = {
      id: "sample-graph",
      name: "B(3, 2)",
      description: "Sample Banana Tree Graph with n=3, k=2",
      active: true,
      ...createBananaTree(3, 2, defaultColor),
    };

    const storedGraphs = getGraphsFromStorage();
    if (storedGraphs && storedGraphs.length > 0) {
      return storedGraphs;
    }

    return [defaultGraph];
  }, [defaultColor]);

  const [graphsList, setGraphsList] = useState<GraphListItem[]>(() =>
    getDefaultGraphsList(),
  );

  // Initialize active graph
  const getDefaultActiveGraph = useCallback((): GraphListItem => {
    const graphs = getDefaultGraphsList();
    const storedActiveId = getActiveGraphIdFromStorage();

    if (storedActiveId) {
      const storedGraph = graphs.find((g) => g.id === storedActiveId);
      if (storedGraph) {
        return { ...storedGraph, active: true };
      }
    }

    const activeGraph = graphs.find((g) => g.active);
    if (activeGraph) {
      return activeGraph;
    }

    return (
      graphs[0] || {
        id: "empty-graph",
        name: "No Graph Selected",
        description: "Please add a graph.",
        active: false,
        nodes: [],
        links: [],
      }
    );
  }, [getDefaultGraphsList]);

  const [activeGraph, setActiveGraph] = useState<GraphListItem>(() =>
    getDefaultActiveGraph(),
  );

  const updateActiveGraph = useCallback(
    (updater: (graph: GraphListItem) => GraphListItem) => {
      setGraphsList((prev) => {
        const updated = prev.map((graph) => {
          if (graph.id !== activeGraph.id) return graph;
          return updater(graph);
        });

        saveGraphsToStorage(updated);
        return updated;
      });

      setActiveGraph((prev) => updater(prev));
    },
    [activeGraph.id],
  );

  const updateNodeInActiveGraph = useCallback(
    (nodeId: string, updates: Partial<GraphNode>) => {
      updateActiveGraph((graph) => ({
        ...graph,
        nodes: graph.nodes.map((n) =>
          n.id === nodeId ? { ...n, ...updates } : n,
        ),
      }));
    },
    [updateActiveGraph],
  );

  const removeNodeFromActiveGraph = useCallback(
    (nodeId: string) => {
      updateActiveGraph((graph) => ({
        ...graph,
        nodes: graph.nodes.filter((n) => n.id !== nodeId),
        links: graph.links.filter(
          (l) => l.source !== nodeId && l.target !== nodeId,
        ),
        crossingNumber: undefined,
      }));
    },
    [updateActiveGraph],
  );

  const saveGraph = useCallback((graph: GraphListItem) => {
    // Export the full graph data as JSON, excluding the active flag
    const graphToExport: Omit<GraphListItem, "active"> & { active: false } = {
      id: graph.id,
      name: graph.name,
      description: graph.description,
      nodes: graph.nodes,
      links: graph.links,
      active: false,
    };

    const jsonString = JSON.stringify(graphToExport, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${graph.name}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const saveActiveGraph = useCallback(() => {
    saveGraph(activeGraph);
  }, [activeGraph, saveGraph]);

  const selectGraph = useCallback((graph: GraphListItem) => {
    setGraphsList((prev) =>
      prev.map((g) => ({
        ...g,
        active: g.id === graph.id,
      })),
    );

    setActiveGraph({ ...graph, active: true });
    saveActiveGraphIdToStorage(graph.id);
  }, []);

  const removeGraph = useCallback(
    (graph: GraphListItem) => {
      if (graphsList.length <= 1) {
        setGraphsList([]);
        setActiveGraph({
          id: "empty-graph",
          name: "No Graph Selected",
          description: "Please add a graph.",
          active: false,
          nodes: [],
          links: [],
        });
        saveGraphsToStorage([]);
        return;
      }

      const updatedGraphs = graphsList.filter((g) => g.id !== graph.id);
      setGraphsList(updatedGraphs);
      saveGraphsToStorage(updatedGraphs);

      if (activeGraph.id === graph.id) {
        if (updatedGraphs.length > 0) {
          selectGraph(updatedGraphs[0]);
        }
      }
    },
    [graphsList, activeGraph.id, selectGraph],
  );

  const addGraph = useCallback(
    (graph: GraphListItem) => {
      if (graphsList.length === 1 && graphsList[0].id === "empty-graph") {
        const newGraphs = [graph];
        setGraphsList(newGraphs);
        setActiveGraph(graph);
        saveGraphsToStorage(newGraphs);
        return;
      }

      const newGraphs = [...graphsList, graph];
      setGraphsList(newGraphs);
      saveGraphsToStorage(newGraphs);
    },
    [graphsList],
  );

  return {
    graphsList,
    activeGraph,
    selectGraph,
    addGraph,
    removeGraph,
    updateActiveGraph,
    updateNodeInActiveGraph,
    removeNodeFromActiveGraph,
    saveActiveGraph,
  };
}
