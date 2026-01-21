import ForceGraph from "@/components/graph/ForceGraph";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { GraphSelectionForm } from "@/components/graph/GraphSelectionForm";
import { useTheme } from "@/components/theme/theme-provider";
import { useGraphs } from "@/hooks/useGraphs";
import { useState, useEffect } from "react";

export function ResizableGraphInterface() {
  const theme = useTheme();
  const defaultColor = theme.theme === "light" ? "#2B7FFF" : "#155DFC";

  // State to track screen size and determine layout direction
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // Using 768px as mobile breakpoint
    };

    // Initial check
    checkScreenSize();

    // Add resize listener
    window.addEventListener("resize", checkScreenSize);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

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
      direction={isMobile ? "vertical" : "horizontal"}
      className="rounded-lg border w-full main-panel h-[calc(100vh-88px-2rem)]"
    >
      <ResizablePanel
        defaultSize={isMobile ? 70 : 75}
        minSize={isMobile ? 70 : 65}
        className={isMobile ? "pb-2" : ""}
      >
        <div
          className={`flex h-[calc(100vh-90px-2rem)] ${isMobile ? "h-[60vh]" : ""} items-center justify-center`}
        >
          <ForceGraph
            nodes={activeGraph.nodes}
            links={activeGraph.links}
            onUpdateNode={updateNodeInActiveGraph}
            onDeleteNode={removeNodeFromActiveGraph}
            onSaveGraph={saveActiveGraph}
          />
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle={!isMobile} />
      <ResizablePanel
        defaultSize={isMobile ? 30 : 25}
        minSize={isMobile ? 30 : 18}
        maxSize={isMobile ? 30 : 100}
      >
        <div
          className={`flex flex-col ${isMobile ? "h-[35vh]" : "h-[calc(100vh-90px-2rem)]"}`}
        >
          <GraphSelectionForm
            currentGraphsList={graphsList}
            selectGraph={selectGraph}
            addGraph={addGraph}
            removeGraph={removeGraph}
            isMobile={isMobile}
            activeGraph={activeGraph}
          />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
