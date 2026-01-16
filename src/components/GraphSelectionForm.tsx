"use client";

import { Separator } from "@/components/ui/separator";
import type { GraphLink, GraphNode } from "./ForceGraph";
import ListSelection from "./ListSelection";
import type { BananaTreeCreationProps } from "./BananaTreeCreationForm";
import AddGraphDialog from "./AddGraphDialog";

export type GraphListItem = {
  id: string;
  name: string;
  description?: string;
  nodes: Array<GraphNode>;
  links: Array<GraphLink>;
  active: boolean;
};

interface GraphSelectionFormProps {
  currentGraphsList?: Array<GraphListItem>;
  selectGraph?: (graph: GraphListItem) => void;
  addGraph: (graph: GraphListItem) => void;
  removeGraph?: (graph: GraphListItem) => void;
  defaultValues?: BananaTreeCreationProps;
}

export function GraphSelectionForm({
  currentGraphsList,
  selectGraph,
  addGraph,
  removeGraph,
  defaultValues,
}: GraphSelectionFormProps) {
  return (
    <div className="w-full py-4 h-full">
      <div className="flex flex-col items-center mb-4 h-full">
        <h2 className="text-lg font-semibold">Select a graph to show</h2>

        <Separator className="m-4" />

        <ListSelection
          list={currentGraphsList || []}
          onSelect={(graph) => {
            selectGraph?.(graph);
          }}
          onDelete={(graph) => {
            removeGraph?.(graph);
          }}
          emptyMessage={
            <span className="text-sm text-muted-foreground">(no graphs)</span>
          }
        />

        <Separator className="m-4" />

        <AddGraphDialog defaultValues={defaultValues} addGraph={addGraph} />
      </div>
    </div>
  );
}
