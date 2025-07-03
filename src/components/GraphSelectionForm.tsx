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
        <div className="w-full max-w-md py-4">
            <div className="flex flex-col items-center mb-4">
                <h2 className="text-lg font-semibold">
                    Select a graph to show
                </h2>

                <Separator className="m-4" />

                <ListSelection
                    list={currentGraphsList || []}
                    onSelect={(graph) => {
                        selectGraph?.(graph);
                    }}
                    onDelete={(graph) => {
                        removeGraph?.(graph);
                    }}
                >
                    <span className="text-sm text-muted-foreground">
                        (no current graphs)
                    </span>
                </ListSelection>

                <Separator className="m-4" />

                <Dialog>
                    <form>
                        <DialogTrigger asChild>
                            <Button variant="outline">Add a new graph</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Add a new graph</DialogTitle>
                            </DialogHeader>

                            <Tabs
                                defaultValue="banana-tree"
                                className="flex flex-col"
                            >
                                <TabsList style={{ padding: "0" }}>
                                    <TabsTrigger value="banana-tree">
                                        Banana tree
                                    </TabsTrigger>
                                    <TabsTrigger value="adjacency-matrix">
                                        From adjacency matrix
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent
                                    value="banana-tree"
                                    className="p-2"
                                >
                                    <h2 className="text-lg font-semibold mb-4">
                                        Select B(n, k) parameters
                                    </h2>
                                    <BananaTreeCreationForm
                                        defaultValues={defaultValues}
                                        addGraph={addGraph}
                                    />
                                </TabsContent>
                                <TabsContent
                                    value="adjacency-matrix"
                                    className="p-2"
                                >
                                    TODO: Add from for adjacency matrix
                                </TabsContent>
                            </Tabs>
                        </DialogContent>
                    </form>
                </Dialog>
            </div>
        </div>
    );
}
