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
import NodeEditForm from "@/components/forms/NodeEditForm";
import { useTheme } from "@/components/theme/theme-provider";
import type { GraphLink, GraphNode } from "@/types/graph";
import GraphOptionsMenu from "./GraphOptionsMenu";
import "@/services/colorGraphOperation"; // Import to register the operation
import "@/services/crossingNumberOperation"; // Import to register the operation
import { getTextColorForBackground } from "@/utils/textColor";

interface ForceGraphProps {
  nodes: GraphNode[];
  links: Array<{ source: string; target: string; [key: string]: string }>;
  width?: number;
  height?: number;
  onUpdateNode: (id: string, updates: Partial<GraphNode>) => void;
  onDeleteNode: (id: string) => void;
  onSaveGraph: () => void;
}

// Helper function to calculate distance between two points
const getDistance = (
  a: { x: number; y: number },
  b: { x: number; y: number },
) => {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
};

// Helper function to calculate center point between two points
const getMidpoint = (
  a: { x: number; y: number },
  b: { x: number; y: number },
) => {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
};

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
  const [currentLinks, setLinks] = useState<GraphLink[]>(links);

  useEffect(() => {
    setNodes(nodes);
    setLinks(links);
  }, [nodes, links]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const simulationNodes = currentNodes.map((n) => ({ ...n }));
    const simulationLinks = currentLinks.map((l) => ({ ...l }));

    const showContextMenu = (event: MouseEvent | TouchEvent, d: GraphNode) => {
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
      })
      // Add touch event for context menu on mobile
      .on("touchstart", function (event: TouchEvent, d: GraphNode) {
        // Prevent default to avoid scrolling
        event.preventDefault();

        // Store the start time for long press detection
        const startTime = Date.now();
        //const touches = event.touches;

        // Handle touch end to detect long press
        const handleTouchEnd = () => {
          const endTime = Date.now();

          // If touch lasted more than 500ms, treat as long press
          if (endTime - startTime > 500) {
            showContextMenu(event, d);
          }

          // Remove event listeners
          window.removeEventListener("touchend", handleTouchEnd);
          window.removeEventListener("touchcancel", handleTouchEnd);
        };

        // Add event listeners
        window.addEventListener("touchend", handleTouchEnd);
        window.addEventListener("touchcancel", handleTouchEnd);
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
      .style("color", (d) => getTextColorForBackground(d.color || defaultColor))
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

    // Enhanced zoom behavior with touch support
    if (svgRef.current) {
      let lastTouchDistance: number | null = null;
      let initialPinchCenter: { x: number; y: number } | null = null;

      const zoomBehavior = d3
        .zoom<SVGSVGElement, unknown>()
        .filter((event) => {
          // Allow touch events and mouse events on background
          if ("touches" in event) {
            // For touch events, only allow if it's on the background (not on nodes)
            return (event.target as Element).tagName === "svg";
          }
          // For mouse events, only allow left click on background
          return event.button === 0 && event.target === svgRef.current;
        })
        .on("zoom", (event) => {
          g.attr("transform", event.transform);
        });

      d3.select(svgRef.current).call(zoomBehavior);

      // Add custom touch event handling for pinch zoom
      svg.on("touchstart", (event: TouchEvent) => {
        if (event.touches.length === 2) {
          event.preventDefault(); // Prevent default browser zoom
          lastTouchDistance = getDistance(
            { x: event.touches[0].clientX, y: event.touches[0].clientY },
            { x: event.touches[1].clientX, y: event.touches[1].clientY },
          );

          // Calculate initial pinch center
          initialPinchCenter = getMidpoint(
            { x: event.touches[0].clientX, y: event.touches[0].clientY },
            { x: event.touches[1].clientX, y: event.touches[1].clientY },
          );
        }
      });

      svg.on("touchmove", (event: TouchEvent) => {
        if (
          event.touches.length === 2 &&
          lastTouchDistance &&
          initialPinchCenter
        ) {
          event.preventDefault(); // Prevent default browser zoom

          const currentTouchDistance = getDistance(
            { x: event.touches[0].clientX, y: event.touches[0].clientY },
            { x: event.touches[1].clientX, y: event.touches[1].clientY },
          );

          const scaleDiff = currentTouchDistance / lastTouchDistance;

          // Get current transform
          const transform = d3.zoomTransform(svg.node() as SVGSVGElement);

          // Calculate new transform with scaling at pinch center
          const newTransform = transform
            .translate(initialPinchCenter.x, initialPinchCenter.y)
            .scale(scaleDiff)
            .translate(-initialPinchCenter.x, -initialPinchCenter.y);

          // Apply the new transform
          d3.select(svgRef.current!).call(zoomBehavior.transform, newTransform);

          lastTouchDistance = currentTouchDistance;
        }
      });

      // Reset touch variables on touch end
      svg.on("touchend", (event: TouchEvent) => {
        if (event.touches.length < 2) {
          lastTouchDistance = null;
          initialPinchCenter = null;
        }
      });
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
    <GraphOptionsMenu
      graph={{
        id: "current-graph",
        name: "Current Graph",
        nodes: currentNodes,
        links: currentLinks,
        active: true,
      }}
      onGraphUpdate={(updatedGraph) => {
        setNodes(updatedGraph.nodes);
        setLinks(updatedGraph.links);
      }}
      onDownloadGraph={onSaveGraph}
    >
      <div className="w-full h-full relative">
        <svg
          ref={svgRef}
          width={width}
          height={height}
          className="force-graph"
          style={{ cursor: "move" }}
        />
        {contextNode && (
          <Dialog
            open={dialogOpen}
            onOpenChange={() => {
              setDialogOpen(false);
              setContextNode(null);
            }}
          >
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
      </div>
    </GraphOptionsMenu>
  );
};

export default ForceGraph;
