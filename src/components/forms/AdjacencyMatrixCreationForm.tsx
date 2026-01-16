import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import type { GraphListItem } from "@/types/graph";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/theme/theme-provider";
import parseAdjacencyMatrix from "@/utils/adjacency-matrix";

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Name is required.",
    })
    .max(25, {
      message: "Name must be at most 25 characters long.",
    }),
  adjacencyMatrix: z.string().refine(
    (val: string) => {
      // Validate adjacency matrix format: "1 0 0 0 0\n 0 1 0 0 0\n 0 0 1 0 0\n 0 0 0 1 0\n 0 0 0 0 1"
      const rows = val.split("\n");
      return rows.every((row) => {
        const parts = row.split(" ");
        return (
          parts.length === rows.length &&
          parts.every((part) => part === "0" || part === "1")
        );
      });
    },
    {
      message: "Adjacency matrix must be in the format '0 0 1\n 0 0 0\n 1 0 0'",
    },
  ),
});

export default function AdjacencyMatrixCreationForm({
  addGraph,
}: {
  addGraph: (graph: GraphListItem) => void;
}) {
  const theme = useTheme();
  const defaultColor = theme.theme === "light" ? "#2B7FFF" : "#155DFC";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      adjacencyMatrix: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const graph = parseAdjacencyMatrix(values.adjacencyMatrix, defaultColor);
    graph.name = values.name;

    addGraph(graph);

    form.reset();

    const closeButton = document.getElementsByClassName(
      "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    )[0] as HTMLElement | undefined;
    closeButton?.click();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="items-center space-x-2 justify-center">
              <Label>Name:</Label>
              <FormControl>
                <Input
                  placeholder="Adjacency Matrix Graph"
                  {...field}
                  className="max-w-[250px] min-w-[250px]"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="adjacencyMatrix"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-2 flex-wrap justify-center">
              <FormControl>
                <Textarea
                  placeholder="0 0 1\n0 0 0\n1 0 0"
                  {...field}
                  className="max-w-[250px] min-w-[250px] space-mono"
                  rows={5}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button variant="outline" type="submit" className="mt-2">
          Add graph
        </Button>
      </form>
    </Form>
  );
}
