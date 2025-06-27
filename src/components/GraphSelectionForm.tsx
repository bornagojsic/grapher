"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import createBananaTree from "@/utils/banana-tree";
import { Label } from "./ui/label";

const formSchema = z.object({
    name: z
        .string()
        .min(1, {
            message: "Name is required.",
        })
        .max(25, {
            message: "Name must be at most 25 characters long.",
        }),
    n: z.coerce
        .number()
        .nonnegative()
        .int()
        .min(1, {
            message: "N must be at least 1.",
        })
        .max(50, {
            message: "N must be at most 50.",
        }),
    k: z.coerce
        .number()
        .nonnegative()
        .int()
        .min(1, {
            message: "K must be at least 1.",
        })
        .max(50, {
            message: "K must be at most 50.",
        }),
});

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

export function BananaTreeSelectionForm({
    currentGraphsList,
    selectGraph,
    addGraph,
    removeGraph,
    defaultValues,
}: GraphSelectionFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues || {
            name: "B(2, 1)",
            n: 2,
            k: 1,
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        addGraph?.({
            id: crypto.randomUUID(),
            name: values.name,
            description: `Banana tree with n = ${values.n} and k = ${values.k}.`,
            active: false,
            ...createBananaTree(values.n, values.k),
        });
    }

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
                                    <Form {...form}>
                                        <form
                                            onSubmit={form.handleSubmit(
                                                onSubmit
                                            )}
                                            className="space-y-2"
                                        >
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem className="items-center space-x-2 justify-center">
                                                        <Label>Name:</Label>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="B(n, k)"
                                                                {...field}
                                                                className="max-w-[250px] min-w-[250px]"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="n"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-center space-x-2 flex-wrap justify-center">
                                                        <FormLabel>
                                                            n:
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="1"
                                                                type="number"
                                                                {...field}
                                                                className="max-w-[100px]"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="k"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-center space-x-2 flex-wrap justify-center">
                                                        <FormLabel>
                                                            k:
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="1"
                                                                type="number"
                                                                {...field}
                                                                className="max-w-[100px]"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <Button
                                                variant="outline"
                                                type="submit"
                                            >
                                                Add graph
                                            </Button>
                                        </form>
                                    </Form>
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
