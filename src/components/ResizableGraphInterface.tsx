import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import ForceGraph from "@/components/ForceGraph";
import { BananaTreeSelectionForm } from "./GraphSelectionForm";
import React from "react";
import createBananaTree from "@/utils/banana-tree";
import CollapsibleCard from "./ui/collapsible-card";
import type { GraphListItem } from "@/components/GraphSelectionForm";

export function ResizableGraphInterface() {
    const sampleGraph: GraphListItem = {
        id: "sample-graph",
        name: "B(3, 2)",
        description: "Sample Banana Tree Graph with n=3, k=2",
        active: true,
        ...createBananaTree(3, 2),
    };

    // const { nodes: sampleNodes2, links: sampleLinks2 } = ; // Another sample graph
    const sampleGraph2: GraphListItem = {
        id: "sample-graph-2",
        name: "B(3, 3)",
        description: "Sample Banana Tree Graph with n=3, k=3",
        active: false,
        ...createBananaTree(3, 3),
    };

    const [graphsList, setGraphsList] = React.useState<GraphListItem[]>([
        sampleGraph,
        sampleGraph2,
    ]);
    const [activeGraph, setActiveGraph] =
        React.useState<GraphListItem>(sampleGraph);

    const selectGraph = (graph: GraphListItem) => {
        activeGraph.active = false;
        graph.active = true;
        setActiveGraph(graph);
    };

    const removeGraph = (graph: GraphListItem) => {
        setGraphsList((prevGraphs) =>
            prevGraphs.filter((g) => g.id !== graph.id)
        );
    };

    const addGraph = (graph: GraphListItem) => {
        setGraphsList((prevGraphs) => [...prevGraphs, graph]);
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
                    />
                </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={25} minSize={18}>
                <div className="flex flex-col h-[calc(100vh-90px-2rem)]">
                    <CollapsibleCard title="Select a graph">
                        <BananaTreeSelectionForm
                            currentGraphsList={graphsList}
                            selectGraph={selectGraph}
                            addGraph={addGraph}
                            removeGraph={removeGraph}
                        />
                    </CollapsibleCard>
                    <CollapsibleCard title="Select a labeling">
                        <div className="flex flex-col items-center justify-center h-full p-4">
                            TODO: Add labeling options here
                        </div>
                    </CollapsibleCard>
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}
