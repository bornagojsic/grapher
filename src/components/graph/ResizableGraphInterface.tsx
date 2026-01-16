import ForceGraph from "@/components/graph/ForceGraph";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { GraphSelectionForm } from "@/components/graph/GraphSelectionForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTheme } from "@/components/theme/theme-provider";
import { useGraphs } from "@/hooks/useGraphs";

export function ResizableGraphInterface() {
  const theme = useTheme();
  const defaultColor = theme.theme === "light" ? "#2B7FFF" : "#155DFC";

  const {
    graphsList,
    activeGraph,
    selectGraph,
    addGraph,
    removeGraph,
    updateNodeInActiveGraph,
    removeNodeFromActiveGraph,
    saveActiveGraph,
  } = useGraphs({ defaultColor });

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
            onSaveGraph={saveActiveGraph}
          />
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={25} minSize={18}>
        <ScrollArea className="flex flex-col h-[calc(100vh-90px-2rem)]">
          <GraphSelectionForm
            currentGraphsList={graphsList}
            selectGraph={selectGraph}
            addGraph={addGraph}
            removeGraph={removeGraph}
          />
        </ScrollArea>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
