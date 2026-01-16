import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import katex from "katex";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import NodeEditForm from "@/components/forms/NodeEditForm";
import { useTheme } from "@/components/theme/theme-provider";
import type { GraphNode } from "@/types/graph";

interface ForceGraphProps {
  nodes: GraphNode[];
  links: Array<{ source: string; target: string; [key: string]: string }>;
  width?: number;
  height?: number;
  onUpdateNode: (id: string, updates: Partial<GraphNode>) => void;
  onDeleteNode: (id: string) => void;
  onSaveGraph: () => void;
}

const ForceGraph: React.FC<ForceGraphProps> = ({
  nodes,
  links,
  width = 800,
  height = 600,
  onUpdateNode,
  onDeleteNode,
  onSaveGraph,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const [contextNode, setContextNode] = useState<GraphNode | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const theme = useTheme();
  const defaultColor = theme.theme === "light" ? "#2B7FFF" : "#155DFC";

  const [currentNodes, setNodes] = useState<GraphNode[]>(nodes);
  const [currentLinks, setLinks] = useState<
    Array<{ source: string; target: string; [key: string]: string }>
  >(links);

  useEffect(() => {
    setNodes(nodes);
    setLinks(links);
  }, [nodes, links]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const simulationNodes = currentNodes.map((n) => ({ ...n }));
    const simulationLinks = currentLinks.map((l) => ({ ...l }));

    const showContextMenu = (event: MouseEvent, d: GraphNode) => {
      event.preventDefault();
      setContextNode(d);
      setDialogOpen(true);
    };

    const simulation = d3
      .forceSimulation(simulationNodes)
      .force(
        "link",
        d3
          .forceLink(simulationLinks)
          .id((d: any) => d.id) // eslint-disable-line @typescript-eslint/no-explicit-any
          .distance(100),
      )
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2));

    // Create a group to apply transforms to (for panning)
    const g = svg.append("g");

    const link = g
      .append("g")
      .attr("stroke", "#aaa")
      .selectAll("line")
      .data(simulationLinks)
      .join("line")
      .attr("stroke-width", 2);

    const node = g
      .append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll<SVGCircleElement, GraphNode>("circle")
      .data(simulationNodes)
      .join("circle")
      .attr("r", 25)
      .attr("fill", (d) => d.color ?? defaultColor)
      .attr("class", (d) => (d.color ? "" : "default-color"))
      .style("cursor", "move")
      .on("mouseover", function () {
        d3.select(this).style("cursor", "grab");
      })
      .on("mouseout", function () {
        d3.select(this).style("cursor", "move");
      })
      .call(drag(simulation) as any) // eslint-disable-line @typescript-eslint/no-explicit-any
      .on("contextmenu", function (event: MouseEvent, d: GraphNode) {
        showContextMenu(event, d);
      });

    g.append("g")
      .attr("class", "latex-labels")
      .selectAll("foreignObject")
      .data(simulationNodes)
      .join("foreignObject")
      .attr("pointer-events", "none")
      .attr("width", 100)
      .attr("height", 30)
      .attr("overflow", "visible")
      .append("xhtml:div")
      .style("font-size", "14px")
      .style("text-align", "center")
      .each(function (d) {
        try {
          katex.render(d.label, this as HTMLElement, {
            throwOnError: false,
            displayMode: true,
          });
        } catch (err) {
          console.error("KaTeX render error:", err);
        }
      })
      .call(drag(simulation) as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    node.append("title").text((d) => d.label);

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as unknown as GraphNode).x!)
        .attr("y1", (d) => (d.source as unknown as GraphNode).y!)
        .attr("x2", (d) => (d.target as unknown as GraphNode).x!)
        .attr("y2", (d) => (d.target as unknown as GraphNode).y!);

      node.attr("cx", (d) => d.x!).attr("cy", (d) => d.y!);

      g.selectAll(".latex-labels foreignObject")
        .attr("x", (d) => (d as GraphNode).x! - 50)
        .attr("y", (d) => (d as GraphNode).y! - 25);
    });

    // Only pan when dragging the background (not on nodes)
    if (svgRef.current) {
      d3.select(svgRef.current).call(
        d3
          .zoom<SVGSVGElement, unknown>()
          .filter((event) => {
            return event.button === 0 && event.target === svgRef.current;
          })
          .on("zoom", (event) => {
            g.attr("transform", event.transform);
          }),
      );
    }

    function drag(simulation: d3.Simulation<GraphNode, undefined>) {
      function dragstarted(
        event: d3.D3DragEvent<SVGCircleElement, GraphNode, unknown>,
        d: GraphNode,
      ) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(
        event: d3.D3DragEvent<SVGCircleElement, GraphNode, unknown>,
        d: GraphNode,
      ) {
        d.fx = event.x;
        d.fy = event.y;
      }

      function dragended(
        event: d3.D3DragEvent<SVGCircleElement, GraphNode, unknown>,
        d: GraphNode,
      ) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }

      return d3
        .drag<SVGCircleElement, GraphNode>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }
  }, [currentNodes, currentLinks, width, height, defaultColor]);

  return (
    <ContextMenu>
      <ContextMenuTrigger className="w-full h-full">
        <svg
          ref={svgRef}
          width={width}
          height={height}
          className="force-graph"
          style={{ cursor: "move" }}
        />
        {contextNode && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Node Settings</DialogTitle>
                <DialogDescription>
                  Customize the appearance of the selected node.
                </DialogDescription>
                <NodeEditForm
                  defaultValues={{
                    name: contextNode.label,
                    color: contextNode.color ?? defaultColor,
                  }}
                  alreadyUsedNames={nodes.map((node) => node.label)}
                  onSave={(updates) => {
                    onUpdateNode(contextNode.id, updates);
                    setDialogOpen(false);
                  }}
                  onDelete={() => {
                    onDeleteNode(contextNode.id);
                    setDialogOpen(false);
                  }}
                />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )}
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => onSaveGraph()}>
          Download Graph
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem disabled>Calculate crossing number</ContextMenuItem>
        <ContextMenuItem disabled>Show Proper Node Coloring</ContextMenuItem>
        <ContextMenuItem disabled>Show Dominating Sets</ContextMenuItem>
        <ContextMenuItem disabled>Show Independent Sets</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default ForceGraph;
