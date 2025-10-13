"use client";

import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { GraphLink, GraphNode } from "./ForceGraph";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import ListSelection from "./ListSelection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import BananaTreeCreationForm, { formSchema } from "./BananaTreeCreationForm";
import EdgeListCreationForm from "./EdgeListCreationForm";

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
  addGraph?: (graph: GraphListItem) => void;
  removeGraph?: (graph: GraphListItem) => void;
  defaultValues?: z.infer<typeof formSchema>;
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
            <span className="text-sm text-muted-foreground">
              (no current graphs)
            </span>
          }
        />

        <Separator className="m-4" />

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Add a new graph</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add a new graph</DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="banana-tree" className="flex flex-col">
              <TabsList style={{ padding: "0" }}>
                <TabsTrigger value="banana-tree">Banana tree</TabsTrigger>
                <TabsTrigger value="edge-list">From edge list</TabsTrigger>
                {/* <TabsTrigger value="adjacency-matrix">
                                    From adjacency matrix
                                </TabsTrigger> */}
              </TabsList>
              <TabsContent value="banana-tree" className="p-2 min-h-[250px]">
                <h2 className="text-lg font-semibold mb-4">
                  Select B(n, k) parameters
                </h2>
                <BananaTreeCreationForm
                  defaultValues={defaultValues}
                  addGraph={addGraph}
                />
              </TabsContent>
              <TabsContent value="edge-list" className="p-2 min-h-[250px]">
                <h2 className="text-lg font-semibold mb-4">
                  Create a new graph from edge list
                </h2>
                <EdgeListCreationForm addGraph={addGraph} />
              </TabsContent>
              <TabsContent
                value="adjacency-matrix"
                className="p-2 min-h-[250px]"
              >
                TODO: Add from for adjacency matrix
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
