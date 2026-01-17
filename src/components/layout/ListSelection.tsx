import type { GraphListItem } from "@/types/graph";
import ListSelectionItem from "./ListSelectionItem";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ListSelectionProps<T> {
  list: Array<T>;
  onSelect: (graph: T) => void;
  onDelete: (graph: T) => void;
  emptyMessage?: React.ReactNode;
}

export default function ListSelection({
  list,
  onSelect,
  onDelete,
  emptyMessage,
}: ListSelectionProps<GraphListItem>) {
  if (!list || !Array.isArray(list) || list.length === 0) {
    return emptyMessage;
  }

  return (
    <ScrollArea className="w-full h-fit max-h-[400px] rounded-md border overflow-y-auto p-2.5">
      {list.map((item) => (
        <ListSelectionItem
          key={item.id}
          active={item.active}
          title={item.name}
          onClick={() => {
            onSelect(item);
          }}
          onDelete={() => {
            onDelete(item);
          }}
        />
      ))}
    </ScrollArea>
  );
}
