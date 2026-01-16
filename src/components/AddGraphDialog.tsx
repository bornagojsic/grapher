import { z } from "zod";
import { Button } from "@/components/ui/button";
import type { GraphListItem } from "./GraphSelectionForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import BananaTreeCreationForm, { formSchema } from "./BananaTreeCreationForm";
import EdgeListCreationForm from "./EdgeListCreationForm";
import AdjacencyMatrixCreationForm from "./AdjacencyMatrixCreationForm";

export default function AddGraphDialog({
  addGraph,
  defaultValues,
}: {
  addGraph: (graph: GraphListItem) => void;
  defaultValues: z.infer<typeof formSchema>;
}) {
  return (
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
            <TabsTrigger value="adjacency-matrix">
              From adjacency matrix
            </TabsTrigger>
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
          <TabsContent value="adjacency-matrix" className="p-2 min-h-[250px]">
            <h2 className="text-lg font-semibold mb-4">
              Create a new graph from adjacency matrix
            </h2>
            <AdjacencyMatrixCreationForm addGraph={addGraph} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
