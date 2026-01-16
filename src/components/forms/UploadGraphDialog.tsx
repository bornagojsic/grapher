import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { GraphListItem, GraphNode, GraphLink } from "@/types/graph";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload } from "lucide-react";

interface UploadGraphDialogProps {
  addGraph: (graph: GraphListItem) => void;
  existingGraphIds?: string[];
}

export default function UploadGraphDialog({
  addGraph,
  existingGraphIds = [],
}: UploadGraphDialogProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const validateGraph = (data: unknown): data is GraphListItem => {
    if (!data || typeof data !== "object") {
      return false;
    }

    const graph = data as Partial<GraphListItem>;

    // Check required fields
    if (
      typeof graph.id !== "string" ||
      typeof graph.name !== "string" ||
      !Array.isArray(graph.nodes) ||
      !Array.isArray(graph.links)
    ) {
      return false;
    }

    // Validate nodes
    for (const node of graph.nodes) {
      if (
        !node ||
        typeof node !== "object" ||
        typeof (node as GraphNode).id !== "string" ||
        typeof (node as GraphNode).label !== "string"
      ) {
        return false;
      }
    }

    // Validate links
    for (const link of graph.links) {
      if (
        !link ||
        typeof link !== "object" ||
        typeof (link as GraphLink).source !== "string" ||
        typeof (link as GraphLink).target !== "string"
      ) {
        return false;
      }
    }

    return true;
  };

  const processFile = async (file: File) => {
    setError(null);

    // Check file type
    if (!file.name.endsWith(".json") && file.type !== "application/json") {
      setError("Please select a JSON file.");
      return;
    }

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      // Validate the graph structure
      if (!validateGraph(parsed)) {
        setError(
          "Invalid graph file. The file must contain id, name, nodes, and links fields.",
        );
        return;
      }

      // Generate a new unique ID to avoid conflicts
      let newId = crypto.randomUUID();
      while (existingGraphIds.includes(newId)) {
        newId = crypto.randomUUID();
      }

      // Create the graph with new ID and active set to false
      const graphToAdd: GraphListItem = {
        ...parsed,
        id: newId,
        active: false,
      };

      addGraph(graphToAdd);

      // Reset file input and close dialog
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setOpen(false);
      setError(null);
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError("Invalid JSON file. Please check the file format.");
      } else {
        setError(
          "Failed to read the file. Please make sure it's a valid graph file.",
        );
      }
      console.error("Error uploading graph:", err);
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    await processFile(file);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Upload Graph</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Graph</DialogTitle>
          <DialogDescription>
            Drag and drop a JSON file or click to browse
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div
            ref={dropZoneRef}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative flex flex-col items-center justify-center
              min-h-[200px] w-full
              border-2 border-dashed rounded-lg
              transition-colors cursor-pointer
              ${isDragging
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-accent/50"
              }
            `}
            onClick={() => fileInputRef.current?.click()}
          >
            <Input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-3 p-6">
              <Upload
                className={`h-12 w-12 ${isDragging ? "text-primary" : "text-muted-foreground"}`}
              />
              <div className="text-center">
                <p className="text-sm font-medium">
                  {isDragging
                    ? "Drop your graph file here"
                    : "Drag and drop a JSON file here"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  or click to browse
                </p>
              </div>
            </div>
          </div>
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3">
              {error}
            </div>
          )}
          <p className="text-sm text-muted-foreground">
            The file should be a JSON file exported from Grapher, containing the
            graph structure with nodes, links, and metadata.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
