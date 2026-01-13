import ForceGraph from "@/components/ForceGraph";
import type { GraphListItem } from "@/components/GraphSelectionForm";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import createBananaTree from "@/utils/banana-tree";
import React from "react";
import { GraphSelectionForm } from "./GraphSelectionForm";
import { ScrollArea } from "./ui/scroll-area";
import { useTheme } from "@/components/theme-provider";
import type { GraphNode } from "@/components/ForceGraph";

export function ResizableGraphInterface() {
  const theme = useTheme();
  const defaultColor = theme.theme === "light" ? "#2B7FFF" : "#155DFC";

  let defaultGraphsList: GraphListItem[] = [
    {
      id: "sample-graph",
      name: "B(3, 2)",
      description: "Sample Banana Tree Graph with n=3, k=2",
      active: true,
      ...createBananaTree(3, 2, defaultColor),
    },
  ];

  const localStorageGraphs = localStorage.getItem("graphsList");
  if (localStorageGraphs) {
    try {
      const parsedGraphs = JSON.parse(localStorageGraphs);
      if (Array.isArray(parsedGraphs)) {
        defaultGraphsList = parsedGraphs;
      }
    } catch (error) {
      console.error("Failed to parse graphs from localStorage:", error);
    }
  }

  let defaultActiveGraph = defaultGraphsList.find((graph) => graph.active);
  if (!defaultActiveGraph) {
    defaultActiveGraph = defaultGraphsList[0];
  }

  const lastActiveGraphId = localStorage.getItem("activeGraphId");
  if (lastActiveGraphId) {
    const lastActiveGraph = defaultGraphsList.find(
      (graph) => graph.id === lastActiveGraphId,
    );
    if (lastActiveGraph) {
      // TODO: maybe add something
    } else {
      console.warn(
        `Last active graph with id ${lastActiveGraphId} not found in the default graphs list.`,
      );
    }
  }

  const updateActiveGraph = (
    updater: (graph: GraphListItem) => GraphListItem,
  ) => {
    setGraphsList((prev) => {
      const updated = prev.map((graph) => {
        if (graph.id !== activeGraph.id) return graph;
        return updater(graph);
      });

      localStorage.setItem("graphsList", JSON.stringify(updated));
      return updated;
    });

    setActiveGraph((prev) => updater(prev));
  };

  const updateNodeInActiveGraph = (
    nodeId: string,
    updates: Partial<GraphNode>,
  ) => {
    updateActiveGraph((graph) => ({
      ...graph,
      nodes: graph.nodes.map((n) =>
        n.id === nodeId ? { ...n, ...updates } : n,
      ),
    }));
  };

  const removeNodeFromActiveGraph = (nodeId: string) => {
    updateActiveGraph((graph) => ({
      ...graph,
      nodes: graph.nodes.filter((n) => n.id !== nodeId),
      links: graph.links.filter(
        (l) => l.source !== nodeId && l.target !== nodeId,
      ),
    }));
  };

  const updateLocalStorageGraphs = (graphs: GraphListItem[]) => {
    localStorage.setItem("graphsList", JSON.stringify(graphs));
  };

  const updateActiveGraphInLocalStorage = (graph: GraphListItem) => {
    localStorage.setItem("activeGraphId", graph.id);
  };

  const [graphsList, setGraphsList] =
    React.useState<GraphListItem[]>(defaultGraphsList);
  const [activeGraph, setActiveGraph] =
    React.useState<GraphListItem>(defaultActiveGraph);

  const selectGraph = (graph: GraphListItem) => {
    setGraphsList((prev) =>
      prev.map((g) => ({
        ...g,
        active: g.id === graph.id,
      })),
    );

    setActiveGraph({ ...graph, active: true });
    updateActiveGraphInLocalStorage(graph);
  };

  const removeGraph = (graph: GraphListItem) => {
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
      return;
    }
    setGraphsList((prevGraphs) => prevGraphs.filter((g) => g.id !== graph.id));
    if (activeGraph.id === graph.id) {
      const nextGraph = graphsList.find((g) => g.id !== graph.id);
      if (nextGraph) {
        selectGraph(nextGraph);
      } else {
        selectGraph(graphsList[0]); // Fallback to the first graph
      }
    }
    updateLocalStorageGraphs(graphsList.filter((g) => g.id !== graph.id));
  };

  const addGraph = (graph: GraphListItem) => {
    if (graphsList.length == 1 && graphsList[0].id === "empty-graph") {
      setGraphsList([graph]);
      setActiveGraph(graph);
      return;
    }
    setGraphsList((prevGraphs) => [...prevGraphs, graph]);
    updateLocalStorageGraphs([...graphsList, graph]);
  };

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="rounded-lg border w-100% main-panel h-[calc(100vh-88px-2rem)]"
    >
      <ResizablePanel defaultSize={75} minSize={65}>
        <div className="flex h-[calc(100vh-90px-2rem)] items-center justify-center">
          <ForceGraph
            nodes={activeGraph.nodes}
            links={activeGraph.links}
            onUpdateNode={updateNodeInActiveGraph}
            onDeleteNode={removeNodeFromActiveGraph}
          />
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={25} minSize={18}>
        <ScrollArea className="flex flex-col h-[calc(100vh-90px-2rem)]">
          {/* <div className="flex flex-col h-[calc(100vh-90px-2rem)]"> */}
          {/* <CollapsibleCard title="Select a graph"> */}
          <GraphSelectionForm
            currentGraphsList={graphsList}
            selectGraph={selectGraph}
            addGraph={addGraph}
            removeGraph={removeGraph}
          />
          {/* </CollapsibleCard> */}
          {/* <CollapsibleCard title="Select a labeling">
                        <LabelingSelectionForm />
                    </CollapsibleCard> */}
          {/* </div> */}
        </ScrollArea>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
