import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import type { GraphListItem } from "./GraphSelectionForm";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useTheme } from "@/components/theme-provider";

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Name is required.",
    })
    .max(25, {
      message: "Name must be at most 25 characters long.",
    }),
  edgeList: z.string().refine(
    (val: string) => {
      // Validate edge list format: "1-2;2-3;3-4"
      const edges = val.split(";");
      return edges.every((edge) => {
        const parts = edge.split("-");
        return parts.length === 2;
      });
    },
    {
      message:
        "Edge list must be in the format 'node_1-node_2;node_2-node_3;node_3-node_4'",
    },
  ),
});

export default function EdgeListCreationForm({
  addGraph,
}: {
  addGraph?: (graph: GraphListItem) => void;
}) {
  const theme = useTheme();
  const defaultColor = theme.theme === "light" ? "#2B7FFF" : "#155DFC";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "Edge Graph",
      edgeList: "1-2;2-3;3-4;4-5;5-1",
    },
  });

  function parseEdgeList(edgeList: string): GraphListItem {
    const nodeNames = Array.from(
      new Set(
        edgeList
          .split(";")
          .flatMap((edge) => edge.split("-").map((part) => part.trim())),
      ),
    );

    const nodes = nodeNames.map((name) => ({
      id: name,
      name: name,
      label: name,
      color: defaultColor,
    }));

    const edges = edgeList.split(";").map((edge) => {
      const parts = edge.split("-");
      return {
        source: parts[0].trim(),
        target: parts[1].trim(),
      };
    });

    return {
      id: crypto.randomUUID(),
      name: "Edge Graph",
      description: `Graph with edges: ${edgeList}`,
      active: false,
      links: edges,
      nodes,
    };
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    const graph = parseEdgeList(values.edgeList);
    graph.name = values.name;

    addGraph?.(graph);

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
                  placeholder="Edge Graph"
                  {...field}
                  className="max-w-[250px] min-w-[250px]"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="edgeList"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-2 flex-wrap justify-center">
              {/* <FormLabel>Edge List:</FormLabel> */}
              <FormControl>
                <Textarea
                  placeholder="1-2;2-3;3-4;4-5;5-1"
                  {...field}
                  className="max-w-[250px] min-w-[250px]"
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
