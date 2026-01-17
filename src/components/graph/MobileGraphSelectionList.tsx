import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ListSelection from "@/components/layout/ListSelection";
import type { GraphListItem } from "@/types/graph";
import { Separator } from "@/components/ui/separator";

interface ListSelectionProps<T> {
  list: Array<T>;
  onSelect: (graph: T) => void;
  onDelete: (graph: T) => void;
  emptyMessage?: React.ReactNode;
}

export default function MobileGraphSelectionList({
  list,
  onSelect,
  onDelete,
  emptyMessage,
}: ListSelectionProps<GraphListItem>) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Select a graph</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select a graph to show</DialogTitle>
        </DialogHeader>

        <Separator className="my-4" />

        <ListSelection
          list={list}
          onSelect={onSelect}
          onDelete={onDelete}
          emptyMessage={emptyMessage}
        />
      </DialogContent>
    </Dialog>
  );
}
