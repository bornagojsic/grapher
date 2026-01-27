import React, { useState, useEffect } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import type { GraphListItem } from "@/types/graph";
import { graphManipulationService } from "@/services/graphManipulationService";
import type { GraphOperation } from "@/types/service";
import { useTheme } from "../theme/theme-provider";

interface GraphOptionsMenuProps {
  children: React.ReactNode;
  graph: GraphListItem;
  onGraphUpdate?: (updatedGraph: GraphListItem) => void;
  onDownloadGraph?: () => void;
}

const GraphOptionsMenu: React.FC<GraphOptionsMenuProps> = ({
  children,
  graph,
  onGraphUpdate,
  onDownloadGraph,
}) => {
  const [availableOperations, setAvailableOperations] = useState<
    GraphOperation[]
  >([]);

  const theme = useTheme();

  useEffect(() => {
    // Get available operations from the service
    const operations = graphManipulationService.getAvailableOperations();
    console.log("Operations:", operations);
    setAvailableOperations(operations);
  }, []);

  const handleOperationClick = async (operationId: string) => {
    try {
      // Clone the graph to avoid direct mutation
      const graphClone = JSON.parse(JSON.stringify(graph));

      // Execute the operation
      await graphManipulationService.executeOperation(
        operationId,
        graphClone,
        theme.theme,
      );

      // Update the graph in the parent component
      if (onGraphUpdate) {
        onGraphUpdate(graphClone);
        console.log("Graph updated!");
      }
    } catch (error) {
      console.error(`Error executing operation ${operationId}:`, error);
      alert(`Error executing operation: ${(error as Error).message}`);
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger className="w-full h-full">
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem onClick={onDownloadGraph}>
          Download Graph
        </ContextMenuItem>

        <ContextMenuSeparator />

        {availableOperations.map((operation, index) => (
          <div key={operation.id}>
            {index > 0 && <ContextMenuSeparator />}
            <ContextMenuItem
              onClick={() => handleOperationClick(operation.id)}
              className="py-2"
            >
              <div className="flex items-center">
                {operation.icon && (
                  <span className="mr-2">{operation.icon}</span>
                )}
                <div>
                  <div className="font-medium">{operation.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {operation.description}
                  </div>
                </div>
              </div>
            </ContextMenuItem>
          </div>
        ))}
        {availableOperations.length > 0 && <ContextMenuSeparator />}

        <ContextMenuItem disabled>Show Dominating Sets</ContextMenuItem>
        <ContextMenuItem disabled>Show Independent Sets</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default GraphOptionsMenu;
